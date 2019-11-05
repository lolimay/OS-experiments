export interface IProcess {
    name: string;
    priorityNumber: number;
    arrivedTime: number;
    servedTime: number;
    startTime: number;
    finishTime: number;
    turnAroundTime: number;
}