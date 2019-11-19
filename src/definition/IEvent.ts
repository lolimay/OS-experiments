import { EventType } from './EventType';

export interface IEvent {
    type: EventType;
    time: number;
    processName: string;
    msg: string;
}