import { QueryString, URL } from '../lib';

const test = {
    'a': [1, 2, 3, 4],
    'a[]': [1, 2, 3, 4],
    'b': false,
    'c': 'hello',
    'd': '哈哈哈哈',
    'e': '😀😀😀😀',
    'f': null
} as any;

const qs = QueryString.stringify(test);
const origin = QueryString.parse(qs);

console.log(qs);
console.log(origin);

console.log(JSON.stringify(
    URL.parse('vmess://ew0KICAidiI6ICIyIiwNCiAgInBzIjogIvCfh6/wn4e15LioQUxC5LioTmVrby3lub/lt55CR1AtVjEiLA0KICAiYWRkIjogIjM2LjEzOS45LjE5MSIsDQogICJwb3J0IjogIjI1MjgwIiwNCiAgImlkIjogIjM5OGU2NDgxLTRkZDYtNDFlZi1hNjMwLWQwYTYxNTEzNzExNSIsDQogICJhaWQiOiAiMCIsDQogICJzY3kiOiAiYXV0byIsDQogICJzbmkiOiAidmlwZG93bi5taWt1Lm5ld3MiLA0KICAibmV0IjogIndzIiwNCiAgInR5cGUiOiAibm9uZSIsDQogICJ0bHMiOiAidGxzIiwNCiAgImhvc3QiOiAidmlwZG93bi5taWt1Lm5ld3MiLA0KICAicGF0aCI6ICIvZW50ZXJ2MnJheSIsDQogICJhbHBuIjogIiINCn0='),
    null,
    2
));

console.log(JSON.stringify(
    URL.parse('otpauth://totp/Example4TOTP?secret=B4PSUNCFJMQCUEBGEEFSYCTD&algorithm=SHA1&digits=6&period=30'),
    null,
    2
));
