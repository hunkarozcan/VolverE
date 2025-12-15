import { useState } from 'react';

interface ControlPanelProps {
    onUpdate: (params: SimulationParams) => void;
    onRestart: () => void;
    isPaused: boolean;
    hasStarted: boolean;
    onTogglePause: () => void;
    onStart: (initialPop: number) => void;
    onSave: () => void;
    onLoad: () => void;
    onRegenerateTerrain: () => void;
}

export interface SimulationParams {
    foodSpawnRate: number;
    mutationRate: number;
    simulationSpeed: number;
    terrainScale: number;
    terrainStrength: number;
}

export default function ControlPanel({
    onUpdate,
    onRestart,
    isPaused,
    hasStarted,
    onTogglePause,
    onStart,
    onSave,
    onLoad,
    onRegenerateTerrain
}: ControlPanelProps) {
    const [params, setParams] = useState<SimulationParams>({
        foodSpawnRate: 0.5,
        mutationRate: 0.05,
        simulationSpeed: 1,
        terrainScale: 0.005,
        terrainStrength: 1.0
    });
    const [initialPop, setInitialPop] = useState(20);

    const handleChange = (key: keyof SimulationParams, value: number) => {
        const newParams = { ...params, [key]: value };
        setParams(newParams);
        onUpdate(newParams);
    };

    return (
        <div className="p-6 bg-pastel-surface rounded-xl shadow-lg shadow-indigo-100 text-pastel-text w-full">
            <h3 className="text-xl font-bold mb-6 text-pastel-primary">Controls</h3>

            {!hasStarted && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <label className="block text-sm font-bold mb-2 text-indigo-900">Initial Population: {initialPop}</label>
                    <input
                        type="range" min="1" max="100" step="1"
                        value={initialPop}
                        onChange={(e) => setInitialPop(parseInt(e.target.value))}
                        className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>
            )}

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

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-600">Sim Speed: {params.simulationSpeed.toFixed(1)}x</label>
                <input
                    type="range" min="0" max="10" step="0.1"
                    value={params.simulationSpeed}
                    onChange={(e) => handleChange('simulationSpeed', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pastel-secondary"
                />
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-sm font-bold mb-4 text-gray-700">Terrain Settings</h4>
                
                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-500">Scale: {params.terrainScale.toFixed(4)}</label>
                    <input
                        type="range" min="0.001" max="0.05" step="0.001"
                        value={params.terrainScale}
                        onChange={(e) => handleChange('terrainScale', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-500">Strength: {params.terrainStrength.toFixed(1)}</label>
                    <input
                        type="range" min="0" max="5" step="0.1"
                        value={params.terrainStrength}
                        onChange={(e) => handleChange('terrainStrength', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
                    />
                </div>

                <button
                    onClick={onRegenerateTerrain}
                    className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors"
                >
                    Regenerate Terrain
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {!hasStarted ? (
                    <button
                        onClick={() => onStart(initialPop)}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Start Simulation
                    </button>
                ) : (
                    <button
                        onClick={onTogglePause}
                        className={`w-full py-3 font-bold rounded-full transition-colors shadow-md hover:shadow-lg ${isPaused
                            ? 'bg-green-500 hover:bg-green-400 text-white'
                            : 'bg-amber-400 hover:bg-amber-300 text-white'
                            }`}
                    >
                        {isPaused ? 'Resume Simulation' : 'Pause Simulation'}
                    </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onSave}
                        disabled={!hasStarted}
                        className="py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save
                    </button>
                    <button
                        onClick={onLoad}
                        className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                    >
                        Load
                    </button>
                </div>

                {hasStarted && (
                    <button
                        onClick={onRestart}
                        className="w-full py-2 mt-2 text-sm text-slate-400 hover:text-red-500 font-medium transition-colors"
                    >
                        Reset / Restart
                    </button>
                )}
            </div>
        </div>
    );
}
