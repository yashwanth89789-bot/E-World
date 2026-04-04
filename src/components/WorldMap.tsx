import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { motion, AnimatePresence } from "motion/react";
import { NewsArticle } from "../types";
import { cn } from "../lib/utils";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  articles: NewsArticle[];
  selectedArticle: NewsArticle | null;
  onSelectArticle: (article: NewsArticle) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  articles,
  selectedArticle,
  onSelectArticle
}) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  function handleMoveEnd(position: { coordinates: [number, number]; zoom: number }) {
    setPosition(position);
  }

  useEffect(() => {
    if (selectedArticle) {
      setPosition({
        coordinates: [selectedArticle.location.lng, selectedArticle.location.lat],
        zoom: 4
      });
    }
  }, [selectedArticle]);

  return (
    <div className="w-full h-full bg-slate-950 overflow-hidden relative">
      <ComposableMap
        projectionConfig={{ scale: 200 }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#334155", outline: "none" },
                    pressed: { fill: "#475569", outline: "none" }
                  }}
                />
              ))
            }
          </Geographies>

          {articles.map((article) => (
            <Marker
              key={article.id}
              coordinates={[article.location.lng, article.location.lat]}
            >
              <g
                className="cursor-pointer"
                onClick={() => onSelectArticle(article)}
              >
                <circle
                  r={selectedArticle?.id === article.id ? 8 : 4}
                  fill={selectedArticle?.id === article.id ? "#3b82f6" : "#ef4444"}
                  stroke="#fff"
                  strokeWidth={2}
                  className="transition-all duration-300"
                />
                <AnimatePresence>
                  {selectedArticle?.id === article.id && (
                    <motion.circle
                      initial={{ r: 4, opacity: 1 }}
                      animate={{ r: 20, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      fill="#3b82f6"
                    />
                  )}
                </AnimatePresence>
              </g>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setPosition(prev => ({ ...prev, zoom: prev.zoom * 1.5 }))}
          className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setPosition(prev => ({ ...prev, zoom: Math.max(1, prev.zoom / 1.5) }))}
          className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
        >
          -
        </button>
      </div>
    </div>
  );
};
