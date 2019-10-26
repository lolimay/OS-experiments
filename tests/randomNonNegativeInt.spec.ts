import { randomNonNegativeInt } from '../src/utils/randomNonNegativeInt';

const REPEAT_TIMES = 10000;
const MAX_NUMBER = 100;

test('randomNonNegativeInt covers all numbers with the given maximum number', () => {
    const numbers = new Set();

    for (let i=0; i<REPEAT_TIMES; i++) {
        numbers.add(randomNonNegativeInt(MAX_NUMBER));
    }
    for (let i=-1000; i<0; i++) {
        expect(numbers.has(i)).toBe(false);
    }
    for (let i=0; i<=MAX_NUMBER; i++) {
        expect(numbers.has(i)).toBe(true);
    }
    for (let i=MAX_NUMBER+1; i<MAX_NUMBER+10000; i++) {
        expect(numbers.has(i)).toBe(false);
    }
});