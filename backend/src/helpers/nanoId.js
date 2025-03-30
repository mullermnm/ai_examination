import { customAlphabet } from 'nanoid';

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';

export default function generateId(length=7){
    const nanoid = customAlphabet(ALPHABET, length);
    return nanoid();
}
export const generateMembershipCode = function (length=7){
    const nanoid = customAlphabet(NUMBERS, length);
    return nanoid();
}
