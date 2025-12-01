export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeId?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
        author: string;
      }[];
    };
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports?: {
    segment: {
      startIndex: number;
      endIndex: number;
      text: string;
    };
    groundingChunkIndices: number[];
    confidenceScores: number[];
  }[];
  webSearchQueries?: string[];
}

export interface SearchResult {
  text: string;
  groundingMetadata?: GroundingMetadata;
}

export enum ProviderCategory {
  ALL = 'All',
  ACUPUNCTURE = 'Acupuncturist',
  NATUROPATH = 'Naturopath',
  NUTRITION = 'Nutritionist',
  MASSAGE = 'Massage Therapist',
  FUNCTIONAL = 'Functional Medicine'
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}