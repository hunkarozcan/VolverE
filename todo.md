# ⚙️ Feature: Simulation Pause & Entity Inspection

This document outlines the requirements and acceptance criteria for implementing the ability to pause the simulation and inspect individual entity states, genomes, and sensory data.

---

## 🎯 User Story

As a **simulation analyst**, I want to be able to **pause the simulation** at any moment and **inspect the state and properties** of individual entities (agents) so that I can debug their behavior, understand the effects of their current genome, and analyze their decision-making process (specifically, what food they see and target).

---

## ✅ Acceptance Criteria (AC)

### 1. Core Pause/Resume Functionality

| ID | Description | Priority |
| :--- | :--- | :--- |
| **AC-1.1** | The user can toggle the simulation state between **Running** and **Paused** using a designated UI button (e.g., "Pause/Play") and a hotkey (e.g., `Spacebar`). | High |
| **AC-1.2** | When Paused, the simulation clock and all entity movements/updates must be **halted**. | High |
| **AC-1.3** | When Resumed, the simulation must continue from the exact moment it was paused. | High |

### 2. Entity Interaction & Inspection Window

| ID | Description | Priority |
| :--- | :--- | :--- |
| **AC-2.1** | Entities must be **clickable/selectable** only when the simulation is in the **Paused** state. | High |
| **AC-2.2** | Clicking an entity must open a **dedicated "Entity Details Window"** that remains open until explicitly closed. | High |
| **AC-2.3** | The "Entity Details Window" must clearly display the selected entity's **complete Genome** (e.g., as a formatted string or key/value list of gene parameters). | High |
| **AC-2.4** | The window should include basic data like the entity's current **Energy Level**, **Age**, and **Position (X, Y)**. | Medium |

### 3. Visual Debugging Overlay

| ID | Description | Priority |
| :--- | :--- | :--- |
| **AC-3.1** | While the "Entity Details Window" is open, a **visual overlay** must appear on the main simulation canvas, tied to the selected entity. | High |
| **AC-3.2** | **Vision Range Indicator:** A transparent **circle** must be rendered around the entity, with a radius equal to its current `Vision Distance` property. | Medium |
| **AC-3.3** | **Target Vector Indicator:** A clearly visible **line or vector** must be rendered, originating from the entity's center and pointing to the specific **Food Source** it is currently locked onto as its target. | Medium |
| **AC-3.4** | Closing the "Entity Details Window" must immediately **remove** all associated visual overlays (AC-3.2 and AC-3.3). | High |

---

## 🛠️ Implementation Notes

* Consider using an overlay layer in the rendering engine for visual debugging indicators (AC-3).
* The Pause state should prevent all physics/movement updates but allow UI interactions.