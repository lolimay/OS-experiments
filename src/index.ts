import  * as dat from 'dat.gui';
import { DynamicPSA, FCFS, PSA, RR } from './algorithms';
import { PCB } from './PCB';

import 'xterm/css/xterm.css';
import './index.css';

export var store = {
    now: 0,
    clockSpeed: 1,
    fcfsControls: {
    },
};

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
    pcbs.push(new PCB(0, 3));
}

// FCFS Algorithm
// FCFS(...pcbs);

// PSA Algorithm
// PSA(...pcbs);

// DynamicPSA(...pcbs);

RR(...pcbs);