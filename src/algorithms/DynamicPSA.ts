import { PCB } from '../PCB';
import { print } from '../utils';
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
        let eventMsg: string = '';
        let processStatus: string = '[ ]';

        if (processor.isBusy() && now === processor.getFinishTime()) {
            eventMsg += `Process ${ processor.getRunningProcess()?.getName() } ended. `;
            processor.setFree();
        }

        (function updateReadyQueue() {
            if (now === process?.getArrivedTime()) {
                eventMsg += `Process ${ process.getName() } arrived. `;
                readyQueue.enqueue(process);
                readyQueue.sort((a, b) => a.getPriorityNumber() > b.getPriorityNumber() ? 1 : -1);
                process = process.getNext();
                updateReadyQueue();
            }
        })();

        if (processor.isFree() && !readyQueue.isEmpty()) {
            const runningProcess = readyQueue.dequeue();

            processor.setRunningProcess(runningProcess);
            processor.setFinishTime(now + runningProcess?.getEstimatedRunTime());
            eventMsg += `Processor started running process ${ runningProcess.getName() }. `;
        }

        processStatus = `[ ${ processor.getRunningProcess()?.getName() || '' } ]`;
        if (eventMsg) {
            print(`${ formattedNow } ${ eventMsg }`);
        }
        print(`${ formattedNow } ${ processStatus }`);
    });

    print(pcbs.map(pcb => ({...pcb, next: pcb.getNext()?.getName() })));
}