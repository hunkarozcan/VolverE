import { useState } from 'react';

interface ControlPanelProps {
    onUpdate: (params: SimulationParams) => void;
    onRestart: () => void;
    isPaused: boolean;
    onTogglePause: () => void;
}

export interface SimulationParams {
    foodSpawnRate: number;
    mutationRate: number;
    simulationSpeed: number;
}

export default function ControlPanel({ onUpdate, onRestart, isPaused, onTogglePause }: ControlPanelProps) {
    const [params, setParams] = useState<SimulationParams>({
        foodSpawnRate: 0.5,
        mutationRate: 0.05,
        simulationSpeed: 1
    });

    const handleChange = (key: keyof SimulationParams, value: number) => {
        const newParams = { ...params, [key]: value };
        setParams(newParams);
        onUpdate(newParams);
    };

    return (
        <div className="p-6 bg-pastel-surface rounded-xl shadow-lg shadow-indigo-100 text-pastel-text w-full">
            <h3 className="text-xl font-bold mb-6 text-pastel-primary">Controls</h3>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-600">Food Spawn Rate: {params.foodSpawnRate.toFixed(2)}</label>
                <input
                    type="range" min="0" max="1" step="0.01"
                    value={params.foodSpawnRate}
                    onChange={(e) => handleChange('foodSpawnRate', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pastel-accent"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-600">Mutation Rate: {params.mutationRate.toFixed(2)}</label>
                <input
                    type="range" min="0" max="0.5" step="0.01"
                    value={params.mutationRate}
                    onChange={(e) => handleChange('mutationRate', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pastel-primary"
                />
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium mb-2 text-gray-600">Sim Speed: {params.simulationSpeed.toFixed(1)}x</label>
                <input
                    type="range" min="0" max="10" step="0.1"
                    value={params.simulationSpeed}
                    onChange={(e) => handleChange('simulationSpeed', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pastel-secondary"
                />
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={onTogglePause}
                    className={`w-full py-3 font-bold rounded-full transition-colors shadow-md hover:shadow-lg ${isPaused
                            ? 'bg-green-500 hover:bg-green-400 text-white'
                            : 'bg-amber-400 hover:bg-amber-300 text-white'
                        }`}
                >
                    {isPaused ? 'Resume Simulation' : 'Pause Simulation'}
                </button>

                <button
                    onClick={onRestart}
                    className="w-full py-3 bg-pastel-primary hover:bg-indigo-300 text-white font-bold rounded-full transition-colors shadow-md hover:shadow-lg"
                >
                    Restart Simulation
                </button>
            </div>
        </div>
    );
}
