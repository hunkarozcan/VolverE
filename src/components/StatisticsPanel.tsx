import React from 'react';
import { WorldStats } from '../engine/World';

interface StatisticsPanelProps {
    stats: WorldStats[];
}

export default function StatisticsPanel({ stats }: StatisticsPanelProps) {
    if (stats.length < 2) return null;

    const width = 300;
    const height = 100;
    const padding = 5;

    const renderLine = (dataKey: keyof WorldStats, color: string, maxVal?: number) => {
        const values = stats.map(s => s[dataKey] as number);
        const max = maxVal || Math.max(...values, 1);
        const min = 0; // Always start from 0 for better context

        const points = values.map((val, i) => {
            const x = (i / (stats.length - 1)) * (width - padding * 2) + padding;
            const y = height - ((val - min) / (max - min)) * (height - padding * 2) - padding;
            return `${x},${y}`;
        }).join(' ');

        return <polyline points={points} fill="none" stroke={color} strokeWidth="2" />;
    };

    return (
        <div className="p-4 bg-pastel-surface rounded-xl shadow-lg shadow-indigo-100 text-pastel-text w-full mt-6">
            <h3 className="text-lg font-bold mb-4 text-pastel-primary">Live Statistics</h3>

            <div className="grid grid-cols-1 gap-4">
                {/* Population */}
                <div className="bg-white/50 rounded-lg p-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-indigo-400 font-bold">Population</span>
                        <span className="text-indigo-600">{stats[stats.length - 1].population}</span>
                    </div>
                    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                        {renderLine('population', '#6366f1')}
                    </svg>
                </div>

                {/* Food */}
                <div className="bg-white/50 rounded-lg p-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-green-400 font-bold">Food</span>
                        <span className="text-green-600">{stats[stats.length - 1].food}</span>
                    </div>
                    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                        {renderLine('food', '#4ade80')}
                    </svg>
                </div>

                {/* Avg Energy */}
                <div className="bg-white/50 rounded-lg p-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-yellow-400 font-bold">Avg Energy</span>
                        <span className="text-yellow-600">{stats[stats.length - 1].avgEnergy.toFixed(1)}</span>
                    </div>
                    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                        {renderLine('avgEnergy', '#facc15', 200)}
                    </svg>
                </div>
            </div>
        </div>
    );
}
