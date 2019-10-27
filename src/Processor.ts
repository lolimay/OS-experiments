import { EProcessorStatus } from './definition';
import { PCB } from './PCB';

export class Processor {
    private runningProcess: PCB | null;
    private finishTime: number;

    constructor() {
        this.runningProcess = null;
        this.finishTime = 0;
    }

    public getStatus(): EProcessorStatus {
        return this.runningProcess === null ? EProcessorStatus.FREE : EProcessorStatus.BUSY;
    }

    public isBusy(): boolean {
        return this.getStatus() === EProcessorStatus.BUSY;
    }

    public isFree(): boolean {
        return !this.isBusy();
    }

    public getFinishTime(): number {
        return this.finishTime;
    }

    public getRunningProcess(): PCB | null {
        return this.runningProcess;
    }

    public setRunningProcess(process: PCB | null): void {
        this.runningProcess = process;
    }

    public setFinishTime(time: number) {
        this.finishTime = time;
    }

    public setFree(): void {
        this.setRunningProcess(null);
    }
}