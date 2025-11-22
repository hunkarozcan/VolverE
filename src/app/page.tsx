"use client";
import SimulationCanvas from '../components/SimulationCanvas';

export default function Home() {
    return (
        <main className="min-h-screen bg-pastel-bg p-4 lg:p-8 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-500 drop-shadow-sm">
                            VolverE
                        </span>
                    </h1>
                    <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">
                        Evolutionary Simulation Engine
                    </p>
                </header>

                <SimulationCanvas />
            </div>
        </main>
    );
}
