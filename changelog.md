# Changelog

## [Unreleased]

### Added
- **Simulation Pause & Entity Inspection**
  - Implemented core pause/resume functionality with UI button and Spacebar hotkey.
  - Simulation clock and entity movements halt when paused.
  - Entities are clickable/selectable only when the simulation is paused.
  - Added "Entity Details Window" displaying:
    - Genome (Speed, Size, Sense Radius, Color)
    - Energy Level, Age, Position (X, Y)
  - Added Visual Debugging Overlay:
    - Vision Range Indicator (circle around entity).
    - Target Vector Indicator (line to target food source).
- **Header Redesign**
  - Removed image-based logo.
  - Implemented modern typographic header with gradient text.
- **Statistics**
  - Added "Average Death Age" to the statistics panel.
  - Tracks the average age of entities when they die.
