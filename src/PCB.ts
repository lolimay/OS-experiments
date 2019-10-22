import { EProcessStatus } from './definition/EProcessStatus';
import { randomString } from './utils/randomString';

export default class PCB {
    private name: string;
    private next!: PCB;
    private estimatedRunTime: number;
    private arrivedTime: number;
    private status: EProcessStatus;

    constructor() {
        this.name = randomString(10);
        this.status = EProcessStatus.READY;
        this.estimatedRunTime = 
    }

    public setNext(pcb: PCB): void {
        this.next = pcb;
    }
}