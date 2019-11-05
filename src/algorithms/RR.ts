import { PCB } from '../PCB';
import { Processor } from '../Processor';
import { Queue } from '../Queue';
import { green, print, red, yellow } from '../utils';

/**
 * Round Robin Algorithm (RR)
 */
export function RR(...pcbs: Array<PCB>): void {
    // Initialize
    pcbs = pcbs.sort((a, b) => a.getArrivedTime() > b.getArrivedTime() ? 1 : -1);
    const TIME_SLICE = 3;
    const processor: Processor = new Processor();
    const readyQueue: Queue<PCB> = new Queue();
    const head: PCB = pcbs[0];
    let process: PCB = head;
    let lastProcess: PCB = null;

    for (let i=0; i<pcbs.length; i++) {
        if (i === pcbs.length-1) {
            pcbs[i].setNext(null);
            break;
        }
        pcbs[i].setNext(pcbs[i+1]);
    }

    // Scheduling
    window.addEventListener('tick', ({ detail: { now } }: CustomEvent) => {
        const formattedNow = now.toString().padEnd(3, ' ');
        let events: Array<string> = [];
        let processStatus: string = '';

        if (processor.isBusy() && now === processor.getFinishTime()) {
            const process = processor.getRunningProcess();

            if (process.getEstimatedRunTime() > 0) {
                readyQueue.enqueue(processor.getRunningProcess());
            } else {
                events.push(`process ${ yellow(process.getName()) } ${ red('ended') }`);
            }
            lastProcess = process;
            processor.setFree();
        }

        (function updateReadyQueue() {
            if (now === process?.getArrivedTime()) {
                events.push(`Process ${ yellow(process.getName()) } ${ green('arrived') }`);
                readyQueue.enqueue(process);
                process = process.getNext();
                updateReadyQueue();
            }
        })();

        if (processor.isFree() && !readyQueue.isEmpty()) {
            const runningProcess = readyQueue.dequeue();
            const estimatedRunTime = runningProcess.getEstimatedRunTime();
            const runTime = TIME_SLICE < estimatedRunTime ? TIME_SLICE : estimatedRunTime;

            processor.setRunningProcess(runningProcess);
            processor.setFinishTime(now + runTime);
            if (runningProcess !== lastProcess) {
                events.push(`Processor started running process ${ yellow(runningProcess.getName()) }`);
            }
        }

        if (processor.isBusy()) {
            const runningProcess = processor.getRunningProcess();

            runningProcess.setEstimatedRunTime(runningProcess.getEstimatedRunTime() - 1);
        }

        const overview = pcbs.map(
            process => `${ process.getName() } ${ green(process.getEstimatedRunTime().toString()) }`
        ).join(' ');
        processStatus = `[ ${ processor.getRunningProcess()?.getName() || ''.padEnd(10,' ') } ]`;
        if (events.length > 0) {
            for (let eventMsg of events) {
                print(`${ formattedNow.padEnd(20, ' ') } ${ eventMsg }`);
            }
        }
        print(`${ formattedNow } ${ processStatus } ${ overview }`);
    });

    print(pcbs.map(pcb => ({...pcb, next: pcb.getNext()?.getName() })));
}