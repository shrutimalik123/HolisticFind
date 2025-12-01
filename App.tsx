import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { SearchResults } from './components/SearchResults';
import { searchProviders } from './services/gemini';
import { SearchResult, Coordinates } from './types';
import { Leaf, HeartPulse, Map, Sparkles } from 'lucide-react';

export default function App() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(undefined);
  const [city, setCity] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get location on mount quietly
    handleUseLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setCoordinates(coords);
        setIsLocating(false);
        
        // Optional: Reverse geocode to show city name in UI if needed (simple approximation)
        // For now, we just store coords for the API query
        setCity("Current Location");
      },
      (err) => {
        console.warn("Geolocation denied or failed", err);
        setIsLocating(false);
      }
    );
  };

  const onSearch = async (term: string, locationInput: string) => {
    setLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      // If user typed a specific location different from 'current location', 
      // we might want to pass undefined coords to let Gemini interpret the city name in the query.
      // If they left it blank or said 'current location', we pass the exact coords if we have them.
      
      const useExactCoords = locationInput.toLowerCase().includes('current') || locationInput === '';
      const queryLocation = useExactCoords ? coordinates : undefined;
      
      const effectiveQuery = useExactCoords 
        ? `${term}` // Lat/Long handles the location
        : `${term} in ${locationInput}`; // Text handles the location

      const result = await searchProviders(effectiveQuery, queryLocation);
      setSearchResult(result);
    } catch (err: any) {
      setError(err.message || "An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-teal-600 p-1.5 rounded-lg text-white">
              <Leaf size={20} />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">HolisticFind</span>
          </div>
          {/* Tabs and buttons removed */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Hero 
          onSearch={onSearch} 
          isLoading={loading} 
          locationState={{
            city,
            isLocating,
            useCurrentLocation: handleUseLocation
          }}
        />

        {error && (
          <div className="max-w-4xl mx-auto mt-8 px-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
               <HeartPulse size={20} />
               <p>{error}</p>
            </div>
          </div>
        )}

        <SearchResults result={searchResult} isLoading={loading} />

        {/* Empty State / Initial Instructions */}
        {!searchResult && !loading && !error && (
          <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-4">
                    <Leaf size={32} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Integrative Care</h3>
                  <p className="text-sm">Find specialists in functional medicine, naturopathy, and more.</p>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                    <Map size={32} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Local & Verified</h3>
                  <p className="text-sm">Powered by Google Maps to give you real, localized results.</p>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-4">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">AI-Powered Insights</h3>
                  <p className="text-sm">Get summarized reviews and specialty details instantly.</p>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-slate-400 text-sm">
             © 2024 HolisticFind Directory. Powered by Google Gemini.
           </p>
           <p className="text-slate-300 text-xs mt-2">
             Disclaimer: This directory is for informational purposes only and does not constitute medical advice.
           </p>
        </div>
      </footer>
    </div>
  );
}
