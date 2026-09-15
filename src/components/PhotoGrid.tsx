import { useRef } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import type { ReportImage, Locale } from '../types';
import { t } from '../lib/i18n';

const uid = () => Math.random().toString(36).slice(2, 10);

const MAX_IMG_DIM = 1600;
const JPEG_QUALITY = 0.8;

/**
 * Compress an image File by drawing it onto a canvas at a capped dimension
 * and re-encoding as JPEG. Returns a data URL string.
 * PNGs with transparency are preserved as PNG to avoid losing the alpha channel.
 */
function compressImage(file: File): Promise<{ dataUrl: string; mimeType: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const isPng = file.type === 'image/png';

      const img = new Image();
      img.onload = () => {
        let { naturalWidth: w, naturalHeight: h } = img;

        if (w <= MAX_IMG_DIM && h <= MAX_IMG_DIM && isPng) {
          resolve({ dataUrl: src, mimeType: file.type });
          return;
        }

        const scale = Math.min(MAX_IMG_DIM / w, MAX_IMG_DIM / h, 1);
        w = Math.round(w * scale);
        h = Math.round(h * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: src, mimeType: file.type });
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);

        if (isPng) {
          try {
            const pngUrl = canvas.toDataURL('image/png');
            resolve({ dataUrl: pngUrl, mimeType: 'image/png' });
          } catch {
            resolve({ dataUrl: src, mimeType: file.type });
          }
        } else {
          const jpegUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
          resolve({ dataUrl: jpegUrl, mimeType: 'image/jpeg' });
        }
      };
      img.onerror = () => resolve({ dataUrl: src, mimeType: file.type });
      img.src = src;
    };
    reader.onerror = () => resolve({ dataUrl: '', mimeType: file.type });
    reader.readAsDataURL(file);
  });
}

interface PhotoGridProps {
  images: ReportImage[];
  onChange: (images: ReportImage[]) => void;
  locale: Locale;
  /** Max attachments. Default unlimited. */
  max?: number;
}

/**
 * Reusable photo attachment grid.
 * - Two source buttons: Camera (capture) and Gallery (pick).
 * - Unlimited attachments by default (limited only by device storage).
 * - Preview + remove before submission.
 * - Images are compressed (max 1600px, JPEG 80%) to keep PDFs and storage small.
 */
export function PhotoGrid({
  images,
  onChange,
  locale,
  max = Infinity,
}: PhotoGridProps) {
  const cameraLabel = t(locale, 'camera');
  const galleryLabel = t(locale, 'gallery');
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  async function onPick(files: FileList | null) {
    if (!files) return;
    const remaining = max === Infinity ? files.length : max - images.length;
    const picked = Array.from(files).slice(0, Math.max(0, remaining));
    const mapped: ReportImage[] = await Promise.all(
      picked.map(async (f) => {
        const { dataUrl, mimeType } = await compressImage(f);
        return {
          id: uid(),
          name: f.name,
          dataUrl,
          mimeType,
        };
      }),
    );
    if (max === Infinity) {
      onChange([...images, ...mapped]);
    } else {
      onChange([...images, ...mapped].slice(0, max));
    }
  }

  function remove(id: string) {
    onChange(images.filter((i) => i.id !== id));
  }

  const atMax = max !== Infinity && images.length >= max;

  return (
    <section>
      {images.length > 0 && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500">{images.length} {images.length === 1 ? t(locale, 'image') : t(locale, 'images')}</span>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2.5">
        {images.map((img) => (
          <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
            <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
            <button
              onClick={() => remove(img.id)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-900/80 flex items-center justify-center text-white"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {!atMax && (
          <>
            {/* Camera capture */}
            <button
              onClick={() => cameraRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-500/60 hover:bg-slate-800/40 transition-colors flex flex-col items-center justify-center text-slate-500 hover:text-amber-400"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{cameraLabel}</span>
            </button>
            {/* Gallery pick */}
            <button
              onClick={() => galleryRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/40 transition-colors flex flex-col items-center justify-center text-slate-600 hover:text-amber-400"
            >
              <ImageIcon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{galleryLabel}</span>
            </button>
          </>
        )}
      </div>
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          onPick(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => {
          onPick(e.target.files);
          e.target.value = '';
        }}
      />
    </section>
  );
}
