import { PCB } from '../PCB';
import { Processor } from '../Processor';
import { Queue } from '../Queue';
import { green, print, red, yellow } from '../utils';
/**
 * Priority-Scheduling-Algorithm (PSA) Algorithm
 */
export function PSA(...pcbs: Array<PCB>): void {
    // Initialize
    pcbs = pcbs.sort((a, b) => a.getArrivedTime() > b.getArrivedTime() ? 1 : -1);
    const processor: Processor = new Processor();
    const readyQueue: Queue<PCB> = new Queue();
    const head: PCB | null = pcbs[0];
    let process: PCB | null = head;

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
            events.push(`process ${ yellow(processor.getRunningProcess()?.getName()) } ${ red('ended') }`);
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
            processor.setFinishTime(now + runningProcess?.getEstimatedRunTime());
            events.push(`Processor started running process ${ yellow(runningProcess.getName()) }`);
        }

        processStatus = `[ ${ processor.getRunningProcess()?.getName() || ''.padEnd(10,' ') } ]`;
        if (events.length > 0) {
            for (let eventMsg of events) {
                print(`${ formattedNow.padEnd(20, ' ') } ${ eventMsg }`);
            }
        }
        print(`${ formattedNow } ${ processStatus }`);
    });

    print(pcbs.map(pcb => ({...pcb, next: pcb.getNext()?.getName() })));
}