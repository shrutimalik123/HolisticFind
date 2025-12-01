import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { ProviderCategory } from '../types';

interface HeroProps {
  onSearch: (term: string, location: string) => void;
  isLoading: boolean;
  locationState: {
    city: string;
    isLocating: boolean;
    useCurrentLocation: () => void;
  };
}

export const Hero: React.FC<HeroProps> = ({ onSearch, isLoading, locationState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const loc = locationInput.trim() || locationState.city || 'current location';
    onSearch(searchTerm, loc);
  };

  const handleCategoryClick = (category: string) => {
    setSearchTerm(category);
    const loc = locationInput.trim() || locationState.city || 'current location';
    onSearch(category, loc);
  };

  return (
    <div className="relative bg-teal-900 py-16 sm:py-24 text-center overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-white">
          <path d="M0 100 C 20 0 50 0 100 100 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Find Your Path to <span className="text-teal-300">Holistic Wellness</span>
        </h1>
        <p className="text-teal-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
          Discover trusted integrative health practitioners near you using AI-powered search.
        </p>

        <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto">
          <div className="flex-1 flex items-center px-4 py-3 bg-slate-50 rounded-xl">
            <Search className="text-slate-400 mr-3" size={20} />
            <input
              type="text"
              placeholder="E.g., Acupuncture for back pain"
              className="bg-transparent w-full focus:outline-none text-slate-800 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-1 flex items-center px-4 py-3 bg-slate-50 rounded-xl relative group">
            <MapPin className="text-slate-400 mr-3" size={20} />
            <input
              type="text"
              placeholder={locationState.isLocating ? "Locating..." : (locationState.city ? `Near ${locationState.city}` : "Enter city or zip")}
              className="bg-transparent w-full focus:outline-none text-slate-800 placeholder-slate-400"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
            <button 
              type="button"
              onClick={locationState.useCurrentLocation}
              className="absolute right-2 p-1.5 text-xs font-semibold text-teal-600 bg-teal-50 rounded-md hover:bg-teal-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Use current location"
            >
             Current Loc
            </button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:w-auto w-full"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
          </button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
           {Object.values(ProviderCategory).filter(c => c !== ProviderCategory.ALL).map((cat) => (
             <button
               key={cat}
               onClick={() => handleCategoryClick(cat)}
               disabled={isLoading}
               className="px-4 py-1.5 rounded-full bg-teal-800/50 hover:bg-teal-700/50 text-teal-50 border border-teal-700/50 text-sm font-medium transition-colors backdrop-blur-sm"
             >
               {cat}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};