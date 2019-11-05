import { PCB } from '../PCB';
import { print, red, green, yellow } from '../utils';
import { Processor } from '../Processor';
import { Queue } from '../Queue';

/**
 * Dynamic-Priority-Scheduling-Algorithm (Dynamic-PSA) Algorithm
 * - The processor always chooses the process to run with the highest priority
 *   (aka. the smallest priority number) from the ready queue.
 * - One process can run only 1 second one time, and its priority number
 *   is increased by one after the end.
 * - After one process was run, check whether its priority is lower that any process
 *   in the ready queue. If so, replace it with the one which has the higher priority.
 * - If one process's estimated run time is zero, set it status to finished and remove
 *   it from the ready queue.
 */
export function DynamicPSA(...pcbs: Array<PCB>): void {
    // Initialize
    pcbs = pcbs.sort((a, b) => a.getArrivedTime() > b.getArrivedTime() ? 1 : -1);
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
            readyQueue.sort((a, b) => a.getPriorityNumber() > b.getPriorityNumber() ? 1 : -1);
        })();

        if (processor.isFree() && !readyQueue.isEmpty()) {
            const runningProcess = readyQueue.dequeue();

            processor.setRunningProcess(runningProcess);
            processor.setFinishTime(now + 1);
            runningProcess.setEstimatedRunTime(runningProcess.getEstimatedRunTime() -1);
            runningProcess.setPriorityNumber(runningProcess.getPriorityNumber() + 1);
            if (runningProcess !== lastProcess) {
                events.push(`Processor started running process ${ yellow(runningProcess.getName()) }`);
            }
        }

        const overview = pcbs.map(
            process => `${ process.getName() }/${ process.getEstimatedRunTime() }/${ process.getPriorityNumber() }`
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