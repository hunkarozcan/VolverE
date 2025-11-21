module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/engine/Genome.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/engine/Vector.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/engine/Entity.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Entity",
    ()=>Entity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Genome$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/engine/Genome.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/engine/Vector.ts [app-ssr] (ecmascript)");
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
        this.position = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector"](x, y);
        this.velocity = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector"](Math.random() - 0.5, Math.random() - 0.5);
        this.acceleration = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector"](0, 0);
        this.genome = genome || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Genome$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createGenome"])();
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
        const target = wanderPoint.add(new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector"](x, y));
        this.seek(target);
    }
    checkBoundaries(width, height) {
        if (this.position.x < -this.size) this.position.x = width + this.size;
        if (this.position.x > width + this.size) this.position.x = -this.size;
        if (this.position.y < -this.size) this.position.y = height + this.size;
        if (this.position.y > height + this.size) this.position.y = -this.size;
    }
    reproduce(partner, mutationRate = 0.05) {
        if (this.reproUrge > 200 && partner.reproUrge > 200 && this.energy > 50 && partner.energy > 50) {
            this.reproUrge = 0;
            partner.reproUrge = 0;
            this.energy -= 30;
            partner.energy -= 30;
            const childGenome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Genome$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crossover"])(this.genome, partner.genome, mutationRate);
            return new Entity(this.position.x, this.position.y, childGenome);
        }
        return null;
    }
}
}),
"[project]/src/engine/World.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "World",
    ()=>World
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Entity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/engine/Entity.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/engine/Vector.ts [app-ssr] (ecmascript)");
;
;
class World {
    entities;
    food;
    effects;
    width;
    height;
    // Parameters
    foodSpawnRate;
    mutationRate;
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.entities = [];
        this.food = [];
        this.effects = [];
        this.foodSpawnRate = 0.5; // Chance per frame
        this.mutationRate = 0.05;
        this.init();
    }
    init() {
        this.entities = [];
        this.food = [];
        this.effects = [];
        for(let i = 0; i < 20; i++){
            this.entities.push(new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Entity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Entity"](Math.random() * this.width, Math.random() * this.height));
        }
        for(let i = 0; i < 50; i++){
            this.food.push(new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector"](Math.random() * this.width, Math.random() * this.height));
        }
    }
    update() {
        // Spawn food
        if (Math.random() < this.foodSpawnRate) {
            this.food.push(new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$Vector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector"](Math.random() * this.width, Math.random() * this.height));
        }
        // Update effects
        for(let i = this.effects.length - 1; i >= 0; i--){
            this.effects[i].age++;
            if (this.effects[i].age >= this.effects[i].maxAge) {
                this.effects.splice(i, 1);
            }
        }
        // Update entities
        const newEntities = [];
        // We iterate backwards to safely remove dead entities
        for(let i = this.entities.length - 1; i >= 0; i--){
            const e = this.entities[i];
            e.update(this.width, this.height, this.food, this.entities);
            if (e.isDead) {
                this.effects.push({
                    x: e.position.x,
                    y: e.position.y,
                    type: 'death',
                    age: 0,
                    maxAge: 30,
                    color: 'rgba(255, 0, 0, 0.5)'
                });
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
                    const child = e.reproduce(other, this.mutationRate);
                    if (child) {
                        newEntities.push(child);
                        // Birth effect
                        this.effects.push({
                            x: child.position.x,
                            y: child.position.y,
                            type: 'birth',
                            age: 0,
                            maxAge: 40,
                            color: 'rgba(255, 255, 255, 0.8)'
                        });
                        // Mating effect (at midpoint)
                        this.effects.push({
                            x: (e.position.x + other.position.x) / 2,
                            y: (e.position.y + other.position.y) / 2,
                            type: 'mating',
                            age: 0,
                            maxAge: 20,
                            color: 'rgba(255, 105, 180, 0.6)'
                        });
                    }
                }
            }
        }
        this.entities.push(...newEntities);
    }
}
}),
"[project]/src/components/ControlPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ControlPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
function ControlPanel({ onUpdate, onRestart }) {
    const [params, setParams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        foodSpawnRate: 0.5,
        mutationRate: 0.05,
        simulationSpeed: 1
    });
    const handleChange = (key, value)=>{
        const newParams = {
            ...params,
            [key]: value
        };
        setParams(newParams);
        onUpdate(newParams);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 bg-pastel-surface rounded-xl shadow-lg shadow-indigo-100 text-pastel-text w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xl font-bold mb-6 text-pastel-primary",
                children: "Controls"
            }, void 0, false, {
                fileName: "[project]/src/components/ControlPanel.tsx",
                lineNumber: 29,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium mb-2 text-gray-600",
                        children: [
                            "Food Spawn Rate: ",
                            params.foodSpawnRate.toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ControlPanel.tsx",
                        lineNumber: 32,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0",
                        max: "1",
                        step: "0.01",
                        value: params.foodSpawnRate,
                        onChange: (e)=>handleChange('foodSpawnRate', parseFloat(e.target.value)),
                        className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pastel-accent"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ControlPanel.tsx",
                        lineNumber: 33,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ControlPanel.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium mb-2 text-gray-600",
                        children: [
                            "Mutation Rate: ",
                            params.mutationRate.toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ControlPanel.tsx",
                        lineNumber: 42,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0",
                        max: "0.5",
                        step: "0.01",
                        value: params.mutationRate,
                        onChange: (e)=>handleChange('mutationRate', parseFloat(e.target.value)),
                        className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pastel-primary"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ControlPanel.tsx",
                        lineNumber: 43,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ControlPanel.tsx",
                lineNumber: 41,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium mb-2 text-gray-600",
                        children: [
                            "Sim Speed: ",
                            params.simulationSpeed.toFixed(1),
                            "x"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ControlPanel.tsx",
                        lineNumber: 52,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0",
                        max: "10",
                        step: "0.1",
                        value: params.simulationSpeed,
                        onChange: (e)=>handleChange('simulationSpeed', parseFloat(e.target.value)),
                        className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pastel-secondary"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ControlPanel.tsx",
                        lineNumber: 53,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ControlPanel.tsx",
                lineNumber: 51,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onRestart,
                className: "w-full py-3 bg-pastel-primary hover:bg-indigo-300 text-white font-bold rounded-full transition-colors shadow-md hover:shadow-lg",
                children: "Restart Simulation"
            }, void 0, false, {
                fileName: "[project]/src/components/ControlPanel.tsx",
                lineNumber: 61,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ControlPanel.tsx",
        lineNumber: 28,
        columnNumber: 9
    }, this);
}
}),
"[project]/src/components/SimulationCanvas.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SimulationCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$World$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/engine/World.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ControlPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ControlPanel.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function SimulationCanvas() {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const worldRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        pop: 0,
        food: 0,
        avgSpeed: 0
    });
    const simSpeedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(1);
    const handleUpdate = (params)=>{
        if (worldRef.current) {
            worldRef.current.foodSpawnRate = params.foodSpawnRate;
            worldRef.current.mutationRate = params.mutationRate;
        }
        simSpeedRef.current = params.simulationSpeed;
    };
    const handleRestart = ()=>{
        if (worldRef.current) {
            worldRef.current.init();
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!canvasRef.current || !containerRef.current) return;
        // Resize canvas to fit container
        // We use the parent width but keep height fixed for now or responsive
        const width = containerRef.current.clientWidth - 340; // Approximate width minus sidebar
        const height = 600;
        canvasRef.current.width = width > 400 ? width : 400;
        canvasRef.current.height = height;
        const w = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$engine$2f$World$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["World"](canvasRef.current.width, height);
        worldRef.current = w;
        let animationId;
        const ctx = canvasRef.current.getContext('2d');
        let frameCount = 0;
        let speedAccumulator = 0;
        const render = ()=>{
            if (!ctx) return;
            // Run updates based on sim speed
            speedAccumulator += simSpeedRef.current;
            while(speedAccumulator >= 1){
                w.update();
                speedAccumulator -= 1;
            }
            // Clear
            ctx.fillStyle = '#2d2b42'; // Pastel Navy
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
            // Draw Effects
            for (const effect of w.effects){
                const alpha = 1 - effect.age / effect.maxAge;
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
                const totalSpeed = w.entities.reduce((acc, e)=>acc + e.maxSpeed, 0);
                setStats({
                    pop: w.entities.length,
                    food: w.food.length,
                    avgSpeed: w.entities.length ? totalSpeed / w.entities.length : 0
                });
            }
            animationId = requestAnimationFrame(render);
        };
        render();
        return ()=>cancelAnimationFrame(animationId);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "w-full flex flex-col lg:flex-row gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-6 p-6 bg-pastel-surface rounded-xl shadow-lg shadow-indigo-100 text-pastel-text font-mono text-sm border border-indigo-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-400 uppercase tracking-wider",
                                        children: "Population"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SimulationCanvas.tsx",
                                        lineNumber: 139,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl font-bold text-pastel-primary",
                                        children: stats.pop
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SimulationCanvas.tsx",
                                        lineNumber: 140,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SimulationCanvas.tsx",
                                lineNumber: 138,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-400 uppercase tracking-wider",
                                        children: "Food"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SimulationCanvas.tsx",
                                        lineNumber: 143,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl font-bold text-pastel-accent",
                                        children: stats.food
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SimulationCanvas.tsx",
                                        lineNumber: 144,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SimulationCanvas.tsx",
                                lineNumber: 142,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-400 uppercase tracking-wider",
                                        children: "Avg Speed"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SimulationCanvas.tsx",
                                        lineNumber: 147,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl font-bold text-pastel-secondary",
                                        children: stats.avgSpeed.toFixed(2)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SimulationCanvas.tsx",
                                        lineNumber: 148,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SimulationCanvas.tsx",
                                lineNumber: 146,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SimulationCanvas.tsx",
                        lineNumber: 137,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: canvasRef,
                        className: "rounded-xl shadow-2xl shadow-indigo-200 w-full"
                    }, void 0, false, {
                        fileName: "[project]/src/components/SimulationCanvas.tsx",
                        lineNumber: 151,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SimulationCanvas.tsx",
                lineNumber: 136,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full lg:w-80",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ControlPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    onUpdate: handleUpdate,
                    onRestart: handleRestart
                }, void 0, false, {
                    fileName: "[project]/src/components/SimulationCanvas.tsx",
                    lineNumber: 154,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/SimulationCanvas.tsx",
                lineNumber: 153,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SimulationCanvas.tsx",
        lineNumber: 135,
        columnNumber: 9
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__27a53a86._.js.map