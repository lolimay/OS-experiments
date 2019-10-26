import { FCFS } from './algorithms/FCFS';
import { PCB } from './PCB';
import './index.css';
import 'xterm/css/xterm.css';

const pcbs: Array<PCB> = [];

for (let i=0; i<5; i++) {
    pcbs.push(new PCB());
}

FCFS(...pcbs);