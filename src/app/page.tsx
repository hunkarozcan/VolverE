"use client";
import SimulationCanvas from '../components/SimulationCanvas';

export default function Home() {
    return (
        <main className="min-h-screen bg-pastel-bg p-4 lg:p-8 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
                            VolverE
                        </h1>
                        <p className="text-slate-500 font-medium">Evolutionary Simulation Engine</p>
                    </div>
                </header>

                <SimulationCanvas />
            </div>
        </main>
    );
}
