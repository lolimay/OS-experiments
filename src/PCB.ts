import { randomString, randomNonNegativeInt } from './utils';

export class PCB {
    private name: string;
    private next!: PCB | null;
    /**
     * The smaller the priority number, the higher the priority.
     */
    private priority: number;

    constructor(
        private arrivedTime: number = randomNonNegativeInt(100) + 1,
        private estimatedRunTime: number = randomNonNegativeInt(100) + 1,
    ) {
        this.name = randomString(10);
        this.priority = randomNonNegativeInt(5);
    }

    public get isFnished() {
        return this.estimatedRunTime <= 0;
    }

    public getName() {
        return this.name;
    }

    public getArrivedTime() {
        return this.arrivedTime;
    }

    public getNext(): PCB | null {
        return this.next ? this.next : null;
    }

    public getEstimatedRunTime(): number {
        return this.estimatedRunTime;
    }

    public getPriorityNumber() {
        return this.priority;
    }

    public setNext(pcb: PCB | null): void {
        this.next = pcb;
    }

    public setEstimatedRunTime(estimatedRunTime: number): void {
        this.estimatedRunTime = estimatedRunTime;
    }

    public setPriorityNumber(priority: number): void {
        this.priority = priority;
    }
}