/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, 
  Newspaper, 
  MapPin, 
  RefreshCw, 
  Search, 
  Info,
  ExternalLink,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { WorldMap } from "./components/WorldMap";
import { LandingPage } from "./components/LandingPage";
import { fetchGlobalNews, getPlaceDetails } from "./services/geminiService";
import { NewsArticle } from "./types";
import Markdown from "react-markdown";

export default function App() {
  const [isEntered, setIsEntered] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [placeDetails, setPlaceDetails] = useState<{ text?: string; sources?: any[] } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    const data = await fetchGlobalNews();
    setNews(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isEntered) {
      loadNews();
    }
  }, [isEntered]);

  useEffect(() => {
    if (selectedArticle) {
      const fetchDetails = async () => {
        setLoadingDetails(true);
        const details = await getPlaceDetails(selectedArticle.location.name);
        setPlaceDetails(details);
        setLoadingDetails(false);
      };
      fetchDetails();
    } else {
      setPlaceDetails(null);
    }
  }, [selectedArticle]);

  if (!isEntered) {
    return <LandingPage onEnter={() => setIsEntered(true)} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Sidebar */}
      <aside className="w-96 h-full glass-panel border-r border-slate-800 flex flex-col z-20">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight">E-World</h1>
          </div>
          <button 
            onClick={loadNews}
            disabled={loading}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw className={loading ? "animate-spin w-5 h-5" : "w-5 h-5"} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Fetching global events...</p>
            </div>
          ) : news.length > 0 ? (
            news.map((article) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className={`news-card p-4 rounded-xl glass-panel ${selectedArticle?.id === article.id ? 'active' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 bg-slate-800 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(article.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-sm mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span>{article.location.name}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center p-8 text-slate-500">
              <p>No news found. Try refreshing.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Map Area */}
      <main className="flex-1 relative h-full">
        <WorldMap 
          articles={news} 
          selectedArticle={selectedArticle}
          onSelectArticle={setSelectedArticle}
        />

        {/* Overlay Info Panel */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-8 left-8 right-8 md:left-auto md:right-8 md:w-[450px] glass-panel rounded-2xl p-6 z-30 shadow-2xl border-slate-700/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{selectedArticle.category}</span>
                  </div>
                  <h2 className="text-xl font-display font-bold leading-tight">{selectedArticle.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="p-1 hover:bg-slate-800 rounded-full text-slate-400"
                >
                  <ChevronRight className="w-6 h-6 rotate-90 md:rotate-0" />
                </button>
              </div>

              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                {selectedArticle.summary}
              </p>

              <div className="space-y-4 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Context & Insights</span>
                </div>
                
                {loadingDetails ? (
                  <div className="flex items-center gap-3 py-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-xs text-slate-500 italic">Consulting Google Maps & Search...</span>
                  </div>
                ) : placeDetails?.text ? (
                  <div className="text-xs text-slate-400 leading-relaxed max-h-40 overflow-y-auto pr-2">
                    <Markdown>{placeDetails.text}</Markdown>
                    {placeDetails.sources && placeDetails.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-800/50">
                        <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-tighter">Sources</p>
                        <div className="flex flex-wrap gap-2">
                          {placeDetails.sources.map((source: any, i: number) => (
                            source.web?.uri && (
                              <a 
                                key={i}
                                href={source.web.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2 py-1 bg-slate-800/50 rounded hover:bg-slate-800 text-blue-400 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span className="truncate max-w-[100px]">{source.web.title || 'Source'}</span>
                              </a>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Select a story to see detailed geographical context.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend/Status */}
        <div className="absolute top-6 right-6 flex items-center gap-4">
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Live Global Feed</span>
          </div>
        </div>
      </main>
    </div>
  );
}


