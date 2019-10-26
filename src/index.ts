import  * as dat from 'dat.gui';
import { FCFS } from './algorithms/FCFS';
import { PCB } from './PCB';
import './index.css';
import 'xterm/css/xterm.css';

var store = {
    fcfsControls: {
        clockSpeed: 1,
    },
};
const pcbs: Array<PCB> = [];

for (let i=0; i<5; i++) {
    pcbs.push(new PCB());
}

FCFS(...pcbs);

const gui = new dat.GUI();
gui.add(store.fcfsControls, 'clockSpeed', -5, 5);