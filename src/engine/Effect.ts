export interface Effect {
    x: number;
    y: number;
    type: 'birth' | 'death' | 'mating';
    age: number;
    maxAge: number;
    color: string;
}
