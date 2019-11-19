import { EventType, IEvent } from '../definition';
import { store } from '../index';
import { PCB } from '../PCB';
import { Processor } from '../Processor';
import { Queue } from '../Queue';
import { green, print, red, yellow } from '../utils';

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
    let firstStartTimes: Map<string, number> = new Map();
    let estimatedRunTimes: Map<string, number> = new Map();

    pcbs.forEach(process => {
        estimatedRunTimes.set(process.getName(), process.getEstimatedRunTime());
    });

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
            const process = processor.getRunningProcess();

            if (process.getEstimatedRunTime() > 0) {
                readyQueue.enqueue(processor.getRunningProcess());

                store.processes.forEach(process => {
                    if (process.name === processor.getRunningProcess()?.getName()) {
                        process.servedTime = String(estimatedRunTimes.get(process.name) - processor.getRunningProcess().getEstimatedRunTime());
                    }
                });
            } else {
                const currentProcess = process.getName();
                events.push({
                    type: EventType.ProcessEnded,
                    msg: `process ${ yellow(currentProcess) } ${ red('ended') }`,
                    processName: currentProcess,
                    time: now
                });
            }
            lastProcess = process;
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
            readyQueue.sort((a, b) => a.getPriorityNumber() > b.getPriorityNumber() ? 1 : -1);
        })();

        if (processor.isFree() && !readyQueue.isEmpty()) {
            const runningProcess = readyQueue.dequeue();

            processor.setRunningProcess(runningProcess);
            processor.setFinishTime(now + 1);
            runningProcess.setEstimatedRunTime(runningProcess.getEstimatedRunTime() -1);
            runningProcess.setPriorityNumber(runningProcess.getPriorityNumber() + 1);
            if (runningProcess !== lastProcess) {
                if (!firstStartTimes.has(runningProcess.getName())) {
                    firstStartTimes.set(runningProcess.getName(), now);
                }
                events.push({
                    msg: `Processor started running process ${yellow(runningProcess.getName())}`,
                    type: EventType.ProcessStarted,
                    time: now,
                    processName: runningProcess.getName()
                });
            }
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
                                    if (!firstStartTimes.has(name)) {
                                        return;
                                    }
                                    process.startTime = firstStartTimes.get(name).toString();
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