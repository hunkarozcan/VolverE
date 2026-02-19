import { Genome, crossover, createGenome } from './Genome';
import { Vector } from './Vector';

export class Entity {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    genome: Genome;
    energy: number;
    age: number;
    isDead: boolean;

    // New: health
    maxHealth: number;
    health: number;

    // Derived traits
    maxSpeed: number;
    maxForce: number;
    senseRadius: number;
    size: number;
    reproUrge: number;

    currentTarget: Vector | null;

    // New: pollution/immunity & poop timer
    pollutionImmunity: number; // 0-1
    poopCooldown: number;
    poopReady: boolean;

    // New: poop interval controls (set by World)
    poopIntervalMin: number;
    poopIntervalMax: number;

    constructor(x: number, y: number, genome?: Genome) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(Math.random() - 0.5, Math.random() - 0.5);
        this.acceleration = new Vector(0, 0);
        this.genome = genome || createGenome();
        this.energy = 100;
        this.age = 0;
        this.isDead = false;
        this.reproUrge = 0;
        this.currentTarget = null;

        // New: health
        this.maxHealth = 100;
        this.health = 100;

        // Map genome to physical traits
        this.maxSpeed = 2 + this.genome.speed * 4;
        this.maxForce = 0.1 + this.genome.speed * 0.2;
        this.senseRadius = 50 + this.genome.senseRadius * 150;
        this.size = 5 + this.genome.size * 15;

        // New: immunity & poop timer
        this.pollutionImmunity = Entity.immunityFromColor(this.genome.color);
        this.poopIntervalMin = 20;
        this.poopIntervalMax = 120;
        this.poopCooldown = this.poopIntervalMin + Math.floor(Math.random() * (this.poopIntervalMax - this.poopIntervalMin + 1));
        this.poopReady = false;
    }

    update(width: number, height: number, food: Vector[], entities: Entity[], terrain?: number[][], terrainStrength: number = 1.0) {
        this.age++;
        this.reproUrge++;

        // New: passive regen
        this.health = Math.min(this.maxHealth, this.health + 0.03);

        // Metabolic cost
        const cost = (this.size * 0.01) + (this.maxSpeed * 0.01) + (this.senseRadius * 0.001);
        this.energy -= cost;

        if (this.energy <= 0 || this.age > 2000 || this.health <= 0) {
            this.isDead = true;
            return;
        }

        // Decision making
        if (this.reproUrge > 200 && this.energy > 120) {
            this.findMate(entities);
        } else {
            this.hunt(food);
        }

        // New: poop timer
        this.poopCooldown--;
        if (this.poopCooldown <= 0) {
            this.poopReady = true;
            this.poopCooldown = this.poopIntervalMin + Math.floor(Math.random() * (this.poopIntervalMax - this.poopIntervalMin + 1));
            this.poopCooldown -= Math.floor(this.size * 0.5);
            if (this.poopCooldown < 5) this.poopCooldown = 5;
        }

        // Terrain Physics
        if (terrain) {
            const gridX = Math.floor(this.position.x / 10);
            const gridY = Math.floor(this.position.y / 10);
            
            if (gridX >= 0 && gridX < terrain.length - 1 && gridY >= 0 && gridY < terrain[0].length - 1) {
                const h = terrain[gridX][gridY];
                const hRight = terrain[gridX + 1][gridY];
                const hDown = terrain[gridX][gridY + 1];
                
                const slopeX = hRight - h;
                const slopeY = hDown - h;
                
                const slopeForce = new Vector(-slopeX * 2 * terrainStrength, -slopeY * 2 * terrainStrength);
                this.applyForce(slopeForce);
            }
        }

        // Physics
        this.velocity = this.velocity.add(this.acceleration);
        this.velocity = this.velocity.limit(this.maxSpeed);
        this.position = this.position.add(this.velocity);
        this.acceleration = this.acceleration.mult(0);

        this.checkBoundaries(width, height);
    }

    applyForce(force: Vector) {
        this.acceleration = this.acceleration.add(force);
    }

    hunt(food: Vector[]) {
        let closest: Vector | null = null;
        let recordDist = Infinity;

        for (let i = 0; i < food.length; i++) {
            const d = this.position.dist(food[i]);
            if (d < this.senseRadius && d < recordDist) {
                recordDist = d;
                closest = food[i];
            }
        }

        if (closest) {
            this.currentTarget = closest;
            this.seek(closest);
        } else {
            this.currentTarget = null;
            this.wander();
        }
    }

    findMate(entities: Entity[]) {
        let closest: Entity | null = null;
        let recordDist = Infinity;

        for (let other of entities) {
            if (other === this) continue;
            const d = this.position.dist(other.position);
            if (d < this.senseRadius && d < recordDist && other.reproUrge > 200) {
                recordDist = d;
                closest = other;
            }
        }

        if (closest) {
            this.currentTarget = closest.position;
            this.seek(closest.position);
        } else {
            this.currentTarget = null;
            this.wander();
        }
    }

    seek(target: Vector) {
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
        const target = wanderPoint.add(new Vector(x, y));
        this.seek(target);
    }

    checkBoundaries(width: number, height: number) {
        if (this.position.x < this.size) {
            this.position.x = this.size;
            this.velocity.x *= -1;
        }
        if (this.position.x > width - this.size) {
            this.position.x = width - this.size;
            this.velocity.x *= -1;
        }
        if (this.position.y < this.size) {
            this.position.y = this.size;
            this.velocity.y *= -1;
        }
        if (this.position.y > height - this.size) {
            this.position.y = height - this.size;
            this.velocity.y *= -1;
        }
    }

    reproduce(partner: Entity, mutationRate: number = 0.05): Entity | null {
        if (this.reproUrge > 200 && partner.reproUrge > 200 && this.energy > 50 && partner.energy > 50) {
            this.reproUrge = 0;
            partner.reproUrge = 0;
            this.energy -= 30;
            partner.energy -= 30;

            const childGenome = crossover(this.genome, partner.genome, mutationRate);
            return new Entity(this.position.x, this.position.y, childGenome);
        }
        return null;
    }

    toJSON() {
        return {
            position: this.position,
            velocity: this.velocity,
            genome: this.genome,
            energy: this.energy,
            age: this.age,
            reproUrge: this.reproUrge,
            health: this.health,
            maxHealth: this.maxHealth
        };
    }

    static fromJSON(data: any): Entity {
        const e = new Entity(data.position.x, data.position.y, data.genome);
        e.velocity = Vector.fromJSON(data.velocity);
        e.energy = data.energy;
        e.age = data.age;
        e.reproUrge = data.reproUrge;
        e.maxHealth = data.maxHealth ?? 100;
        e.health = data.health ?? e.maxHealth;
        return e;
    }

    private static immunityFromColor(color: string): number {
        // Expect #RRGGBB
        if (!color || color[0] !== '#' || color.length !== 7) return 0.5;
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return 0.5;

        // Luminance-based immunity (0.2 - 0.8)
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return 0.2 + luminance * 0.6;
    }
}
