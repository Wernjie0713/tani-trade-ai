import React from "react";

export default function MarketContextSidebar({ cropName, trends, risk, className = "" }) {
  const displayCrop = cropName || "Paddy";
  const defaultTrends = `${displayCrop} demand is projected to rise 14% by Dec. Current market rates are favorable for forward commitments.`;
  const defaultRisk = "Weather risk moderate for next 30 days. No major supply chain disruptions detected in your region.";

  return (
    <aside className={`w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden ${className}`}>
      <div className="bg-surface-container-low p-4 border-b border-outline-variant/30 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            monitoring
          </span>
        </div>
        <div>
          <h3 className="font-headline font-bold text-sm text-on-surface">Market Context & Risk</h3>
          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Regional Data</p>
        </div>
      </div>
      <div className="p-5 space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            <div className="font-bold text-primary text-xs uppercase tracking-wider">Price Trends</div>
          </div>
          <div className="text-sm text-on-surface-variant font-medium leading-relaxed">{trends || defaultTrends}</div>
        </div>
        
        <div className="h-px bg-outline-variant/20 w-full"></div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <div className="font-bold text-[#ba1a1a] text-xs uppercase tracking-wider">Risk Factors</div>
          </div>
          <div className="text-sm text-on-surface-variant font-medium leading-relaxed">{risk || defaultRisk}</div>
        </div>
      </div>
    </aside>
  );
}
