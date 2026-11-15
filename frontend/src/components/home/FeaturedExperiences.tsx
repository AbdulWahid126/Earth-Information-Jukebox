'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Thermometer, Waves, Navigation, ArrowUpRight, Radio } from 'lucide-react';

interface ExperienceCardProps {
  readonly title: string;
  readonly category: string;
  readonly sensor: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly description: string;
  readonly acousticMapping: string;
  readonly icon: React.ReactNode;
  readonly accentBorder: string;
  readonly status: 'Operational' | 'Planned';
  readonly index: number;
}

function ExperienceCard({
  title,
  category,
  sensor,
  imageSrc,
  imageAlt,
  description,
  acousticMapping,
  icon,
  accentBorder,
  status,
  index,
}: ExperienceCardProps) {
  const isOperational = status === 'Operational';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: index * 0.15 }}
      className="group relative flex flex-col rounded-sm border border-hairline bg-chassis-panel/70 overflow-hidden transition-all duration-300 hover:border-hairline-bright hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
    >
      {/* Visual Header / Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-space-black">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={`object-cover object-center transition-transform duration-700 group-hover:scale-105 ${
            isOperational ? 'opacity-90 group-hover:opacity-100' : 'opacity-65 grayscale-[20%]'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
        />

        {/* Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-chassis-panel via-chassis-panel/30 to-transparent" />
        <div className="absolute inset-0 hud-scanline opacity-25 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 rounded-xs border border-hairline bg-space-black/85 px-2 py-0.5 backdrop-blur-md">
            {icon}
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-text-primary">
              {category}
            </span>
          </div>

          <span className="font-mono text-[8px] uppercase tracking-wider text-text-muted bg-space-black/80 px-1.5 py-0.5 rounded-xs border border-hairline">
            {sensor}
          </span>
        </div>

        {/* Top Accent Strip */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${accentBorder}`} />
      </div>

      {/* Card Content Bay */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2.5">
          <h3 className="text-xl font-bold tracking-tight text-text-primary group-hover:text-nasa-cyan transition-colors">
            {title}
          </h3>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-text-secondary">
          {description}
        </p>

        {/* Acoustic Mapping Formula Preview */}
        <div className="mt-4 rounded-sm border border-hairline/80 bg-chassis-base/80 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Radio className="h-3 w-3 text-nasa-cyan" />
            <span className="font-mono text-[9px] font-semibold text-nasa-cyan tracking-wider uppercase">
              Acoustic Parameter Mapping
            </span>
          </div>
          <p className="font-mono text-[10px] text-text-muted leading-tight">
            {acousticMapping}
          </p>
        </div>

        {/* Status & Action Footer */}
        <div className="mt-4 pt-3.5 border-t border-hairline flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isOperational ? 'bg-biosphere-emerald animate-pulse' : 'bg-telemetry-amber'}`} />
            <span className={`font-mono text-[9px] font-semibold tracking-wider uppercase ${isOperational ? 'text-biosphere-emerald' : 'text-telemetry-amber'}`}>
              {isOperational ? 'Operational MVP Dataset' : 'Planned // Future Expansion'}
            </span>
          </div>

          <Link
            href={isOperational ? "/studio" : "/explore"}
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary hover:text-nasa-cyan transition-colors"
          >
            <span>{isOperational ? 'Launch in Studio' : 'Details'}</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function FeaturedExperiences() {
  return (
    <section className="relative border-t border-hairline px-4 py-24 sm:px-6 lg:px-8 bg-chassis-base/40">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-sm border border-hairline-accent bg-nasa-cyan/5 px-2.5 py-1 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-nasa-cyan" />
              <span className="font-mono text-[10px] font-bold tracking-widest text-nasa-cyan uppercase">
                Featured Earth Systems
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
              PLANETARY SIGNATURES.
            </h2>
            <p className="mt-3 text-base text-text-secondary leading-relaxed">
              Explore how distinct Earth observation datasets encode unique acoustic profiles. 
              Each system maps empirical sensor observations into structured musical voices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-sm border border-hairline-bright bg-chassis-panel px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-text-primary hover:border-nasa-cyan/40 hover:text-nasa-cyan transition-all"
            >
              <span>View All Datasets</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* 3 Featured Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ExperienceCard
            title="Global Temperature Anomalies"
            category="Atmosphere // Thermal"
            sensor="NASA GISTEMP v4 / GHCNv4"
            imageSrc="/assets/visualizations/temperature-anomaly.jpg"
            imageAlt="NASA GISTEMP global temperature anomaly map showing regional temperature deviations"
            description="147-year empirical climate anomaly series and 2025 spatial composite. Surface and ocean temperature anomalies map to calibrated pitches in time-series mode and regional visual features in spatial mode."
            acousticMapping="Empirical Anomaly Delta -> Musical Pitch (200Hz Baseline) + Stereo Panning"
            icon={<Thermometer className="h-3.5 w-3.5 text-alert-crimson" />}
            accentBorder="bg-alert-crimson"
            status="Operational"
            index={0}
          />

          <ExperienceCard
            title="Sea Level & Polar Ice Dynamics"
            category="Cryosphere // Altimetry"
            sensor="Sentinel-6 / Jason-3"
            imageSrc="/assets/visualizations/sea-level.jpg"
            imageAlt="NASA radar altimetry map illustrating global sea surface height anomalies"
            description="Precision radar altimetry records ocean surface height variations and polar ice displacement. Scheduled for integration in a future release."
            acousticMapping="Planned: Sea Surface Height Anomaly -> Sub-Bass Oscillator (35-110 Hz) + Panning"
            icon={<Waves className="h-3.5 w-3.5 text-nasa-cyan" />}
            accentBorder="bg-nasa-cyan"
            status="Planned"
            index={1}
          />

          <ExperienceCard
            title="Perpetual Ocean Currents"
            category="Hydrosphere // Kinetic Flow"
            sensor="ECCO2 / NASA JPL"
            imageSrc="/assets/visualizations/ocean-currents.jpg"
            imageAlt="NASA Perpetual Ocean visualization depicting swirling global ocean surface currents and eddies"
            description="High-resolution ocean circulation simulation tracing surface flow and boundary currents. Scheduled for integration in a future release."
            acousticMapping="Planned: Current Velocity & Vorticity -> Arpeggiation Clock Subdivisions"
            icon={<Navigation className="h-3.5 w-3.5 text-telemetry-amber" />}
            accentBorder="bg-telemetry-amber"
            status="Planned"
            index={2}
          />
        </div>

        {/* Authentic Attribution Disclaimer */}
        <div className="mt-8 rounded-sm border border-hairline bg-chassis-panel/50 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-text-muted font-mono text-[10px]">
          <span>
            DATA ORIGIN: NASA Goddard Institute for Space Studies (GISS) &amp; Scientific Visualization Studio (SVS #5603).
          </span>
          <span className="text-text-secondary">
            STATUS: NASA GISTEMP v4 is fully operational. Additional datasets scheduled for future development.
          </span>
        </div>

      </div>
    </section>
  );
}
