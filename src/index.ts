import  * as dat from 'dat.gui';
import { DynamicPSA, FCFS, PSA, RR } from './algorithms';
import { AlgorithmType, IProcess } from './definition';
import { PCB } from './PCB';

import 'xterm/css/xterm.css';
import './App';
import './index.css';

export var store = {
    now: 0,
    clockSpeed: 1,
    fcfsControls: {
    },
    processes: [] as Array<IProcess>,
    algorithm: AlgorithmType.PSA 
};

declare global {
    interface Window { store: any; }
}
window.store = store;

const gui = new dat.GUI();
gui.add(store, 'clockSpeed', 0.5, 300);

// Global Clock
const clockElement = document.querySelector('#clock');
setTimeout(function timer() {
    const tickEvent = new CustomEvent('tick', { detail: { now: store.now }});
    
    window.dispatchEvent(tickEvent);
    if (clockElement !== null && clockElement.innerHTML !== null) {
        clockElement.innerHTML = `Current Time: ${ store.now.toString() }`;
    }
    setTimeout(timer, 1/store.clockSpeed * 1000);
    store.now++;
}, 1/store.clockSpeed * 1000);

const pcbs: Array<PCB> = [];

for (let i=0; i<5; i++) {
    const process = new PCB(0, 3);

    store.processes.push({
        name: process.getName(),
        priority: process.getPriorityNumber().toString(),
    } as IProcess);
    pcbs.push(process);
}

switch (store.algorithm) {
    case AlgorithmType.FCFS:
        FCFS(...pcbs);
        break;
    case AlgorithmType.DynamicPSA:
        DynamicPSA(...pcbs);
        break;
    case AlgorithmType.RR:
        RR(...pcbs);
        break;
    case AlgorithmType.PSA:
        PSA(...pcbs);
    default:
        break;
}