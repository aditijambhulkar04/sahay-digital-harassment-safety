/**
 * Export a permanently redacted image copy.
 * The original File remains unchanged.
 */

export interface RedactionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The source image could not be decoded."));
    };

    image.src = url;
  });
}

export async function exportRedactedImage(
  file: File,
  boxes: RedactionBox[],
): Promise<Blob> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please select a valid image file.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  const image = await loadImage(file);

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  if (!canvas.width || !canvas.height) {
    throw new Error("The source image has invalid dimensions.");
  }

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is unavailable.");
  }

  // Draw a fresh copy. The original evidence is not modified.
  context.drawImage(image, 0, 0);

  // Apply opaque black rectangles using normalized coordinates (0–1).
  context.fillStyle = "#000000";

  for (const box of boxes) {
    if (
      !Number.isFinite(box.x) ||
      !Number.isFinite(box.y) ||
      !Number.isFinite(box.width) ||
      !Number.isFinite(box.height)
    ) {
      continue;
    }

    const left = Math.max(0, Math.min(1, box.x));
    const top = Math.max(0, Math.min(1, box.y));
    const right = Math.max(left, Math.min(1, box.x + box.width));
    const bottom = Math.max(top, Math.min(1, box.y + box.height));

    if (right <= left || bottom <= top) continue;

    context.fillRect(
      Math.floor(left * canvas.width),
      Math.floor(top * canvas.height),
      Math.ceil((right - left) * canvas.width),
      Math.ceil((bottom - top) * canvas.height),
    );
  }

  // Canvas PNG export creates a separate image without the source EXIF metadata.
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Could not export the redacted image."));
        }
      },
      "image/png",
    );
  });
}
