import { PCB } from '../PCB';
import { print } from '../utils';
import { Processor } from '../Processor';
import { Queue } from '../Queue';

/**
 * First-Come First-Serverd (FCFS) Algorithm
 */
export function FCFS(...pcbs: Array<PCB>): void {
    // Initialize
    pcbs.sort((a, b) => a.getArrivedTime() > b.getArrivedTime() ? 1 : -1);
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