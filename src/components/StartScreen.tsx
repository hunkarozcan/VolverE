import React, { useState } from 'react';

interface StartScreenProps {
    onStartNew: () => void;
    onLoad: (jsonData: string) => void;
}

export default function StartScreen({ onStartNew, onLoad }: StartScreenProps) {
    const [isImporting, setIsImporting] = useState(false);
    const [importData, setImportData] = useState('');
    const [error, setError] = useState('');

    const handleImport = () => {
        try {
            JSON.parse(importData); // Validate JSON
            onLoad(importData);
        } catch (e) {
            setError('Invalid JSON data');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-300">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
                    VolverE
                </h1>
                <p className="text-slate-500 mb-8">Evolutionary Simulation Engine</p>

                {!isImporting ? (
                    <div className="space-y-4">
                        <button
                            onClick={onStartNew}
                            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-1"
                        >
                            Start New Simulation
                        </button>
                        <button
                            onClick={() => setIsImporting(true)}
                            className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                        >
                            Load Simulation
                        </button>
                    </div>
                ) : (
                    <div className="text-left">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Paste Simulation Data (JSON)
                        </label>
                        <textarea
                            value={importData}
                            onChange={(e) => {
                                setImportData(e.target.value);
                                setError('');
                            }}
                            className="w-full h-40 p-3 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none mb-2"
                            placeholder='{"width":...}'
                        />
                        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsImporting(false)}
                                className="flex-1 py-2 text-slate-500 hover:text-slate-700 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!importData}
                                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Load
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
