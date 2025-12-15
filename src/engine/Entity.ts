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

    // Derived traits
    maxSpeed: number;
    maxForce: number;
    senseRadius: number;
    size: number;
    reproUrge: number;

    currentTarget: Vector | null;

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

        // Map genome to physical traits
        this.maxSpeed = 2 + this.genome.speed * 4;
        this.maxForce = 0.1 + this.genome.speed * 0.2;
        this.senseRadius = 50 + this.genome.senseRadius * 150;
        this.size = 5 + this.genome.size * 15;
    }

    update(width: number, height: number, food: Vector[], entities: Entity[], terrain?: number[][], terrainStrength: number = 1.0) {
        this.age++;
        this.reproUrge++;

        // Metabolic cost
        const cost = (this.size * 0.01) + (this.maxSpeed * 0.01) + (this.senseRadius * 0.001);
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
                
                // Gravity/Slope force: push downhill
                // If slope is positive (uphill), force is negative.
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
            reproUrge: this.reproUrge
        };
    }

    static fromJSON(data: any): Entity {
        const e = new Entity(data.position.x, data.position.y, data.genome);
        e.velocity = Vector.fromJSON(data.velocity);
        e.energy = data.energy;
        e.age = data.age;
        e.reproUrge = data.reproUrge;
        return e;
    }
}
