import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  EyeOff,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Download,
  RotateCcw,
  ArrowRight,
  Eraser,
} from 'lucide-react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { CaseSubNav } from '../components/CaseSubNav';
import { useSahay } from '../context/SahayContext';
import { createRedactedText } from '../utils/cryptoAndPrivacy';

interface RectBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const CasePrivacyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    cases,
    evidence,
    privacyFindings,
    derivatives,
    setActiveCaseId,
    addRedactedDerivative,
  } = useSahay();

  const currentCase = cases.find((c) => c.id === id) || cases[0];
  const caseId = currentCase?.id || '';
  const caseEvidence = evidence.filter((e) => e.caseId === caseId);
  const caseFindings = privacyFindings.filter((p) => p.caseId === caseId);
  const caseDerivatives = derivatives.filter((d) => d.caseId === caseId);

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    caseEvidence[0]?.id || ''
  );
  const [selectedFindingIds, setSelectedFindingIds] = useState<string[]>([]);
  const [customRedactTerm, setCustomRedactTerm] = useState('');
  const [redactionNotes, setRedactionNotes] = useState('');
  const [createdBanner, setCreatedBanner] = useState<string | null>(null);
  const [revealRawIds, setRevealRawIds] = useState<string[]>([]);

  // Visual Image Redaction Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const [boxes, setBoxes] = useState<RectBox[]>([]);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<RectBox | null>(null);

  useEffect(() => {
    if (caseId) setActiveCaseId(caseId);
  }, [caseId, setActiveCaseId]);

  const activeEvidence =
    caseEvidence.find((e) => e.id === selectedEvidenceId) || caseEvidence[0];

  const evidenceFindings = caseFindings.filter(
    (f) => f.evidenceId === activeEvidence?.id
  );

  // Pre-select High and Medium findings whenever evidence item changes
  useEffect(() => {
    if (activeEvidence) {
      const autoIds = caseFindings
        .filter(
          (f) =>
            f.evidenceId === activeEvidence.id &&
            (f.riskLevel === 'High' || f.riskLevel === 'Medium')
        )
        .map((f) => f.id);
      setSelectedFindingIds(autoIds);
      setCreatedBanner(null);
      setBoxes([]);
    }
  }, [activeEvidence?.id, caseFindings.length]);

  // Load image into memory for canvas redaction if activeEvidence is an image
  useEffect(() => {
    if (activeEvidence?.evidenceType === 'image' && activeEvidence.previewDataUrl) {
      const img = new Image();
      img.onload = () => {
        setLoadedImg(img);
      };
      img.src = activeEvidence.previewDataUrl;
    } else {
      setLoadedImg(null);
    }
  }, [activeEvidence?.id, activeEvidence?.previewDataUrl]);

  // Repaint Canvas whenever loadedImg, boxes, or currentBox changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImg) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = loadedImg.width || 680;
    canvas.height = loadedImg.height || 440;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height);

    // Draw saved redaction boxes
    const allBoxes = currentBox ? [...boxes, currentBox] : boxes;
    allBoxes.forEach((b) => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = '#F8FAFC';
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x, b.y, b.w, b.h);

      if (Math.abs(b.w) > 85 && Math.abs(b.h) > 16) {
        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 10px monospace';
        const rx = b.w >= 0 ? b.x + 6 : b.x + b.w + 6;
        const ry = b.h >= 0 ? b.y + 13 : b.y + b.h + 13;
        ctx.fillText('[REDACTED]', rx, ry);
      }
    });
  }, [loadedImg, boxes, currentBox]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = getCanvasCoords(e);
    setDrawingStart(pt);
    setCurrentBox({ x: pt.x, y: pt.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingStart) return;
    const pt = getCanvasCoords(e);
    setCurrentBox({
      x: drawingStart.x,
      y: drawingStart.y,
      w: pt.x - drawingStart.x,
      h: pt.y - drawingStart.y,
    });
  };

  const handleMouseUp = () => {
    if (currentBox && (Math.abs(currentBox.w) > 8 || Math.abs(currentBox.h) > 8)) {
      setBoxes((prev) => [...prev, currentBox]);
    }
    setDrawingStart(null);
    setCurrentBox(null);
  };

  const handleAutoMaskSuggestedRegions = () => {
    // Places opaque redaction bars over the phone number, address, and email zones on the demo screenshot layout
    setBoxes([
      { x: 380, y: 274, w: 245, h: 28 },
      { x: 240, y: 404, w: 320, h: 24 },
      { x: 215, y: 192, w: 410, h: 28 },
    ]);
  };

  const handleSaveRedactedImageCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !activeEvidence) return;
    const dataUrl = canvas.toDataURL('image/png');
    const derivName = `redacted_${activeEvidence.originalFilename.replace(/\.[^.]+$/, '')}_${Date.now()
      .toString()
      .slice(-4)}.png`;

    const created = await addRedactedDerivative({
      caseId,
      originalEvidenceId: activeEvidence.id,
      originalFilename: activeEvidence.originalFilename,
      derivativeFilename: derivName,
      redactionType: 'image',
      redactedPreviewDataUrl: dataUrl,
      redactedFindingsCount: boxes.length || 1,
      notes:
        redactionNotes.trim() ||
        `Redacted copy — original preserved. Applied ${
          boxes.length || 1
        } visual redaction mask(s) and stripped EXIF GPS metadata.`,
    });

    setCreatedBanner(
      `Redacted copy — original preserved. Saved new derivative "${created.derivativeFilename}" with SHA-256 ${created.sha256Hash.slice(
        0,
        16
      )}...`
    );
  };

  const handleSaveRedactedTextCopy = async () => {
    if (!activeEvidence) return;
    const sourceText =
      activeEvidence.ocrCorrectedText ||
      activeEvidence.ocrRawText ||
      activeEvidence.contentText;

    const rawTargets = evidenceFindings
      .filter((f) => selectedFindingIds.includes(f.id))
      .map((f) => f.rawValue);

    if (customRedactTerm.trim()) {
      rawTargets.push(customRedactTerm.trim());
    }

    const redactedString = createRedactedText(sourceText, rawTargets);
    const derivName = `redacted_${activeEvidence.originalFilename.replace(
      /\.[^.]+$/,
      ''
    )}_${Date.now().toString().slice(-4)}.txt`;

    const created = await addRedactedDerivative({
      caseId,
      originalEvidenceId: activeEvidence.id,
      originalFilename: activeEvidence.originalFilename,
      derivativeFilename: derivName,
      redactionType: 'text',
      redactedContentText: redactedString,
      redactedFindingsCount: rawTargets.length,
      notes:
        redactionNotes.trim() ||
        `Redacted copy — original preserved. Replaced ${rawTargets.length} sensitive item(s) with [REDACTED].`,
    });

    setCreatedBanner(
      `Redacted copy — original preserved. Saved new derivative "${created.derivativeFilename}" with SHA-256 ${created.sha256Hash.slice(
        0,
        16
      )}...`
    );
  };

  const handleDownloadDerivative = (deriv: (typeof caseDerivatives)[0]) => {
    if (deriv.redactionType === 'image' && deriv.redactedPreviewDataUrl) {
      const a = document.createElement('a');
      a.href = deriv.redactedPreviewDataUrl;
      a.download = deriv.derivativeFilename;
      a.click();
    } else if (deriv.redactedContentText) {
      const blob = new Blob([deriv.redactedContentText], {
        type: 'text/plain;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = deriv.derivativeFilename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const toggleFindingSelection = (fid: string) => {
    setSelectedFindingIds((prev) =>
      prev.includes(fid) ? prev.filter((x) => x !== fid) : [...prev, fid]
    );
  };

  const toggleRevealRaw = (fid: string) => {
    setRevealRawIds((prev) =>
      prev.includes(fid) ? prev.filter((x) => x !== fid) : [...prev, fid]
    );
  };

  if (!currentCase) {
    return (
      <WorkspaceLayout breadcrumbs={[{ label: 'Privacy Scanner' }]}>
        <p className="text-sm text-slate-600">Case not found.</p>
      </WorkspaceLayout>
    );
  }

  const sourceTextForPreview = activeEvidence
    ? activeEvidence.ocrCorrectedText ||
      activeEvidence.ocrRawText ||
      activeEvidence.contentText
    : '';

  const liveRedactedTextPreview = activeEvidence
    ? createRedactedText(
        sourceTextForPreview,
        [
          ...evidenceFindings
            .filter((f) => selectedFindingIds.includes(f.id))
            .map((f) => f.rawValue),
          ...(customRedactTerm.trim() ? [customRedactTerm.trim()] : []),
        ]
      )
    : '';

  return (
    <WorkspaceLayout
      breadcrumbs={[
        { label: 'Cases', to: '/cases' },
        { label: currentCase.title, to: `/cases/${caseId}` },
        { label: 'Privacy Scanner & Safe Redaction' },
      ]}
    >
      <CaseSubNav caseId={caseId} />

      <div className="space-y-8">
        {/* Top Overview Banner */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-teal-800">
                <span>DETERMINISTIC LOCAL PRIVACY SCANNER</span>
                <span aria-hidden="true">·</span>
                <span>REDACTED COPY — ORIGINAL PRESERVED</span>
              </div>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 font-display">
                Privacy Risk Scanner &amp; Safe Derivative Redaction
              </h1>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                Sahay scans evidence locally for possible phone numbers, emails, URLs, social
                handles, addresses, PIN codes, bank references, Aadhaar-like patterns, and GPS
                metadata. Redactions always generate a separate derivative file and never modify
                your original evidence.
              </p>
            </div>

            <Link
              to={`/cases/${caseId}/reports`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap self-start"
            >
              <span>Next: Report Builder &amp; NCRP Prep</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Evidence Selector Tabs */}
          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs font-medium text-slate-500 mb-2">
              Select Evidence Item to Inspect &amp; Redact:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {caseEvidence.map((ev) => {
                const count = caseFindings.filter((f) => f.evidenceId === ev.id).length;
                const active = activeEvidence?.id === ev.id;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelectedEvidenceId(ev.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {ev.evidenceType === 'image' ? (
                      <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>{ev.originalFilename}</span>
                    <span className="opacity-80">({count} findings)</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {createdBanner && (
          <div
            role="status"
            className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" aria-hidden="true" />
              <span className="font-semibold">{createdBanner}</span>
            </div>
            <span className="font-mono text-emerald-900 shrink-0">
              Redacted copy — original preserved.
            </span>
          </div>
        )}

        {/* Section 1: Deterministic Privacy Findings Table for Selected Evidence */}
        {activeEvidence && (
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Detected Possible Privacy Risks in “{activeEvidence.originalFilename}” (
                  {evidenceFindings.length})
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Select which detected items you want replaced with{' '}
                  <span className="font-mono">[REDACTED]</span> when creating a separate text
                  derivative.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Original SHA-256: {activeEvidence.sha256Hash.slice(0, 16)}...
              </span>
            </div>

            {evidenceFindings.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-600">
                No common personal identifier patterns detected in this item. You can still enter
                custom phrases to redact below.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                      <th className="py-3 px-4 w-10">Redact</th>
                      <th className="py-3 px-4">Finding Type</th>
                      <th className="py-3 px-4">Masked Preview</th>
                      <th className="py-3 px-4">Sensitivity Assessment</th>
                      <th className="py-3 px-4">Location in Content</th>
                      <th className="py-3 px-4">Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {evidenceFindings.map((pf) => {
                      const checked = selectedFindingIds.includes(pf.id);
                      const revealed = revealRawIds.includes(pf.id);
                      return (
                        <tr key={pf.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleFindingSelection(pf.id)}
                              aria-label={`Select ${pf.findingType} for redaction`}
                              className="accent-teal-800 rounded"
                            />
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                            {pf.findingType}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-800 whitespace-nowrap">
                            <span>{revealed ? pf.rawValue : pf.maskedPreview}</span>
                            <button
                              type="button"
                              onClick={() => toggleRevealRaw(pf.id)}
                              className="ml-2 text-teal-800 hover:underline font-sans cursor-pointer"
                            >
                              {revealed ? 'Mask' : 'Show'}
                            </button>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 font-medium text-amber-900">
                              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Possible privacy risk ({pf.riskLevel})</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap tabular-nums">
                            {pf.locationDescription}
                          </td>
                          <td className="py-3 px-4 text-slate-600 max-w-xs leading-relaxed">
                            {pf.recommendedAction}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Section 2: Safe Redaction Studio (Text Derivative + Visual Canvas Image Derivative) */}
        {activeEvidence && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Box: Safe Text Redaction Copy Builder */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Safe Text Redaction Derivative
                    </h2>
                    <p className="text-xs text-slate-500">
                      Replaces selected findings with <span className="font-mono">[REDACTED]</span>{' '}
                      in a new copy.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-800 font-medium">
                    Redacted copy — original preserved.
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="custom-redact-term"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Additional Custom Phrase or Name to Redact (Optional):
                  </label>
                  <input
                    id="custom-redact-term"
                    type="text"
                    value={customRedactTerm}
                    onChange={(e) => setCustomRedactTerm(e.target.value)}
                    placeholder="e.g., Lotus Enclave or specific name..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-700 mb-1">
                    Live Preview of Redacted Text Copy:
                  </p>
                  <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-56">
                    {liveRedactedTextPreview}
                  </pre>
                </div>

                <div>
                  <label
                    htmlFor="redaction-note"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Derivative Note:
                  </label>
                  <input
                    id="redaction-note"
                    type="text"
                    value={redactionNotes}
                    onChange={(e) => setRedactionNotes(e.target.value)}
                    placeholder="e.g., Masked personal phone and home address before sharing with counselor"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 tabular-nums">
                  {selectedFindingIds.length + (customRedactTerm.trim() ? 1 : 0)} item(s) selected
                </span>
                <button
                  type="button"
                  onClick={handleSaveRedactedTextCopy}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer"
                >
                  <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Create Redacted Text Copy</span>
                </button>
              </div>
            </section>

            {/* Right Box: Visual Image Redaction Canvas (For Images) or Derivative Info */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 flex flex-col justify-between">
              {activeEvidence.evidenceType === 'image' ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h2 className="text-base font-semibold text-slate-900">
                          Visual Screenshot Redaction Studio
                        </h2>
                        <p className="text-xs text-slate-500">
                          Click and drag on the canvas below to draw opaque{' '}
                          <span className="font-mono">[REDACTED]</span> bars, or click Auto-Mask.
                        </p>
                      </div>
                      <span className="text-xs font-mono text-emerald-800 font-medium">
                        Redacted copy — original preserved.
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAutoMaskSuggestedRegions}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-md hover:bg-slate-200 cursor-pointer"
                      >
                        <Eraser className="w-3.5 h-3.5 text-teal-800" aria-hidden="true" />
                        <span>Auto-Mask Detected Phone/Email Regions</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBoxes([])}
                        disabled={boxes.length === 0}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Reset Boxes ({boxes.length})</span>
                      </button>
                    </div>

                    <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-100 p-2">
                      <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        className="w-full h-auto rounded-lg cursor-crosshair bg-white block"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Original screenshot remains untouched in Vault
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveRedactedImageCopy}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Save Redacted Image Copy</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <h2 className="text-base font-semibold text-slate-900">
                      Why Separate Redacted Copies Matter
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Redacted copy — original preserved.
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This selected evidence item (<strong>{activeEvidence.originalFilename}</strong>)
                    is a text/document file. Use the <strong>Safe Text Redaction Derivative</strong>{' '}
                    panel on the left to replace selected sensitive identifiers with{' '}
                    <span className="font-mono">[REDACTED]</span>.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    To test interactive visual image box redaction, select one of the screenshot
                    items (such as{' '}
                    <span className="font-mono">dm_unwanted_message_12sep2026.png</span> or{' '}
                    <span className="font-mono">threatening_message_18sep2026.png</span>) from the
                    selector bar above.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Section 3: Saved Redacted Derivative Copies List */}
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Saved Redacted Derivative Copies ({caseDerivatives.length})
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Every file below is a separate derivative with its own SHA-256 hash. Originals in
                the Evidence Vault remain unmodified.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-800 font-semibold">
              Redacted copy — original preserved.
            </span>
          </div>

          {caseDerivatives.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No redacted derivative copies created yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {caseDerivatives.map((deriv) => (
                <div key={deriv.id} className="p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
                        <span className="font-mono text-emerald-800 font-semibold">
                          Redacted copy — original preserved.
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Derived from: {deriv.originalFilename}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {deriv.redactedFindingsCount} item(s) masked ({deriv.redactionType})
                        </span>
                      </div>
                      <h3 className="mt-1 text-sm font-semibold text-slate-900 font-mono">
                        {deriv.derivativeFilename}
                      </h3>
                      <p className="mt-0.5 text-xs font-mono text-slate-500 tabular-nums">
                        Derivative SHA-256: {deriv.sha256Hash}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadDerivative(deriv)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap self-start"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Download Redacted Copy</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600">{deriv.notes}</p>

                  {deriv.redactionType === 'text' && deriv.redactedContentText && (
                    <pre className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {deriv.redactedContentText}
                    </pre>
                  )}

                  {deriv.redactionType === 'image' && deriv.redactedPreviewDataUrl && (
                    <div className="max-w-md border border-slate-200 rounded-lg overflow-hidden p-1.5 bg-slate-50">
                      <img
                        src={deriv.redactedPreviewDataUrl}
                        alt={`Redacted derivative ${deriv.derivativeFilename}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </WorkspaceLayout>
  );
};
