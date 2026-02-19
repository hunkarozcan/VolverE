"use client";

import { useState } from 'react';

export interface SimulationParams {
    foodSpawnRate: number;
    mutationRate: number;
    simulationSpeed: number;
    terrainScale: number;
    terrainStrength: number;
    poopIntervalMin: number;
    poopIntervalMax: number;
    wasteBaseAmount: number;
    wasteSizeFactor: number;
    wasteDecay: number;
    wasteMaxAge: number;
    wasteMinAmount: number;
    pollutionRadius: number;
    pollutionThreshold: number;
    pollutionDeathRate: number;
}

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
        terrainStrength: 1.0,
        poopIntervalMin: 20,
        poopIntervalMax: 120,
        wasteBaseAmount: 0.4,
        wasteSizeFactor: 0.03,
        wasteDecay: 0.995,
        wasteMaxAge: 600,
        wasteMinAmount: 0.05,
        pollutionRadius: 60,
        pollutionThreshold: 0.8,
        pollutionDeathRate: 0.01
    });

    const [initialPop, setInitialPop] = useState(20);
    const [collapsed, setCollapsed] = useState({
        basic: false,
        pollution: false,
        terrain: false,
        controls: false
    });

    const handleChange = (key: keyof SimulationParams, value: number) => {
        const newParams = { ...params, [key]: value };
        setParams(newParams);
        onUpdate(newParams);
    };

    const toggleCollapse = (section: keyof typeof collapsed) => {
        setCollapsed(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const CollapsibleSection = ({
        title,
        section,
        children
    }: {
        title: string;
        section: keyof typeof collapsed;
        children: React.ReactNode;
    }) => (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <button
                onClick={() => toggleCollapse(section)}
                className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between font-semibold text-gray-700 active:bg-gray-100"
            >
                <span>{title}</span>
                <span className={`transition-transform duration-300 ${collapsed[section] ? 'rotate-0' : 'rotate-90'}`}>
                    ➤
                </span>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    collapsed[section] ? 'max-h-0' : 'max-h-[2000px]'
                }`}
            >
                <div className="p-4 space-y-4 border-t border-gray-200">
                    {children}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-80 max-h-screen bg-white rounded-lg shadow-lg p-6 overflow-y-auto flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">⚙️ Settings</h2>

            <CollapsibleSection title="🎮 Basic Settings" section="basic">
                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Food Spawn Rate: {params.foodSpawnRate.toFixed(2)}
                    </label>
                    <input
                        type="range" min="0" max="2" step="0.01"
                        value={params.foodSpawnRate}
                        onChange={(e) => handleChange('foodSpawnRate', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Mutation Rate: {params.mutationRate.toFixed(3)}
                    </label>
                    <input
                        type="range" min="0" max="0.5" step="0.001"
                        value={params.mutationRate}
                        onChange={(e) => handleChange('mutationRate', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div className="mb-0">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Simulation Speed: {params.simulationSpeed}x
                    </label>
                    <input
                        type="range" min="0.1" max="5" step="0.1"
                        value={params.simulationSpeed}
                        onChange={(e) => handleChange('simulationSpeed', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="💨 Pollution Settings" section="pollution">
                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Poop Interval Min: {params.poopIntervalMin}
                    </label>
                    <input
                        type="range" min="5" max="200" step="1"
                        value={params.poopIntervalMin}
                        onChange={(e) => handleChange('poopIntervalMin', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Poop Interval Max: {params.poopIntervalMax}
                    </label>
                    <input
                        type="range" min="10" max="300" step="1"
                        value={params.poopIntervalMax}
                        onChange={(e) => handleChange('poopIntervalMax', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Waste Base Amount: {params.wasteBaseAmount.toFixed(2)}
                    </label>
                    <input
                        type="range" min="0.1" max="1.0" step="0.01"
                        value={params.wasteBaseAmount}
                        onChange={(e) => handleChange('wasteBaseAmount', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Waste Decay: {params.wasteDecay.toFixed(3)}
                    </label>
                    <input
                        type="range" min="0.98" max="0.999" step="0.001"
                        value={params.wasteDecay}
                        onChange={(e) => handleChange('wasteDecay', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Pollution Radius: {params.pollutionRadius}
                    </label>
                    <input
                        type="range" min="20" max="200" step="5"
                        value={params.pollutionRadius}
                        onChange={(e) => handleChange('pollutionRadius', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Pollution Threshold: {params.pollutionThreshold.toFixed(2)}
                    </label>
                    <input
                        type="range" min="0.2" max="1.5" step="0.01"
                        value={params.pollutionThreshold}
                        onChange={(e) => handleChange('pollutionThreshold', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                    />
                </div>

                <div className="mb-0">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Pollution Death Rate: {params.pollutionDeathRate.toFixed(3)}
                    </label>
                    <input
                        type="range" min="0" max="0.05" step="0.001"
                        value={params.pollutionDeathRate}
                        onChange={(e) => handleChange('pollutionDeathRate', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                    />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="🏔️ Terrain Settings" section="terrain">
                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Terrain Scale: {params.terrainScale.toFixed(4)}
                    </label>
                    <input
                        type="range" min="0.001" max="0.02" step="0.001"
                        value={params.terrainScale}
                        onChange={(e) => handleChange('terrainScale', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                </div>

                <div className="mb-0">
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Terrain Strength: {params.terrainStrength.toFixed(2)}
                    </label>
                    <input
                        type="range" min="0" max="2" step="0.1"
                        value={params.terrainStrength}
                        onChange={(e) => handleChange('terrainStrength', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="🎛️ Controls" section="controls">
                <button
                    onClick={onTogglePause}
                    className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg font-semibold text-white transition active:bg-yellow-600"
                >
                    {isPaused ? '▶ Resume' : '⏸ Pause'}
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={onSave}
                        className="flex-1 py-2 bg-blue-400 hover:bg-blue-500 rounded-lg font-semibold text-white transition active:bg-blue-600"
                    >
                        💾 Save
                    </button>
                    <button
                        onClick={onLoad}
                        className="flex-1 py-2 bg-blue-400 hover:bg-blue-500 rounded-lg font-semibold text-white transition active:bg-blue-600"
                    >
                        📂 Load
                    </button>
                </div>
                <button
                    onClick={onRegenerateTerrain}
                    className="w-full py-2 bg-purple-400 hover:bg-purple-500 rounded-lg font-semibold text-white transition active:bg-purple-600"
                >
                    🔄 Regenerate Terrain
                </button>
                <button
                    onClick={onRestart}
                    className="w-full py-2 bg-red-400 hover:bg-red-500 rounded-lg font-semibold text-white transition active:bg-red-600"
                >
                    🔁 Reset / Restart
                </button>
            </CollapsibleSection>
        </div>
    );
}
