"use client";
import { useEffect, useRef, useState } from 'react';
import { World } from '../engine/World';
import { Entity } from '../engine/Entity';
import ControlPanel, { SimulationParams } from './ControlPanel';
import EntityDetails from './EntityDetails';

export default function SimulationCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const worldRef = useRef<World | null>(null);
    const [stats, setStats] = useState({ pop: 0, food: 0, avgSpeed: 0 });
    const simSpeedRef = useRef(1);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
    const isPausedRef = useRef(false); // Ref for animation loop access

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
            setSelectedEntity(null);
        }
    };

    const togglePause = () => {
        const newState = !isPausedRef.current;
        setIsPaused(newState);
        isPausedRef.current = newState;
    };

    // Handle canvas click for entity selection
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isPausedRef.current || !worldRef.current || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Adjust for canvas scaling if necessary (here we assume 1:1 for simplicity or handle scale)
        // Since we set width/height directly, client coordinates should map if no CSS scaling.
        // But canvas might be scaled by CSS. Let's assume 1:1 mapping for now as per existing code.

        // Find clicked entity
        let clicked: Entity | null = null;
        // Iterate backwards to find top-most
        for (let i = worldRef.current.entities.length - 1; i >= 0; i--) {
            const ent = worldRef.current.entities[i];
            const dist = Math.sqrt(Math.pow(ent.position.x - x, 2) + Math.pow(ent.position.y - y, 2));
            if (dist <= ent.size + 5) { // +5 for easier clicking
                clicked = ent;
                break;
            }
        }

        setSelectedEntity(clicked);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent scrolling
                togglePause();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        // Resize canvas to fit container
        const width = containerRef.current.clientWidth - 340;
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

            // Run updates based on sim speed ONLY if not paused
            if (!isPausedRef.current) {
                speedAccumulator += simSpeedRef.current;
                while (speedAccumulator >= 1) {
                    w.update();
                    speedAccumulator -= 1;
                }
            }

            // Clear
            ctx.fillStyle = '#2d2b42';
            ctx.fillRect(0, 0, w.width, w.height);

            // Draw Food
            ctx.fillStyle = '#4ade80';
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

            // Draw Selection Overlays
            // We access the state selectedEntity via a ref or just closure if we didn't use state in render loop.
            // But render is a closure created once. `selectedEntity` state change triggers re-render of component, 
            // but `render` function inside useEffect is NOT recreated because dependency array is [].
            // So `selectedEntity` inside `render` will be stale (null).
            // We need to use a ref for selectedEntity to access it inside the loop.
            // OR, we can rely on the fact that we are redrawing every frame, so we can pass the current selected entity 
            // to a ref that is updated when state changes.

            // Let's use a ref for the selected entity for the render loop
            if (selectedEntityRef.current) {
                const e = selectedEntityRef.current;
                // Check if entity is still alive/in world (optional, but good practice)
                if (!e.isDead) {
                    ctx.save();

                    // Vision Range
                    ctx.beginPath();
                    ctx.arc(e.position.x, e.position.y, e.senseRadius, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.05)';
                    ctx.fill();

                    // Target Vector
                    if (e.currentTarget) {
                        ctx.beginPath();
                        ctx.moveTo(e.position.x, e.position.y);
                        ctx.lineTo(e.currentTarget.x, e.currentTarget.y);
                        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
                        ctx.lineWidth = 2;
                        ctx.setLineDash([5, 5]);
                        ctx.stroke();

                        // Draw X at target
                        const tx = e.currentTarget.x;
                        const ty = e.currentTarget.y;
                        ctx.setLineDash([]);
                        ctx.beginPath();
                        ctx.moveTo(tx - 5, ty - 5);
                        ctx.lineTo(tx + 5, ty + 5);
                        ctx.moveTo(tx + 5, ty - 5);
                        ctx.lineTo(tx - 5, ty + 5);
                        ctx.strokeStyle = 'red';
                        ctx.stroke();
                    }

                    // Highlight Entity
                    ctx.beginPath();
                    ctx.arc(e.position.x, e.position.y, e.size + 4, 0, Math.PI * 2);
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    ctx.restore();
                }
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
    }, []); // Empty dependency array means this runs once.

    // Ref to keep track of selected entity inside the animation loop
    const selectedEntityRef = useRef<Entity | null>(null);
    useEffect(() => {
        selectedEntityRef.current = selectedEntity;
    }, [selectedEntity]);

    return (
        <div ref={containerRef} className="w-full flex flex-col lg:flex-row gap-6 relative">
            {selectedEntity && (
                <EntityDetails
                    entity={selectedEntity}
                    onClose={() => setSelectedEntity(null)}
                />
            )}
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
                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className={`rounded-xl shadow-2xl shadow-indigo-200 w-full ${isPaused ? 'cursor-pointer' : 'cursor-default'}`}
                />
            </div>
            <div className="w-full lg:w-80">
                <ControlPanel
                    onUpdate={handleUpdate}
                    onRestart={handleRestart}
                    isPaused={isPaused}
                    onTogglePause={togglePause}
                />
            </div>
        </div>
    );
}
