/**
 * Dataset and Scientific Metadata Type Definitions
 * Earth Information Jukebox
 */

export type EarthSystemCategory = 
  | 'Atmosphere' 
  | 'Biosphere' 
  | 'Cryosphere' 
  | 'Hydrosphere';

export type DatasetModality = 
  | 'spatial_visualization' 
  | 'global_time_series' 
  | 'hybrid_composite';

export type DatasetAvailability = 
  | 'available' 
  | 'preview_pending' 
  | 'coming_soon';

export interface ScientificCitation {
  readonly authors: string;
  readonly year: number;
  readonly title: string;
  readonly publication: string;
  readonly doi?: string;
  readonly url?: string;
}

export interface DatasetMetadata {
  readonly id: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly category: EarthSystemCategory;
  readonly description: string;
  readonly scientificSummary: string;
  readonly availability: DatasetAvailability;
  
  // NASA Provenance
  readonly datasetVersion: string;
  readonly year: number | string;
  readonly temporalCoverage: string;
  readonly sensor: string;
  readonly laboratory: string;
  readonly nasaSourceUrl: string;
  readonly nasaSvsUrl?: string;
  readonly attribution: string;
  readonly citations: readonly ScientificCitation[];

  // Data Modality & Asset Paths
  readonly modality: DatasetModality;
  readonly imageAssetPath: string;
  readonly thumbnailPath: string;
  readonly csvAssetPath?: string;

  // Cartographic & Physical Properties
  readonly unit: string;
  readonly baselinePeriod?: string;
  readonly mapProjection?: string;
  readonly colormapName?: string;
  readonly colormapDescription?: string;

  // Scientific Integrity Flags
  readonly isCalibrated: boolean;
  readonly notesOnCalibration: string;
  readonly limitations: readonly string[];
}
