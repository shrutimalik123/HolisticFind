import React from 'react';
import { MapPin, Star, ExternalLink, Navigation } from 'lucide-react';
import { GroundingChunk } from '../types';

interface ProviderCardProps {
  chunk: GroundingChunk;
  index: number;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ chunk, index }) => {
  const mapData = chunk.maps;

  if (!mapData) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="bg-teal-50 text-teal-700 font-bold text-xs px-2 py-1 rounded-full uppercase tracking-wider">
          Result {index + 1}
        </div>
        <a 
          href={mapData.uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-teal-600 transition-colors"
          title="View on Google Maps"
        >
          <ExternalLink size={18} />
        </a>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
        {mapData.title}
      </h3>

      <div className="mt-auto space-y-3">
        <div className="flex items-start gap-2 text-slate-600 text-sm">
            <MapPin size={16} className="mt-0.5 shrink-0 text-teal-500" />
            <span className="break-words text-xs">View location on map</span>
        </div>
        
        {mapData.placeAnswerSources?.reviewSnippets && mapData.placeAnswerSources.reviewSnippets.length > 0 && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1 mb-1 text-amber-500">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-semibold text-slate-700">Review Highlight</span>
            </div>
            <p className="text-xs text-slate-600 italic line-clamp-3">
              "{mapData.placeAnswerSources.reviewSnippets[0].content}"
            </p>
          </div>
        )}

        <a 
          href={mapData.uri}
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Navigation size={16} />
          <span>Get Directions</span>
        </a>
      </div>
    </div>
  );
};