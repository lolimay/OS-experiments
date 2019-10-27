import { EProcessStatus } from './definition/EProcessStatus';
import { randomString, randomNonNegativeInt } from './utils';

export class PCB {
    private name: string;
    private next!: PCB | null;
    private status: EProcessStatus;

    constructor(
        private arrivedTime: number = randomNonNegativeInt(100) + 1,
        private estimatedRunTime: number = randomNonNegativeInt(100) + 1,
    ) {
        this.name = randomString(10);
        this.status = EProcessStatus.READY;
    }

    public getName() {
        return this.name;
    }

    public getArrivedTime() {
        return this.arrivedTime;
    }

    public setNext(pcb: PCB | null): void {
        this.next = pcb;
    }

    public getNext(): PCB | null {
        return this.next ? this.next : null;
    }

    public getEstimatedRunTime(): number {
        return this.estimatedRunTime;
    }
}