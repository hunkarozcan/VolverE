(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/engine/Genome.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createGenome",
    ()=>createGenome,
    "crossover",
    ()=>crossover
]);
const createGenome = ()=>{
    return {
        speed: Math.random(),
        senseRadius: Math.random(),
        size: Math.random(),
        bravery: Math.random(),
        altruism: Math.random(),
        color: getRandomColor()
    };
};
const crossover = (parentA, parentB, mutationRate)=>{
    const child = {};
    const keys = Object.keys(parentA);
    keys.forEach((key)=>{
        if (key === 'color') {
            // Blend colors or pick one
            child[key] = Math.random() > 0.5 ? parentA[key] : parentB[key];
        } else {
            // 50/50 chance from each parent
            child[key] = Math.random() > 0.5 ? parentA[key] : parentB[key];
            // Mutation
            if (Math.random() < mutationRate) {
                child[key] = Math.max(0, Math.min(1, child[key] + (Math.random() - 0.5) * 0.2));
            }
        }
    });
    // Mutate color slightly
    if (Math.random() < mutationRate) {
        child.color = adjustColor(child.color, 20);
    }
    return child;
};
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for(let i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function adjustColor(color, amount) {
    return color; // Placeholder for color mutation logic
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/engine/Vector.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Vector",
    ()=>Vector
]);
class Vector {
    x;
    y;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    mult(n) {
        return new Vector(this.x * n, this.y * n);
    }
    div(n) {
        return new Vector(this.x / n, this.y / n);
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        const m = this.mag();
        if (m > 0) {
            return this.div(m);
        }
        return new Vector(0, 0);
    }
    limit(max) {
        if (this.mag() > max) {
            return this.normalize().mult(max);
        }
        return this;
    }
    dist(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/engine/Entity.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Entity",
    ()=>Entity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Genome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/engine/Genome.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/engine/Vector.ts [app-client] (ecmascript)");
;
;
class Entity {
    position;
    velocity;
    acceleration;
    genome;
    energy;
    age;
    isDead;
    // Derived traits
    maxSpeed;
    maxForce;
    senseRadius;
    size;
    reproUrge;
    constructor(x, y, genome){
        this.position = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector"](x, y);
        this.velocity = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector"](Math.random() - 0.5, Math.random() - 0.5);
        this.acceleration = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector"](0, 0);
        this.genome = genome || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Genome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createGenome"])();
        this.energy = 100;
        this.age = 0;
        this.isDead = false;
        this.reproUrge = 0;
        // Map genome to physical traits
        this.maxSpeed = 2 + this.genome.speed * 4;
        this.maxForce = 0.1 + this.genome.speed * 0.2;
        this.senseRadius = 50 + this.genome.senseRadius * 150;
        this.size = 5 + this.genome.size * 15;
    }
    update(width, height, food, entities) {
        this.age++;
        this.reproUrge++;
        // Metabolic cost
        const cost = this.size * 0.01 + this.maxSpeed * 0.01 + this.senseRadius * 0.001;
        this.energy -= cost;
        if (this.energy <= 0 || this.age > 2000) {
            this.isDead = true;
            return;
        }
        // Decision making
        if (this.reproUrge > 200 && this.energy > 120) {
            this.findMate(entities);
        } else {
            this.hunt(food);
        }
        // Physics
        this.velocity = this.velocity.add(this.acceleration);
        this.velocity = this.velocity.limit(this.maxSpeed);
        this.position = this.position.add(this.velocity);
        this.acceleration = this.acceleration.mult(0);
        this.checkBoundaries(width, height);
    }
    applyForce(force) {
        this.acceleration = this.acceleration.add(force);
    }
    hunt(food) {
        let closest = null;
        let recordDist = Infinity;
        for(let i = 0; i < food.length; i++){
            const d = this.position.dist(food[i]);
            if (d < this.senseRadius && d < recordDist) {
                recordDist = d;
                closest = food[i];
            }
        }
        if (closest) {
            this.seek(closest);
        } else {
            this.wander();
        }
    }
    findMate(entities) {
        let closest = null;
        let recordDist = Infinity;
        for (let other of entities){
            if (other === this) continue;
            const d = this.position.dist(other.position);
            if (d < this.senseRadius && d < recordDist && other.reproUrge > 200) {
                recordDist = d;
                closest = other;
            }
        }
        if (closest) {
            this.seek(closest.position);
        } else {
            this.wander();
        }
    }
    seek(target) {
        const desired = target.sub(this.position).normalize().mult(this.maxSpeed);
        const steer = desired.sub(this.velocity).limit(this.maxForce);
        this.applyForce(steer);
    }
    wander() {
        const wanderPoint = this.velocity.normalize().mult(50).add(this.position);
        const theta = Math.random() * Math.PI * 2;
        const radius = 20;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const target = wanderPoint.add(new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector"](x, y));
        this.seek(target);
    }
    checkBoundaries(width, height) {
        if (this.position.x < -this.size) this.position.x = width + this.size;
        if (this.position.x > width + this.size) this.position.x = -this.size;
        if (this.position.y < -this.size) this.position.y = height + this.size;
        if (this.position.y > height + this.size) this.position.y = -this.size;
    }
    reproduce(partner) {
        if (this.reproUrge > 200 && partner.reproUrge > 200 && this.energy > 50 && partner.energy > 50) {
            this.reproUrge = 0;
            partner.reproUrge = 0;
            this.energy -= 30;
            partner.energy -= 30;
            const childGenome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Genome$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["crossover"])(this.genome, partner.genome, 0.05);
            return new Entity(this.position.x, this.position.y, childGenome);
        }
        return null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/engine/World.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "World",
    ()=>World
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Entity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/engine/Entity.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/engine/Vector.ts [app-client] (ecmascript)");
;
;
class World {
    entities;
    food;
    width;
    height;
    // Parameters
    foodSpawnRate;
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.entities = [];
        this.food = [];
        this.foodSpawnRate = 0.5; // Chance per frame
        this.init();
    }
    init() {
        this.entities = [];
        this.food = [];
        for(let i = 0; i < 20; i++){
            this.entities.push(new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Entity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Entity"](Math.random() * this.width, Math.random() * this.height));
        }
        for(let i = 0; i < 50; i++){
            this.food.push(new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector"](Math.random() * this.width, Math.random() * this.height));
        }
    }
    update() {
        // Spawn food
        if (Math.random() < this.foodSpawnRate) {
            this.food.push(new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector"](Math.random() * this.width, Math.random() * this.height));
        }
        // Update entities
        const newEntities = [];
        // We iterate backwards to safely remove dead entities
        for(let i = this.entities.length - 1; i >= 0; i--){
            const e = this.entities[i];
            e.update(this.width, this.height, this.food, this.entities);
            if (e.isDead) {
                this.entities.splice(i, 1);
                continue;
            }
            // Eat food
            for(let j = this.food.length - 1; j >= 0; j--){
                if (e.position.dist(this.food[j]) < e.size) {
                    this.food.splice(j, 1);
                    e.energy += 40; // Energy gain from food
                }
            }
            // Reproduce
            // Check collision with other entities for mating
            for (let other of this.entities){
                if (e !== other && e.position.dist(other.position) < e.size + other.size) {
                    const child = e.reproduce(other);
                    if (child) {
                        newEntities.push(child);
                    }
                }
            }
        }
        this.entities.push(...newEntities);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SimulationCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SimulationCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$World$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/engine/World.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function SimulationCanvas() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const worldRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        pop: 0,
        food: 0,
        avgSpeed: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SimulationCanvas.useEffect": ()=>{
            if (!canvasRef.current || !containerRef.current) return;
            // Resize canvas to fit container
            const width = containerRef.current.clientWidth;
            const height = 600;
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            const w = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$World$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["World"](width, height);
            worldRef.current = w;
            let animationId;
            const ctx = canvasRef.current.getContext('2d');
            let frameCount = 0;
            const render = {
                "SimulationCanvas.useEffect.render": ()=>{
                    if (!ctx) return;
                    w.update();
                    // Clear
                    ctx.fillStyle = '#111';
                    ctx.fillRect(0, 0, w.width, w.height);
                    // Draw Food
                    ctx.fillStyle = '#4ade80'; // Green-400
                    for (const f of w.food){
                        ctx.beginPath();
                        ctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    // Draw Entities
                    for (const e of w.entities){
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
                    // Update stats every 60 frames
                    frameCount++;
                    if (frameCount % 30 === 0) {
                        const totalSpeed = w.entities.reduce({
                            "SimulationCanvas.useEffect.render.totalSpeed": (acc, e)=>acc + e.maxSpeed
                        }["SimulationCanvas.useEffect.render.totalSpeed"], 0);
                        setStats({
                            pop: w.entities.length,
                            food: w.food.length,
                            avgSpeed: w.entities.length ? totalSpeed / w.entities.length : 0
                        });
                    }
                    animationId = requestAnimationFrame(render);
                }
            }["SimulationCanvas.useEffect.render"];
            render();
            return ({
                "SimulationCanvas.useEffect": ()=>cancelAnimationFrame(animationId)
            })["SimulationCanvas.useEffect"];
        }
    }["SimulationCanvas.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "w-full flex flex-col gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-4 p-4 bg-zinc-900 rounded-lg text-white font-mono text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Population: ",
                            stats.pop
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SimulationCanvas.tsx",
                        lineNumber: 82,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Food: ",
                            stats.food
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SimulationCanvas.tsx",
                        lineNumber: 83,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Avg Speed: ",
                            stats.avgSpeed.toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SimulationCanvas.tsx",
                        lineNumber: 84,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SimulationCanvas.tsx",
                lineNumber: 81,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "border border-zinc-700 rounded-lg shadow-2xl"
            }, void 0, false, {
                fileName: "[project]/src/components/SimulationCanvas.tsx",
                lineNumber: 86,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SimulationCanvas.tsx",
        lineNumber: 80,
        columnNumber: 9
    }, this);
}
_s(SimulationCanvas, "Z2yWXACwpLvND6UMvICgz+qv8MU=");
_c = SimulationCanvas;
var _c;
__turbopack_context__.k.register(_c, "SimulationCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_38679e7d._.js.map