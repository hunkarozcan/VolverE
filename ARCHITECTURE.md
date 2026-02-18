# VolverE Architecture

## Overview
VolverE is a browser-based simulation with a React/Next.js UI and a deterministic-ish simulation engine. The UI renders and controls the engine via a canvas-based adapter.

**Key goals**
- Keep simulation rules in the engine (UI-agnostic).
- Keep rendering and input handling in UI components.
- Keep stats collection consistent and stable.

---

## High-level Layers

```
UI (Next.js / React)
  └── SimulationCanvas (adapter)
        ├── Renders canvas
        ├── Runs the tick loop
        └── Bridges UI events to engine

Engine (domain core)
  ├── World: owns entities, food, effects, stats
  ├── Entity: behavior and movement
  ├── Genome: mutation/crossover rules
  └── Vector / Effect: math & visual effect data
```

---

## Data Flow

1. **UI event → Engine**
   - ControlPanel updates simulation parameters.
   - SimulationCanvas passes changes to `World` or its config.

2. **Engine tick**
   - SimulationCanvas calls `world.step(dt)`.
   - Entities update positions, consume energy, reproduce, etc.
   - World updates stats and effects.

3. **Render**
   - SimulationCanvas draws `World` state to the canvas.
   - StatisticsPanel reads stats history for charting.

---

## Key Modules

- `src/app/page.tsx`: App entry; composes layout + simulation UI.
- `src/components/SimulationCanvas.tsx`: Canvas render loop; adapter between UI and engine.
- `src/components/ControlPanel.tsx`: UI controls for parameters and toggles.
- `src/components/StatisticsPanel.tsx`: Displays stats history.
- `src/components/EntityDetails.tsx`: Inspect selected entity.

- `src/engine/World.ts`: Simulation state owner; tick/update logic.
- `src/engine/Entity.ts`: Behavior, movement, energy, reproduction.
- `src/engine/Genome.ts`: Genes, mutation, crossover.
- `src/engine/Vector.ts`: Math utilities.
- `src/engine/Effect.ts`: Visual effect data structures.

---

## Invariants (current assumptions)
- `World` is the single source of truth for simulation state.
- UI reads from `World`, but does not modify entities directly.
- Rendering is a view over the current `World` state.

---

## Extensibility Notes
- If adding new entity traits, keep genetics in `Genome` and behavior in `Entity`.
- If adding new stats, compute in `World` and expose a stable DTO for UI.
- If adding alternative renderers, keep them outside the engine.

---

## Testing Recommendations
- Unit tests: `Genome` mutation/crossover, `Entity` energy rules, `World` step invariants.
- Deterministic runs: add seeded RNG in `World` for reproducibility.
