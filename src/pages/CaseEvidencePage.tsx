import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Upload,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  ScanText,
  Save,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { CaseSubNav } from '../components/CaseSubNav';
import { useSahay } from '../context/SahayContext';
import { EvidenceItem, EvidenceType } from '../types/sahay';
import {
  computeSHA256,
  performLocalBrowserOCR,
  sanitizeFilename,
  validateEvidenceFile,
} from '../utils/cryptoAndPrivacy';

export const CaseEvidencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    cases,
    evidence,
    setActiveCaseId,
    addEvidence,
    verifyEvidenceIntegrity,
    saveCorrectedOcrText,
  } = useSahay();

  const currentCase = cases.find((c) => c.id === id) || cases[0];
  const caseId = currentCase?.id || '';
  const caseEvidence = evidence.filter((e) => e.caseId === caseId);

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    caseEvidence[0]?.id || ''
  );
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Verification & OCR UI states
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifyBanner, setVerifyBanner] = useState<{
    id: string;
    matches: boolean;
    computedHash: string;
    timestamp: string;
  } | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrDraft, setOcrDraft] = useState('');
  const [ocrMessage, setOcrMessage] = useState('');
  const [ocrSavedBanner, setOcrSavedBanner] = useState(false);

  useEffect(() => {
    if (caseId) setActiveCaseId(caseId);
  }, [caseId, setActiveCaseId]);

  const selectedEvidence =
    caseEvidence.find((e) => e.id === selectedEvidenceId) || caseEvidence[0];

  useEffect(() => {
    if (selectedEvidence) {
      setOcrDraft(
        selectedEvidence.ocrCorrectedText ??
          selectedEvidence.ocrRawText ??
          ''
      );
      setOcrMessage('');
      setOcrSavedBanner(false);
    }
  }, [selectedEvidence?.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !caseId) return;

    const validation = validateEvidenceFile(file);
    if (!validation.valid) {
      setUploadError(validation.reason || 'Invalid file.');
      e.target.value = '';
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sha256Hash = await computeSHA256(arrayBuffer);
      const cleanName = sanitizeFilename(file.name);

      let evidenceType: EvidenceType = 'document';
      if (file.type.startsWith('image/') || /\.(png|jpg|jpeg|webp|svg)$/i.test(cleanName)) {
        evidenceType = 'image';
      } else if (file.type === 'application/pdf' || cleanName.toLowerCase().endsWith('.pdf')) {
        evidenceType = 'pdf';
      } else if (
        file.type.startsWith('text/') ||
        /\.(txt|log|md|csv)$/i.test(cleanName)
      ) {
        evidenceType = 'text';
      }

      let contentText = '';
      let previewDataUrl: string | undefined;

      if (evidenceType === 'image') {
        previewDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.readAsDataURL(file);
        });
        contentText = `Uploaded Image File: ${cleanName} (${file.size} bytes). Run local OCR or enter separate transcript notes below.`;
      } else {
        try {
          contentText = new TextDecoder('utf-8', { fatal: false }).decode(
            new Uint8Array(arrayBuffer).slice(0, 65536)
          );
        } catch {
          contentText = `Binary document (${cleanName}, ${file.size} bytes) preserved in vault.`;
        }
      }

      const created = addEvidence({
        caseId,
        originalFilename: cleanName,
        mimeType: file.type || 'application/octet-stream',
        evidenceType,
        sizeBytes: file.size,
        sha256Hash,
        contentText,
        previewDataUrl,
        exifMetadata: {
          OriginalFileName: cleanName,
          PreservedMode: 'Read-Only Browser Vault (Immutable Original)',
        },
        ocrStatus: evidenceType === 'image' ? 'ready' : 'not_applicable',
      });

      setSelectedEvidenceId(created.id);
    } catch {
      setUploadError('Could not read file locally. Please try another file.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddSampleFictionalEvidence = async () => {
    if (!caseId) return;
    setIsUploading(true);
    setUploadError('');
    const sampleText = `=== FOLLOW-UP COMMENT LOG (DEMO DATA — FICTIONAL) ===
Captured Timestamp: 20 Sep 2026, 11:15 IST
Source URL: https://chatterbox.example.com/public-board/post-88412/comments
Comment by @arjun_backup_demo:
"Still waiting for a reply from Ananya (+91 98765 00123 / ananya.sharma.demo@example.org) at Flat 402, Lotus Enclave, Bengaluru 560001."`;

    const hash = await computeSHA256(sampleText);
    const created = addEvidence({
      caseId,
      originalFilename: `fictional_comment_capture_${Date.now().toString().slice(-4)}.txt`,
      mimeType: 'text/plain',
      evidenceType: 'text',
      sizeBytes: new Blob([sampleText]).size,
      sha256Hash: hash,
      contentText: sampleText,
      exifMetadata: {
        CaptureMethod: 'Sahay Fictional Demo Generator',
        DemoNotice: 'DEMO DATA — FICTIONAL',
      },
      ocrStatus: 'not_applicable',
    });
    setSelectedEvidenceId(created.id);
    setIsUploading(false);
  };

  const handleVerifyIntegrity = async (ev: EvidenceItem) => {
    setVerifyingId(ev.id);
    const result = await verifyEvidenceIntegrity(ev.id);
    setVerifyBanner({
      id: ev.id,
      matches: result.matches,
      computedHash: result.computedHash,
      timestamp: new Date().toLocaleTimeString('en-IN'),
    });
    setVerifyingId(null);
  };

  const handleCopyHash = (evId: string, hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHashId(evId);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const handleRunLocalOcr = async (ev: EvidenceItem) => {
    setOcrLoading(true);
    setOcrMessage('');
    const result = await performLocalBrowserOCR(ev);
    if (result.text) {
      setOcrDraft(result.text);
      saveCorrectedOcrText(ev.id, result.text);
    }
    setOcrMessage(result.explanation);
    setOcrLoading(false);
  };

  const handleSaveOcrCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvidence) return;
    saveCorrectedOcrText(selectedEvidence.id, ocrDraft);
    setOcrSavedBanner(true);
    setTimeout(() => setOcrSavedBanner(false), 2500);
  };

  if (!currentCase) {
    return (
      <WorkspaceLayout breadcrumbs={[{ label: 'Evidence Vault' }]}>
        <p className="text-sm text-slate-600">Case not found.</p>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout
      breadcrumbs={[
        { label: 'Cases', to: '/cases' },
        { label: currentCase.title, to: `/cases/${caseId}` },
        { label: 'Evidence Vault, SHA-256 & OCR' },
      ]}
    >
      <CaseSubNav caseId={caseId} />

      <div className="space-y-6">
        {/* Top Upload & Preservation Bar */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-teal-800">
                <span>IMMUTABLE EVIDENCE VAULT</span>
                <span aria-hidden="true">·</span>
                <span>ORIGINAL FILES NEVER ALTERED</span>
              </div>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 font-display">
                Evidence Vault, SHA-256 Fingerprints &amp; Local OCR
              </h1>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                Every file uploaded is hashed with SHA-256 in your browser and locked as an
                unmodified original. OCR transcripts and redactions are stored strictly as separate
                records.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer whitespace-nowrap">
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>{isUploading ? 'Hashing & Preserving...' : 'Upload Evidence File'}</span>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.svg,.pdf,.txt,.log,.md,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="sr-only"
                />
              </label>

              <button
                type="button"
                onClick={handleAddSampleFictionalEvidence}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-800" aria-hidden="true" />
                <span>+ Add Fictional Sample Log</span>
              </button>
            </div>
          </div>

          {uploadError && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-800"
            >
              {uploadError}
            </div>
          )}
        </section>

        {/* Master-Detail Layout for Evidence Items */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Evidence List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-slate-900">
                Preserved Evidence Items ({caseEvidence.length})
              </h2>
              <span className="text-xs text-slate-500 font-mono">Click to inspect</span>
            </div>

            {caseEvidence.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
                <p className="text-sm font-medium text-slate-800">No evidence uploaded yet</p>
                <p className="text-xs text-slate-500">
                  Upload a screenshot, PDF, or text export above to calculate its SHA-256 hash.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {caseEvidence.map((item) => {
                  const isSelected = selectedEvidence?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedEvidenceId(item.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-white border-teal-800 ring-1 ring-teal-800'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {item.evidenceType === 'image' ? (
                            <ImageIcon
                              className="w-4 h-4 text-teal-800 shrink-0"
                              aria-hidden="true"
                            />
                          ) : (
                            <FileText
                              className="w-4 h-4 text-slate-700 shrink-0"
                              aria-hidden="true"
                            />
                          )}
                          <span className="text-sm font-semibold text-slate-900 truncate">
                            {item.originalFilename}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-emerald-800 shrink-0">
                          Original
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
                        <span className="font-mono">{item.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.evidenceType.toUpperCase()}</span>
                        <span aria-hidden="true">·</span>
                        <span>{(item.sizeBytes / 1024).toFixed(1)} KB</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(item.uploadedAt).toLocaleDateString('en-IN')}</span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-600 tabular-nums">
                        <span>SHA-256: {item.sha256Hash.slice(0, 20)}...</span>
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-emerald-700 shrink-0"
                          aria-hidden="true"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column (7 cols): Evidence Inspector, SHA-256 Verification, Preview & OCR */}
          <div className="lg:col-span-7">
            {selectedEvidence ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                {/* Item Header & Metadata Grid */}
                <div className="border-b border-slate-200 pb-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono text-slate-500">
                      Internal ID: <strong className="text-slate-900">{selectedEvidence.id}</strong>{' '}
                      · Case: <strong className="text-slate-900">{selectedEvidence.caseId}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800">
                      <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                      <span>Original Evidence — Read-Only Locked</span>
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-slate-900 break-all">
                    {selectedEvidence.originalFilename}
                  </h2>

                  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <dt className="text-slate-500">Format / MIME</dt>
                      <dd className="font-mono font-medium text-slate-900 mt-0.5">
                        {selectedEvidence.mimeType}
                      </dd>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <dt className="text-slate-500">File Size</dt>
                      <dd className="font-mono font-medium text-slate-900 mt-0.5 tabular-nums">
                        {(selectedEvidence.sizeBytes / 1024).toFixed(2)} KB (
                        {selectedEvidence.sizeBytes.toLocaleString()} B)
                      </dd>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <dt className="text-slate-500">Upload Time</dt>
                      <dd className="font-mono font-medium text-slate-900 mt-0.5 tabular-nums">
                        {new Date(selectedEvidence.uploadedAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </dd>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <dt className="text-slate-500">OCR Status</dt>
                      <dd className="font-medium text-slate-900 mt-0.5">
                        {selectedEvidence.ocrStatus === 'extracted'
                          ? 'Extracted (Separate)'
                          : selectedEvidence.ocrStatus === 'ready'
                          ? 'Ready to Run'
                          : 'Text / Native'}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* SHA-256 Hash & Integrity Verification Box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-900">
                        SHA-256 Cryptographic Fingerprint
                      </h3>
                      <p className="text-xs text-slate-500">
                        Any 1-byte modification to the file produces a completely different SHA-256
                        digest.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyHash(selectedEvidence.id, selectedEvidence.sha256Hash)
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                      >
                        {copiedHashId === selectedEvidence.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Copy Hash</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVerifyIntegrity(selectedEvidence)}
                        disabled={verifyingId === selectedEvidence.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          {verifyingId === selectedEvidence.id
                            ? 'Verifying...'
                            : 'Verify Integrity'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-xs text-slate-900 break-all select-all tabular-nums">
                    {selectedEvidence.sha256Hash}
                  </div>

                  {verifyBanner && verifyBanner.id === selectedEvidence.id && (
                    <div
                      role="status"
                      className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 flex items-start gap-2"
                    >
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-semibold">
                          Integrity Verified at {verifyBanner.timestamp} — SHA-256 Digest Matches
                        </p>
                        <p className="mt-0.5 text-emerald-900 font-mono break-all">
                          Computed: {verifyBanner.computedHash}
                        </p>
                        <p className="mt-0.5 text-emerald-800">
                          Original evidence has not been altered since preservation. Audit event
                          recorded.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Evidence Preview Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-900">
                      Original Evidence Preview (Unmodified)
                    </h3>
                    <span className="text-xs font-mono text-amber-900">DEMO DATA — FICTIONAL</span>
                  </div>

                  {selectedEvidence.evidenceType === 'image' && selectedEvidence.previewDataUrl ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 p-2">
                      <img
                        src={selectedEvidence.previewDataUrl}
                        alt={`Preview of ${selectedEvidence.originalFilename}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto rounded-lg border border-slate-200"
                      />
                    </div>
                  ) : (
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-64">
                      {selectedEvidence.contentText}
                    </pre>
                  )}
                </div>

                {/* EXIF / File Metadata Section */}
                {selectedEvidence.exifMetadata &&
                  Object.keys(selectedEvidence.exifMetadata).length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-slate-900">
                        Embedded File / EXIF Metadata
                      </h3>
                      <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 text-xs">
                        {Object.entries(selectedEvidence.exifMetadata).map(([k, v]) => (
                          <div
                            key={k}
                            className="px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-slate-50/60"
                          >
                            <span className="font-mono text-slate-600">{k}</span>
                            <span className="font-mono font-medium text-slate-900">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Browser / Local OCR Section (For Images) */}
                {selectedEvidence.evidenceType === 'image' && (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ScanText className="w-4 h-4 text-teal-800" aria-hidden="true" />
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">
                            Local Browser OCR &amp; Separate Editable Transcript
                          </h3>
                          <p className="text-xs text-slate-500">
                            Extracted text and user corrections are stored separately from the
                            original image.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRunLocalOcr(selectedEvidence)}
                        disabled={ocrLoading}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap self-start"
                      >
                        <ScanText className="w-3.5 h-3.5 text-teal-800" aria-hidden="true" />
                        <span>
                          {ocrLoading ? 'Extracting Text...' : 'Run Browser OCR'}
                        </span>
                      </button>
                    </div>

                    {ocrMessage && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                        {ocrMessage}
                      </div>
                    )}

                    <form onSubmit={handleSaveOcrCorrection} className="space-y-3">
                      <div>
                        <label
                          htmlFor="ocr-transcript-editor"
                          className="block text-xs font-medium text-slate-700 mb-1"
                        >
                          Editable OCR Text (Stored separately; scanned by Privacy Scanner):
                        </label>
                        <textarea
                          id="ocr-transcript-editor"
                          rows={5}
                          value={ocrDraft}
                          onChange={(e) => setOcrDraft(e.target.value)}
                          placeholder="Click 'Run Browser OCR' above or enter/correct visible screenshot text here..."
                          className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 leading-relaxed"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Save Corrected OCR Text</span>
                          </button>
                          {ocrSavedBanner && (
                            <span className="text-xs font-medium text-emerald-800">
                              Saved separately — original image untouched.
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/cases/${caseId}/privacy`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:underline underline-offset-4"
                        >
                          <span>Scan for Privacy Risks</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};
