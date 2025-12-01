import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SearchResult } from '../types';
import { ProviderCard } from './ProviderCard';
import { Sparkles, Map } from 'lucide-react';

interface SearchResultsProps {
  result: SearchResult | null;
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  const mapChunks = result.groundingMetadata?.groundingChunks?.filter(c => c.maps) || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: AI Summary */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-8">
            <div className="flex items-center gap-2 mb-4 text-teal-700 font-semibold">
              <Sparkles size={20} />
              <h2>AI Insights</h2>
            </div>
            <div className="prose prose-slate prose-teal max-w-none">
              <ReactMarkdown 
                components={{
                   a: ({node, ...props}) => <span className="text-teal-600 font-medium" {...props} />
                }}
              >
                {result.text}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Right Column: Directory List (Desktop) or Bottom (Mobile) */}
        <div className="lg:col-span-4">
           <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
              <Map size={20} />
              <h2>Verified Locations</h2>
            </div>
            
            {mapChunks.length === 0 ? (
              <div className="p-6 bg-slate-100 rounded-xl text-center text-slate-500">
                <p>No direct map listings found for this query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {mapChunks.map((chunk, idx) => (
                  <ProviderCard key={idx} chunk={chunk} index={idx} />
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};