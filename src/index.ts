import  * as dat from 'dat.gui';
import { FCFS } from './algorithms/FCFS';
import { PCB } from './PCB';
import { print } from './utils';
import './index.css';
import 'xterm/css/xterm.css';

var store = {
    currentTime: 0,
    clockSpeed: 1,
    fcfsControls: {
    },
};

const gui = new dat.GUI();
gui.add(store, 'clockSpeed', 0.5, 10);

// Global Clock
const clockElement = document.querySelector('#clock');
setTimeout(function timer() {
    store.currentTime++;
    if (clockElement !== null && clockElement.innerHTML !== null) {
        clockElement.innerHTML = `当前时间: ${ store.currentTime.toString() }`;
    }
    setTimeout(timer, 1/store.clockSpeed * 1000)
}, 1/store.clockSpeed * 1000)

// PCFS
const pcbs: Array<PCB> = [];

for (let i=0; i<5; i++) {
    pcbs.push(new PCB());
}

FCFS(...pcbs);