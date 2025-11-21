import SimulationCanvas from "@/components/SimulationCanvas";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-8 bg-pastel-bg">
            <div className="max-w-6xl w-full items-center justify-between font-mono text-sm lg:flex mb-8">
                <h1 className="text-4xl font-bold text-pastel-primary tracking-tight">
                    Evolution Simulation
                </h1>
                <p className="text-gray-500 font-medium">
                    Natural selection in action.
                </p>
            </div>

            <div className="w-full max-w-6xl">
                <SimulationCanvas />
            </div>

            <div className="mt-12 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-3 gap-8 text-gray-600">
                <div className="p-6 bg-pastel-surface border border-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-pastel-primary mb-3">Genetics</h3>
                    <p>Entities inherit traits like speed, size, and sense radius from their parents with random mutations.</p>
                </div>
                <div className="p-6 bg-pastel-surface border border-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-pastel-secondary mb-3">Selection</h3>
                    <p>Limited food resources force competition. Only the fittest survive to reproduce.</p>
                </div>
                <div className="p-6 bg-pastel-surface border border-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-pastel-accent mb-3">Energy</h3>
                    <p>Movement and existence cost energy. Eating replenishes it. Reproduction requires a surplus.</p>
                </div>
            </div>
        </main>
    );
}
