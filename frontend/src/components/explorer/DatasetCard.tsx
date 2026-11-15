import Image from 'next/image';
import { DatasetMetadata } from '@/types/dataset';
import { Layers, ArrowRight, Lock } from 'lucide-react';

interface DatasetCardProps {
  readonly dataset: DatasetMetadata;
  readonly isSelected?: boolean;
  readonly onSelect?: (id: string) => void;
}

export default function DatasetCard({ dataset, isSelected, onSelect }: DatasetCardProps) {
  const isAvailable = dataset.availability === 'available';

  return (
    <div
      onClick={() => isAvailable && onSelect && onSelect(dataset.id)}
      className={`group relative flex flex-col rounded-sm border overflow-hidden transition-all duration-300 ${
        isSelected
          ? 'border-nasa-cyan bg-chassis-panel/95 shadow-[0_0_24px_rgba(0,229,255,0.2)]'
          : isAvailable
          ? 'border-hairline bg-chassis-panel/70 hover:border-hairline-bright cursor-pointer'
          : 'border-hairline/60 bg-chassis-base/60 opacity-80'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-space-black">
        <Image
          src={dataset.thumbnailPath}
          alt={dataset.title}
          fill
          className={`object-cover object-center transition-transform duration-500 ${
            isAvailable ? 'group-hover:scale-105 opacity-90' : 'opacity-50 grayscale-[40%]'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-chassis-panel via-transparent to-transparent" />
        <div className="absolute inset-0 hud-scanline opacity-20 pointer-events-none" />

        {/* Category & Availability Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 font-mono text-[9px]">
          <span className="rounded-xs border border-hairline bg-space-black/90 px-2 py-0.5 text-text-primary uppercase tracking-wider">
            {dataset.category}
          </span>

          {isAvailable ? (
            <span className="rounded-xs border border-hairline-accent bg-nasa-cyan/10 px-2 py-0.5 text-nasa-cyan font-bold uppercase tracking-wider">
              READY
            </span>
          ) : (
            <span className="rounded-xs border border-hairline bg-space-black/90 px-2 py-0.5 text-telemetry-amber font-semibold uppercase tracking-wider flex items-center gap-1">
              <Lock className="h-2.5 w-2.5" />
              PENDING
            </span>
          )}
        </div>
      </div>

      {/* Card Content Bay */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-mono text-[10px] text-text-muted mb-1 uppercase tracking-wider">
            {dataset.sensor}
          </div>
          <h3 className={`text-base font-bold tracking-tight mb-2 ${isAvailable ? 'text-text-primary group-hover:text-nasa-cyan' : 'text-text-secondary'}`}>
            {dataset.title}
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
            {dataset.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between font-mono text-[10px]">
          <span className="text-text-muted">YEAR: {dataset.year}</span>
          {isAvailable ? (
            <span className="text-nasa-cyan font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>View Data</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          ) : (
            <span className="text-text-muted italic">Phase 3 Expansion</span>
          )}
        </div>
      </div>
    </div>
  );
}
