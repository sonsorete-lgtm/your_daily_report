import { useRef } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import type { ReportImage, Locale } from '../types';
import { t } from '../lib/i18n';

const uid = () => Math.random().toString(36).slice(2, 10);

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
 * - Reads files as data URLs so they round-trip through localStorage.
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
      picked.map(
        (f) =>
          new Promise<ReportImage>((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: uid(),
                name: f.name,
                dataUrl: reader.result as string,
                mimeType: f.type,
              });
            reader.readAsDataURL(f);
          }),
      ),
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
