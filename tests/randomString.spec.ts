import { randomString } from '../src/utils/randomString';

const REPEAT_TIMES = 100;
const EXPECTED_LENGTH = 80;

test('Generated random string\'s length shoube be equal to the one specified', () => {
    for (let i=0; i<REPEAT_TIMES; i++) {
        expect(randomString(EXPECTED_LENGTH).length === EXPECTED_LENGTH);
    }
});

test('Only letters and numbers should appear', () => {
    const validChars: Array<string> = [];

    for (let code=48; code<=122; code++) {
        if (code <= 57 || (code>=65 && code<=90) || code >= 97) {
            validChars.push(String.fromCharCode(code));
        }
    }

    for (let i=0; i<REPEAT_TIMES; i++) {
        randomString(EXPECTED_LENGTH).split('').forEach(char => {
            expect(validChars.includes(char));
        })
    }
});