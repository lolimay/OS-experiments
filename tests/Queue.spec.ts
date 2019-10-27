import { Queue } from '../src/Queue';


test('isEmpty', () => {
    const queue1 = new Queue();
    const queue2 = new Queue([1, 2, 3]);

    expect(queue1.isEmpty()).toBe(true);
    expect(queue2.isEmpty()).toBe(false);
});

test('isEmpty', () => {
    const queue = new Queue([1, 2, 3]);

    expect(queue.getLength()).toBe(3);
});

test('peek', () => {
    const queue1 = new Queue();
    const queue2 = new Queue([1, 2, 3]);

    expect(queue1.peek()).toBe(null);
    expect(queue2.peek()).toBe(1);
});

test('enqueue', () => {
    const queue = new Queue();

    expect(queue.getLength()).toBe(0);
    queue.enqueue('item');
    expect(queue.getLength()).toBe(1);
});

test('dequeue', () => {
    const queue = new Queue([1, 2, 3]);

    expect(queue.getLength()).toBe(3);
    expect(queue.dequeue()).toBe(1);
    expect(queue.getLength()).toBe(2);
});