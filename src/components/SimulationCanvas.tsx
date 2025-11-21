"use client";
import { useEffect, useRef, useState } from 'react';
import { World } from '../engine/World';
import ControlPanel, { SimulationParams } from './ControlPanel';

export default function SimulationCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const worldRef = useRef<World | null>(null);
    const [stats, setStats] = useState({ pop: 0, food: 0, avgSpeed: 0 });
    const simSpeedRef = useRef(1);

    const handleUpdate = (params: SimulationParams) => {
        if (worldRef.current) {
            worldRef.current.foodSpawnRate = params.foodSpawnRate;
            worldRef.current.mutationRate = params.mutationRate;
        }
        simSpeedRef.current = params.simulationSpeed;
    };

    const handleRestart = () => {
        if (worldRef.current) {
            worldRef.current.init();
        }
    };

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        // Resize canvas to fit container
        // We use the parent width but keep height fixed for now or responsive
        const width = containerRef.current.clientWidth - 340; // Approximate width minus sidebar
        const height = 600;
        canvasRef.current.width = width > 400 ? width : 400;
        canvasRef.current.height = height;

        const w = new World(canvasRef.current.width, height);
        worldRef.current = w;

        let animationId: number;
        const ctx = canvasRef.current.getContext('2d');

        let frameCount = 0;

        let speedAccumulator = 0;

        const render = () => {
            if (!ctx) return;

            // Run updates based on sim speed
            speedAccumulator += simSpeedRef.current;
            while (speedAccumulator >= 1) {
                w.update();
                speedAccumulator -= 1;
            }

            // Clear
            ctx.fillStyle = '#2d2b42'; // Pastel Navy
            ctx.fillRect(0, 0, w.width, w.height);

            // Draw Food
            ctx.fillStyle = '#4ade80'; // Green-400
            for (const f of w.food) {
                ctx.beginPath();
                ctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw Entities
            for (const e of w.entities) {
                ctx.fillStyle = e.genome.color;
                ctx.beginPath();
                ctx.arc(e.position.x, e.position.y, e.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw eye/direction
                const eyeX = e.position.x + e.velocity.normalize().x * (e.size * 0.7);
                const eyeY = e.position.y + e.velocity.normalize().y * (e.size * 0.7);
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(eyeX, eyeY, e.size * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw Effects
            for (const effect of w.effects) {
                const alpha = 1 - (effect.age / effect.maxAge);
                ctx.save();
                ctx.globalAlpha = alpha;
                
                if (effect.type === 'birth') {
                    ctx.beginPath();
                    ctx.arc(effect.x, effect.y, effect.age * 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = effect.color;
                    ctx.fill();
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else if (effect.type === 'death') {
                    ctx.beginPath();
                    ctx.arc(effect.x, effect.y, Math.max(0, 20 - effect.age * 0.5), 0, Math.PI * 2);
                    ctx.fillStyle = effect.color;
                    ctx.fill();
                } else if (effect.type === 'mating') {
                    ctx.beginPath();
                    ctx.arc(effect.x, effect.y, 10 + effect.age * 0.5, 0, Math.PI * 2);
                    ctx.fillStyle = effect.color;
                    ctx.fill();
                }
                
                ctx.restore();
            }


            // Update stats every 30 frames
            frameCount++;
            if (frameCount % 30 === 0) {
                const totalSpeed = w.entities.reduce((acc, e) => acc + e.maxSpeed, 0);
                setStats({
                    pop: w.entities.length,
                    food: w.food.length,
                    avgSpeed: w.entities.length ? totalSpeed / w.entities.length : 0
                });
            }

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div ref={containerRef} className="w-full flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
                <div className="flex gap-6 p-6 bg-pastel-surface rounded-xl shadow-lg shadow-indigo-100 text-pastel-text font-mono text-sm border border-indigo-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Population</span>
                        <span className="text-2xl font-bold text-pastel-primary">{stats.pop}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Food</span>
                        <span className="text-2xl font-bold text-pastel-accent">{stats.food}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Avg Speed</span>
                        <span className="text-2xl font-bold text-pastel-secondary">{stats.avgSpeed.toFixed(2)}</span>
                    </div>
                </div>
                <canvas ref={canvasRef} className="rounded-xl shadow-2xl shadow-indigo-200 w-full" />
            </div>
            <div className="w-full lg:w-80">
                <ControlPanel onUpdate={handleUpdate} onRestart={handleRestart} />
            </div>
        </div>
    );
}
