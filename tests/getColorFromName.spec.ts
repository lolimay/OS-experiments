import { getColorFromName, randomString } from '../src/utils';

test('main', () => {
    for (let i=0; i<10; i++) {
        expect(getColorFromName(randomString(10)).length).toBe(7);
    }
});