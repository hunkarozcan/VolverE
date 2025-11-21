export interface Genome {
    speed: number; // 0-1: Determines max speed
    senseRadius: number; // 0-1: Determines vision range
    size: number; // 0-1: Determines energy usage and durability
    bravery: number; // 0-1: Fight vs Flight threshold
    altruism: number; // 0-1: Probability of sharing/not attacking
    color: string; // Hex color for visualization
}

export const createGenome = (): Genome => {
    return {
        speed: Math.random(),
        senseRadius: Math.random(),
        size: Math.random(),
        bravery: Math.random(),
        altruism: Math.random(),
        color: getRandomColor(),
    };
};

export const crossover = (parentA: Genome, parentB: Genome, mutationRate: number): Genome => {
    const child: any = {};
    const keys = Object.keys(parentA) as (keyof Genome)[];

    keys.forEach((key) => {
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

    return child as Genome;
};

function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function adjustColor(color: string, amount: number): string {
    return color; // Placeholder for color mutation logic
}
