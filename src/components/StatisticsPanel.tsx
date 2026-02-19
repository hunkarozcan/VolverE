import React from 'react';
import { WorldStats } from '../engine/World';

interface StatisticsPanelProps {
    statsHistory: WorldStats[];
}

const StatisticsPanel = ({ statsHistory }: StatisticsPanelProps) => {
    // Dynamic scaling for charts
    const maxPopulation = Math.max(...statsHistory.map(s => s.population), 50);
    const maxFood = Math.max(...statsHistory.map(s => s.food), 50);
    const maxAvgEnergy = Math.max(...statsHistory.map(s => s.avgEnergy), 50);
    const maxAvgSpeed = Math.max(...statsHistory.map(s => s.avgSpeed), 5);

    const scalePopulation = (val: number) => (val / maxPopulation) * 100;
    const scaleFood = (val: number) => (val / maxFood) * 100;
    const scaleEnergy = (val: number) => (val / maxAvgEnergy) * 100;
    const scaleSpeed = (val: number) => (val / maxAvgSpeed) * 100;

    return (
        <div className="w-full h-full flex flex-col gap-6 p-6 bg-white rounded-lg overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800">Live Statistics</h3>

            {/* Population Chart */}
            <div>
                <h4 className="text-sm font-semibold text-blue-600 mb-2">
                    Population {statsHistory.length > 0 ? `(${statsHistory[statsHistory.length - 1].population})` : ''}
                </h4>
                <svg viewBox="0 0 600 150" className="w-full border border-gray-200 rounded">
                    <polyline
                        points={statsHistory.map((s, i) => `${(i / statsHistory.length) * 600},${150 - scalePopulation(s.population)}`).join(' ')}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                    />
                </svg>
                <p className="text-xs text-gray-500 mt-1">Max: {maxPopulation}</p>
            </div>

            {/* Food Chart */}
            <div>
                <h4 className="text-sm font-semibold text-green-600 mb-2">
                    Food {statsHistory.length > 0 ? `(${statsHistory[statsHistory.length - 1].food})` : ''}
                </h4>
                <svg viewBox="0 0 600 150" className="w-full border border-gray-200 rounded">
                    <polyline
                        points={statsHistory.map((s, i) => `${(i / statsHistory.length) * 600},${150 - scaleFood(s.food)}`).join(' ')}
                        fill="none"
                        stroke="#4ade80"
                        strokeWidth="2"
                    />
                </svg>
                <p className="text-xs text-gray-500 mt-1">Max: {maxFood}</p>
            </div>

            {/* Average Energy Chart */}
            <div>
                <h4 className="text-sm font-semibold text-yellow-600 mb-2">
                    Avg Energy {statsHistory.length > 0 ? `(${statsHistory[statsHistory.length - 1].avgEnergy.toFixed(1)})` : ''}
                </h4>
                <svg viewBox="0 0 600 150" className="w-full border border-gray-200 rounded">
                    <polyline
                        points={statsHistory.map((s, i) => `${(i / statsHistory.length) * 600},${150 - scaleEnergy(s.avgEnergy)}`).join(' ')}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                    />
                </svg>
                <p className="text-xs text-gray-500 mt-1">Max: {maxAvgEnergy.toFixed(1)}</p>
            </div>

            {/* Average Speed Chart */}
            <div>
                <h4 className="text-sm font-semibold text-cyan-600 mb-2">
                    Avg Speed {statsHistory.length > 0 ? `(${statsHistory[statsHistory.length - 1].avgSpeed.toFixed(2)})` : ''}
                </h4>
                <svg viewBox="0 0 600 150" className="w-full border border-gray-200 rounded">
                    <polyline
                        points={statsHistory.map((s, i) => `${(i / statsHistory.length) * 600},${150 - scaleSpeed(s.avgSpeed)}`).join(' ')}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                    />
                </svg>
                <p className="text-xs text-gray-500 mt-1">Max: {maxAvgSpeed.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default StatisticsPanel;
