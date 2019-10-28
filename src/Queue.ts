export class Queue<T> {
    private queue: Array<T>;

    constructor(items?: Array<T>) {
        this.queue = items ? items : [];
    }

    public enqueue(item: T): void {
        this.queue.push(item);
    }

    public dequeue(): T {
        return this.queue.shift();
    }

    public peek(): T {
        return this.queue.length ? this.queue[0] : null;
    }

    public isEmpty(): boolean {
        return this.queue.length ? false : true;
    }

    public getLength(): number {
        return this.queue.length;
    }

    public sort(sortFunc: (a, b) => number): Queue<T> {
        this.queue.sort(sortFunc);

        return this;
    }
}