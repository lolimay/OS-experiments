import { PCB } from '../PCB';
import { print } from '../utils';

/**
 * First-Come First-Serverd (FCFS) Algorithms
 */
export function FCFS(...pcbs: Array<PCB>): void {
    pcbs = pcbs.sort((a, b) => a.getArrivedTime() > b.getArrivedTime() ? 1 : -1);

    for (let i=0; i<pcbs.length; i++) {
        if (i === pcbs.length-1) {
            pcbs[i].setNext(null);
            break;
        }
        pcbs[i].setNext(pcbs[i+1]);
    }

    print(pcbs);
}