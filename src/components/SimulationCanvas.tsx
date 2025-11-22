"use client";
import { useEffect, useRef, useState } from 'react';
import { World, WorldStats } from '../engine/World';
import { Entity } from '../engine/Entity';
import ControlPanel, { SimulationParams } from './ControlPanel';
import EntityDetails from './EntityDetails';
import StatisticsPanel from './StatisticsPanel';

interface SimulationCanvasProps {
    initialWorldData?: string | null;
}

export default function SimulationCanvas({ initialWorldData }: SimulationCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const worldRef = useRef<World | null>(null);
    const [stats, setStats] = useState({ pop: 0, food: 0, avgSpeed: 0, avgDeathAge: 0 });
    const [statsHistory, setStatsHistory] = useState<WorldStats[]>([]);
    const simSpeedRef = useRef(1);
    const [isPaused, setIsPaused] = useState(true); // Start paused
    const [hasStarted, setHasStarted] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
    const isPausedRef = useRef(true); // Start paused

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
            setHasStarted(true);
            setIsPaused(false);
            isPausedRef.current = false;
        }
    };

    const handleStart = (initialPop: number) => {
        if (worldRef.current) {
            worldRef.current.init(initialPop);
            setHasStarted(true);
            setIsPaused(false);
            isPausedRef.current = false;
        }
    };

    const togglePause = () => {
        const newState = !isPausedRef.current;
        setIsPaused(newState);
        isPausedRef.current = newState;
    };

    const handleSave = () => {
        if (!worldRef.current) return;
        const json = JSON.stringify(worldRef.current.toJSON());
        navigator.clipboard.writeText(json).then(() => {
            alert('Simulation data copied to clipboard!');
        });
    };

    const handleLoad = () => {
        const json = prompt("Paste simulation JSON data:");
        if (json) {
            try {
                const w = World.fromJSON(json);
                // Update ref
                worldRef.current = w;
                // Update canvas size if needed, or force world size to canvas
                if (canvasRef.current) {
                    w.width = canvasRef.current.width;
                    w.height = canvasRef.current.height;
                }
                setHasStarted(true);
                setIsPaused(true); // Load in paused state
                isPausedRef.current = true;
                setSelectedEntity(null);
            } catch (e) {
                alert("Invalid JSON data");
            }
        }
    };

    // Handle canvas click for entity selection
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isPausedRef.current || !worldRef.current || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

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
            if (e.code === 'Space' && hasStarted) {
                e.preventDefault(); // Prevent scrolling
                togglePause();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasStarted]);

    // Ref to keep track of selected entity inside the animation loop
    const selectedEntityRef = useRef<Entity | null>(null);
    useEffect(() => {
        selectedEntityRef.current = selectedEntity;
    }, [selectedEntity]);

    const hasStartedRef = useRef(false);
    useEffect(() => {
        hasStartedRef.current = hasStarted;
    }, [hasStarted]);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        // Resize canvas to fit container
        const width = containerRef.current.clientWidth - 340;
        const height = 600;
        canvasRef.current.width = width > 400 ? width : 400;
        canvasRef.current.height = height;

        // Initialize empty world if not already set
        if (!worldRef.current) {
            const w = new World(canvasRef.current.width, height);
            w.entities = [];
            w.food = [];
            worldRef.current = w;
        }

        const w = worldRef.current!;

        let animationId: number;
        const ctx = canvasRef.current.getContext('2d');

        let frameCount = 0;
        let speedAccumulator = 0;

        const render = () => {
            if (!ctx) return;

            // Run updates based on sim speed ONLY if not paused and started
            if (!isPausedRef.current && hasStartedRef.current) {
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
            if (selectedEntityRef.current) {
                const e = selectedEntityRef.current;
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
                    avgSpeed: w.entities.length ? totalSpeed / w.entities.length : 0,
                    avgDeathAge: w.totalDeaths > 0 ? w.totalDeathAge / w.totalDeaths : 0
                });
                // Sync stats history for graph
                setStatsHistory([...w.statsHistory]);
            }

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationId);
    }, []);

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
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Avg Death Age</span>
                        <span className="text-2xl font-bold text-red-400">{stats.avgDeathAge.toFixed(1)}</span>
                    </div>
                </div>
                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className={`rounded - xl shadow - 2xl shadow - indigo - 200 w - full ${isPaused ? 'cursor-pointer' : 'cursor-default'} `}
                />
            </div>
            <div className="w-full lg:w-80">
                <ControlPanel
                    onUpdate={handleUpdate}
                    onRestart={handleRestart}
                    isPaused={isPaused}
                    hasStarted={hasStarted}
                    onTogglePause={togglePause}
                    onStart={handleStart}
                    onSave={handleSave}
                    onLoad={handleLoad}
                />
                <StatisticsPanel stats={statsHistory} />
            </div>
        </div>
    );
}
