'use client';

import { motion } from 'framer-motion';
import { Ear, Keyboard, MonitorSpeaker, FileText, CheckCircle2 } from 'lucide-react';

interface AccessibilityPillarProps {
  readonly icon: React.ReactNode;
  readonly code: string;
  readonly title: string;
  readonly description: string;
  readonly status: string;
  readonly badgeText: string;
  readonly index: number;
}

function AccessibilityPillar({
  icon,
  code,
  title,
  description,
  status,
  badgeText,
  index,
}: AccessibilityPillarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="rounded-sm border border-hairline bg-chassis-panel/80 p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between border-b border-hairline pb-3 mb-4">
          <div className="flex items-center gap-2 text-biosphere-emerald">
            {icon}
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
              {code}
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">
            {status}
          </span>
        </div>

        <h3 className="text-lg font-bold text-text-primary tracking-tight mb-2">
          {title}
        </h3>

        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-3 border-t border-hairline/60 flex items-center gap-2">
        <CheckCircle2 className="h-3.5 w-3.5 text-biosphere-emerald shrink-0" />
        <span className="font-mono text-[9px] text-text-muted uppercase">
          {badgeText}
        </span>
      </div>
    </motion.div>
  );
}

export default function AccessibilitySection() {
  return (
    <section className="relative border-t border-hairline px-4 py-24 sm:px-6 lg:px-8 bg-chassis-base/40">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 rounded-sm border border-hairline-accent bg-biosphere-emerald/5 px-2.5 py-1 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-biosphere-emerald" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-biosphere-emerald uppercase">
              Inclusion &amp; Universal Access
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            PLANETARY SCIENCE BEYOND SIGHT.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            Earth observation data should not be confined to visual maps. By translating complex geospatial telemetry 
            and climate anomalies into temporal acoustic patterns and text digests, the Earth Information Jukebox provides multi-sensory scientific exploration 
            for visually impaired researchers, students, and neurodiverse explorers.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <AccessibilityPillar
            icon={<Ear className="h-4 w-4" />}
            code="A11Y-01 // AUDITORY"
            title="Acoustic Data Modality"
            description="Satellite and temperature data patterns are translated into pitch, harmonic scale degrees, and stereo panning, providing an auditory alternative to visual graphs."
            status="Implemented"
            badgeText="Functional Sonification"
            index={0}
          />

          <AccessibilityPillar
            icon={<Keyboard className="h-4 w-4" />}
            code="A11Y-02 // KEYBOARD"
            title="Keyboard-Driven Navigation"
            description="Keyboard traversal with high-visibility 2px solid cyan focus rings. Interactive audio playback controls support Space (play/pause), S (stop), and M (mute) shortcuts."
            status="Implemented"
            badgeText="Hardware Shortcuts Active"
            index={1}
          />

          <AccessibilityPillar
            icon={<MonitorSpeaker className="h-4 w-4" />}
            code="A11Y-03 // SPEECH"
            title="Screen-Reader Telemetry"
            description="Debounced ARIA live regions announce active sector coordinates, temperature anomalies, and active musical frequencies without overwhelming speech synthesizers."
            status="Implemented"
            badgeText="ARIA Live Announcements"
            index={2}
          />

          <AccessibilityPillar
            icon={<FileText className="h-4 w-4" />}
            code="A11Y-04 // TRANSCRIPT"
            title="Text-Based Data Summaries"
            description="Structured textual digests and non-auditory empirical summaries accompany every dataset, providing a clean textual alternative for deaf or hard-of-hearing users."
            status="Implemented"
            badgeText="Non-Audio Empirical Digests"
            index={3}
          />
        </div>

        {/* Accessibility Commitment Notice */}
        <div className="mt-8 rounded-sm border border-hairline bg-chassis-panel/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[10px] text-text-muted">
          <div>
            ACCESSIBILITY DESIGN PRINCIPLE: Built with keyboard traversal, high-contrast cyan focus indicators, ARIA live region speech telemetry, and structured non-auditory data digests.
          </div>
          <span className="text-biosphere-emerald shrink-0 font-semibold">
            All 4 Accessibility Modalities Active in Studio Workstation
          </span>
        </div>

      </div>
    </section>
  );
}
