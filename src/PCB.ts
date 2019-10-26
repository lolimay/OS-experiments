import { EProcessStatus } from './definition/EProcessStatus';
import { randomString, randomNonNegativeInt } from './utils';

export class PCB {
    private name: string;
    private next!: PCB | null;
    private estimatedRunTime: number;
    private arrivedTime: number;
    private status: EProcessStatus;

    constructor() {
        this.name = randomString(10);
        this.arrivedTime = randomNonNegativeInt(100) + 1;
        this.estimatedRunTime = randomNonNegativeInt(100) + 1;
        this.status = EProcessStatus.READY;
    }

    public getArrivedTime() {
        return this.arrivedTime;
    }

    public setNext(pcb: PCB | null): void {
        this.next = pcb;
    }
}