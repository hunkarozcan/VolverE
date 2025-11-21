import React from 'react';
import { Entity } from '../engine/Entity';

interface EntityDetailsProps {
    entity: Entity;
    onClose: () => void;
}

export default function EntityDetails({ entity, onClose }: EntityDetailsProps) {
    return (
        <div className="absolute top-4 right-4 w-80 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-indigo-100 p-6 text-slate-700 z-50 animate-in fade-in slide-in-from-right-10 duration-300">
            <div className="flex justify-between items-center mb-4 border-b border-indigo-50 pb-2">
                <h3 className="font-bold text-lg text-indigo-900">Entity Inspector</h3>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="space-y-4">
                {/* Vitals */}
                <div className="bg-indigo-50/50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Vitals</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                            <span className="text-slate-500 text-xs">Energy</span>
                            <span className={`font-mono font-bold ${entity.energy < 30 ? 'text-red-500' : 'text-green-600'}`}>
                                {entity.energy.toFixed(1)}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-500 text-xs">Age</span>
                            <span className="font-mono font-bold text-slate-700">{entity.age}</span>
                        </div>
                        <div className="flex flex-col col-span-2">
                            <span className="text-slate-500 text-xs">Position</span>
                            <span className="font-mono text-xs text-slate-600">
                                X: {entity.position.x.toFixed(1)}, Y: {entity.position.y.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Genome */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Genome</h4>
                    <div className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Speed</span>
                            <span className="text-indigo-600">{entity.genome.speed.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Size</span>
                            <span className="text-indigo-600">{entity.genome.size.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Sense Radius</span>
                            <span className="text-indigo-600">{entity.genome.senseRadius.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-slate-500">Color</span>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-700">{entity.genome.color}</span>
                                <div
                                    className="w-3 h-3 rounded-full border border-slate-200 shadow-sm"
                                    style={{ backgroundColor: entity.genome.color }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
