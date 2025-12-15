import { Entity } from './Entity';
import { Vector } from './Vector';
import { Effect } from './Effect';
import { Perlin } from './Perlin';

export interface WorldStats {
    time: number;
    population: number;
    food: number;
    avgEnergy: number;
    avgSpeed: number;
    avgDeathAge: number;
}

export class World {
    entities: Entity[];
    food: Vector[];
    effects: Effect[];
    width: number;
    height: number;
    statsHistory: WorldStats[];
    terrain: number[][]; // 2D array of heights 0-1
    perlin: Perlin;

    // Parameters
    foodSpawnRate: number;
    mutationRate: number;
    terrainScale: number;
    terrainStrength: number;

    // Stats tracking
    totalDeaths: number = 0;
    totalDeathAge: number = 0;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.entities = [];
        this.food = [];
        this.effects = [];
        this.statsHistory = [];
        this.terrain = [];
        this.perlin = new Perlin();
        this.foodSpawnRate = 0.5; // Chance per frame
        this.mutationRate = 0.05;
        this.terrainScale = 0.005;
        this.terrainStrength = 1.0;

        this.init();
    }

    init(initialPopulation: number = 20) {
        this.entities = [];
        this.food = [];
        this.effects = [];
        this.statsHistory = [];
        
        this.regenerateTerrain();

        for (let i = 0; i < initialPopulation; i++) {
            this.entities.push(new Entity(Math.random() * this.width, Math.random() * this.height));
        }

        for (let i = 0; i < 50; i++) {
            this.food.push(new Vector(Math.random() * this.width, Math.random() * this.height));
        }
    }

    regenerateTerrain() {
        this.terrain = [];
        for (let x = 0; x < this.width; x+=10) {
            const col: number[] = [];
            for (let y = 0; y < this.height; y+=10) {
                const noise = this.perlin.noise(x * this.terrainScale, y * this.terrainScale, 0);
                col.push((noise + 1) / 2); // Normalize to 0-1
            }
            this.terrain.push(col);
        }
    }

    update() {
        // Spawn food
        if (Math.random() < this.foodSpawnRate) {
            this.food.push(new Vector(Math.random() * this.width, Math.random() * this.height));
        }

        // Update effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].age++;
            if (this.effects[i].age >= this.effects[i].maxAge) {
                this.effects.splice(i, 1);
            }
        }

        // Update entities
        const newEntities: Entity[] = [];

        // We iterate backwards to safely remove dead entities
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const e = this.entities[i];
            e.update(this.width, this.height, this.food, this.entities, this.terrain, this.terrainStrength);

            if (e.isDead) {
                // Entity died
                this.totalDeaths++;
                this.totalDeathAge += e.age;

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
            for (let j = this.food.length - 1; j >= 0; j--) {
                if (e.position.dist(this.food[j]) < e.size) {
                    this.food.splice(j, 1);
                    e.energy += 40; // Energy gain from food
                }
            }

            // Reproduce
            // Check collision with other entities for mating
            for (let other of this.entities) {
                if (e !== other && e.position.dist(other.position) < (e.size + other.size)) {
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

        // Record stats
        if (this.statsHistory.length > 20000) {
            this.statsHistory.shift();
        }
        const totalEnergy = this.entities.reduce((acc, e) => acc + e.energy, 0);
        const avgEnergy = this.entities.length ? totalEnergy / this.entities.length : 0;
        const totalSpeed = this.entities.reduce((acc, e) => acc + e.maxSpeed, 0);
        const avgSpeed = this.entities.length ? totalSpeed / this.entities.length : 0;

        const avgDeathAge = this.totalDeaths > 0 ? this.totalDeathAge / this.totalDeaths : 0;

        this.statsHistory.push({
            time: Date.now(),
            population: this.entities.length,
            food: this.food.length,
            avgEnergy,
            avgSpeed,
            avgDeathAge
        });
    }

    toJSON() {
        return {
            width: this.width,
            height: this.height,
            entities: this.entities.map(e => e.toJSON()),
            food: this.food,
            statsHistory: this.statsHistory,
            foodSpawnRate: this.foodSpawnRate,
            mutationRate: this.mutationRate,
            totalDeaths: this.totalDeaths,
            totalDeathAge: this.totalDeathAge
        };
    }

    static fromJSON(json: string): World {
        const data = JSON.parse(json);
        const world = new World(data.width, data.height);
        world.entities = data.entities.map((e: any) => Entity.fromJSON(e));
        world.food = data.food.map((f: any) => Vector.fromJSON(f));
        world.statsHistory = data.statsHistory || [];
        world.foodSpawnRate = data.foodSpawnRate;
        world.mutationRate = data.mutationRate;
        world.totalDeaths = data.totalDeaths || 0;
        world.totalDeathAge = data.totalDeathAge || 0;
        return world;
    }

    getTerrainHeight(x: number, y: number): number {
        const gridX = Math.floor(x / 10);
        const gridY = Math.floor(y / 10);
        
        if (gridX >= 0 && gridX < this.terrain.length && gridY >= 0 && gridY < this.terrain[0].length) {
            return this.terrain[gridX][gridY];
        }
        return 0;
    }
}
