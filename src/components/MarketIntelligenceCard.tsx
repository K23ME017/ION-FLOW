import React, { useState } from 'react';
import { Globe, Search, ExternalLink, Sparkles, Loader2, DollarSign, TrendingUp, ShieldCheck } from 'lucide-react';

interface MarketIntelligenceCardProps {
  targetRole: string;
}

export const MarketIntelligenceCard: React.FC<MarketIntelligenceCardProps> = ({ targetRole }) => {
  const [intel, setIntel] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [queries, setQueries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchIntelligence = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/market-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole }),
      });
      const data = await res.json();
      if (data.success) {
        setIntel(data.insights);
        setSources(data.sources || []);
        setQueries(data.searchQueries || []);
        setHasLoaded(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-200/80 p-6 sm:p-7 shadow-sm mb-8 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Google Search Grounded Market Intelligence
              </h3>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                Live Web Grounding
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time salary ranges, 2026 hiring demand, and trending certifications for {targetRole}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchIntelligence}
          disabled={isLoading}
          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Grounding via Google Search...</span>
            </>
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              <span>{hasLoaded ? 'Refresh Market Insights' : 'Fetch Live Market Insights'}</span>
            </>
          )}
        </button>
      </div>

      {!hasLoaded && !isLoading && (
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Click to run live search grounding using <strong>gemini-3.8-flash</strong> with the Google Search tool for compensation and market demands.
            </span>
          </div>
          <button
            type="button"
            onClick={fetchIntelligence}
            className="text-xs font-semibold text-blue-600 hover:underline shrink-0 ml-3"
          >
            Run Now →
          </button>
        </div>
      )}

      {isLoading && (
        <div className="p-8 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-700">Connecting to Google Search Engine...</p>
          <p className="text-[11px] text-slate-400">Synthesizing live salary and hiring benchmarks</p>
        </div>
      )}

      {hasLoaded && intel && !isLoading && (
        <div className="space-y-4 pt-2">
          {/* Grounding queries pill strip */}
          {queries.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Grounded Searches:</span>
              {queries.map((q, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px]"
                >
                  "{q}"
                </span>
              ))}
            </div>
          )}

          {/* Intel Content Body */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans">
            {intel}
          </div>

          {/* Sources list */}
          {sources.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Grounded Web Citations:</span>
              {sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 max-w-[200px] truncate"
                >
                  <span>{new URL(src).hostname}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
