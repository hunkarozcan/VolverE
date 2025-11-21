# Walkthrough - Simulation Pause & Entity Inspection

This document outlines the new features added to the simulation: Pause/Resume functionality, Entity Inspection, and Visual Debugging.

## Changes

### 1. Pause/Resume
- **Control Panel**: Added a "Pause/Resume" button.
- **Keyboard Shortcut**: Press `Spacebar` to toggle pause.
- **Behavior**: When paused, the simulation stops updating (entities freeze), but the UI remains responsive.

### 2. Entity Inspection
- **Selection**: When paused, click on any entity to select it.
- **Entity Details Window**: A new window appears displaying:
    - **Vitals**: Energy, Age, Position.
    - **Genome**: Speed, Size, Sense Radius, Color.
- **Closing**: Click the "X" button or select another entity (or restart).

### 3. Visual Debugging
- **Vision Range**: A yellow circle indicates the selected entity's vision range.
- **Target Vector**: A red dashed line points to the entity's current target (food or mate), with a red "X" at the target location.
- **Highlight**: The selected entity is highlighted with a white ring.

## Verification Steps

1.  **Start the Simulation**: Open the application.
2.  **Pause**: Press `Spacebar` or click "Pause Simulation". Verify entities stop moving.
3.  **Select Entity**: Click on an entity. Verify the "Entity Inspector" window opens.
4.  **Inspect Data**: Check that the data in the window matches the visual properties (e.g., color, approximate position).
5.  **Check Overlays**:
    - Verify the yellow vision circle.
    - If the entity was hunting or seeking a mate, verify the red dashed line points to a food item or another entity.
6.  **Resume**: Press `Spacebar`. Verify the simulation continues.
    - *Note*: The selection and overlays remain active, allowing you to track the entity in real-time!
7.  **Restart**: Click "Restart Simulation". Verify selection is cleared and simulation resets.

## Screenshots

*(Screenshots would be placed here in a real report)*
