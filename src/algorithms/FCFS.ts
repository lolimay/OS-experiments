import { EventType, IEvent } from '../definition';
import { store } from '../index';
import { PCB } from '../PCB';
import { Processor } from '../Processor';
import { Queue } from '../Queue';
import { green, print, red, yellow } from '../utils';

/**
 * First-Come First-Serverd (FCFS) Algorithm
 */
export function FCFS(...pcbs: Array<PCB>): void {
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
        let events: Array<IEvent> = [];
        let processStatus: string = '';

        if (processor.isBusy() && now === processor.getFinishTime()) {
            const currentProcess = processor.getRunningProcess()?.getName();

            events.push({
                type: EventType.ProcessEnded,
                msg: `process ${yellow(currentProcess)} ${red('ended')}`,
                processName: currentProcess,
                time: now
            });
            processor.setFree();
        }

        (function updateReadyQueue() {
            if (now === process?.getArrivedTime()) {
                events.push({
                    msg: `Process ${yellow(process.getName())} ${green('arrived')}`,
                    type: EventType.ProcessArrived,
                    time: now,
                    processName: process.getName(),
                });
                readyQueue.enqueue(process);
                process = process.getNext();
                updateReadyQueue();
            }
        })();

        if (processor.isFree() && !readyQueue.isEmpty()) {
            const runningProcess = readyQueue.dequeue();

            processor.setRunningProcess(runningProcess);
            processor.setFinishTime(now + runningProcess?.getEstimatedRunTime());
            events.push({
                msg: `Processor started running process ${yellow(runningProcess.getName())}`,
                type: EventType.ProcessStarted,
                time: now,
                processName: runningProcess.getName()
            });
        }

        processStatus = `[ ${processor.getRunningProcess()?.getName() || ''.padEnd(10, ' ')} ]`;
        if (events.length > 0) {
            for (let { msg } of events) {
                print(`${formattedNow.padEnd(20, ' ')} ${msg}`);

                events.forEach(({ type, time, processName }) => {
                    store.processes.forEach(process => {
                        const { name, arrivedTime = undefined, startTime = undefined } = process;

                        if (name === processName) {
                            switch (type) {
                                case EventType.ProcessArrived:
                                    process.arrivedTime = time.toString();
                                    break;
                                case EventType.ProcessStarted:
                                    process.startTime = time.toString();
                                    break;
                                case EventType.ProcessEnded:
                                    process.finishTime = time.toString();
                                    break;
                                default:
                                    break;
                            }

                        }
                        if (process.finishTime) {
                            process.servedTime = (parseInt(process.finishTime) - parseInt(startTime)).toString();
                            process.turnAroundTime = (parseInt(process.finishTime) - parseInt(arrivedTime)).toString();
                        }
                    });
                });
            }
        }
        print(`${formattedNow} ${processStatus}`);
    });
}