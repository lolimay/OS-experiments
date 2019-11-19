import { EventType, IEvent } from '../definition';
import { store } from '../index';
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
            } else {
                const currentProcess = process.getName();
                events.push({
                    type: EventType.ProcessEnded,
                    msg: `process ${yellow(currentProcess)} ${red('ended')}`,
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
        })();

        if (processor.isFree() && !readyQueue.isEmpty()) {
            const runningProcess = readyQueue.dequeue();
            const estimatedRunTime = runningProcess.getEstimatedRunTime();
            const runTime = TIME_SLICE < estimatedRunTime ? TIME_SLICE : estimatedRunTime;

            processor.setRunningProcess(runningProcess);
            processor.setFinishTime(now + runTime);
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

        if (processor.isBusy()) {
            const runningProcess = processor.getRunningProcess();

            runningProcess.setEstimatedRunTime(runningProcess.getEstimatedRunTime() - 1);

            store.processes.forEach(process => {
                if (process.name === processor.getRunningProcess()?.getName()) {
                    process.servedTime = String(estimatedRunTimes.get(process.name) - processor.getRunningProcess().getEstimatedRunTime());
                }
            });
        }

        processStatus = `[ ${processor.getRunningProcess()?.getName() || ''.padEnd(10, ' ')} ]`;
        if (events.length > 0) {
            for (let { msg } of events) {
                print(`${formattedNow.padEnd(20, ' ')} ${msg}`);

                events.forEach(({ type, time, processName }) => {
                    store.processes.forEach(process => {
                        const { name, arrivedTime = undefined } = process;

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
                            process.turnAroundTime = (parseInt(process.finishTime) - parseInt(arrivedTime)).toString();
                        }
                    });
                });
            }
        }
        print(`${formattedNow} ${processStatus}`);
    });
}