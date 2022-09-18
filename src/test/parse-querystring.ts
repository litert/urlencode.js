/**
 *  Copyright 2022 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { QueryString } from '../lib';
import * as Assert from 'assert';

interface ITestSuite {

    note: string;

    input: string;

    output: Record<string, string | string[]>;

    opts: QueryString.IParserOptions;
}

const testSuites: ITestSuite[] = [
    {
        note: 'Empty string',
        input: '',
        output: {},
        opts: {}
    },
    {
        note: 'Simple text',
        input: 'a=123&b=Hello%20Mike',
        output: { a: '123', 'b': 'Hello Mike' },
        opts: {}
    },
    {
        note: 'Value with equal sign insides',
        input: 'a==&b=key=value',
        output: { a: '=', 'b': 'key=value' },
        opts: {}
    },
    {
        note: 'Empty value and key only item',
        input: 'a=&b&c=123&d=&e',
        output: { a: '', b: '', c: '123', d: '', e: '' },
        opts: {}
    },
    {
        note: 'Combination of Emoji and ASCII characters',
        input: 'letter=I%20%E2%9D%A4%20You',
        output: { letter: 'I ❤ You' },
        opts: {}
    },
    {
        note: 'Combination of Emoji and Chinese characters',
        input: 'letter=%E6%88%91%E2%9D%A4%E4%BD%A0&%E4%BF%A1=%E6%88%91%E2%9D%A4%E4%BD%A0',
        output: { letter: '我❤你', '信': '我❤你' },
        opts: {}
    },
    {
        note: 'To decode "+" as space',
        input: 'a+b=c+d',
        output: { 'a b': 'c d' },
        opts: { plusAsSpace: true }
    },
    {
        note: 'To keep "+" as "+" (Default behavior)',
        input: 'a+b=c+d',
        output: { 'a+b': 'c+d' },
        opts: { plusAsSpace: false }
    },
    {
        note: 'Remove leading/ending blank characters of both key and value (Default behavior)',
        input: '%20a%20=%20b%20',
        output: { 'a': 'b' },
        opts: { trim: true }
    },
    {
        note: 'Decode repeated simple keys as array (Default behavior)',
        input: 'a=1&a=b&a&a=&b=1&c=1&c=2',
        output: { a: ['1', 'b', '', ''], b: '1', c: ['1', '2'] },
        opts: {}
    },
    {
        note: 'Decode standalone array-like keys as array (Default behavior)',
        input: 'a%5B%5D=123&b[]=321',
        output: { 'a[]': ['123'], 'b[]': ['321'] },
        opts: {  }
    },
    {
        note: 'Decode standalone array-like keys as simple value',
        input: 'a%5B%5D=123&b[]=321',
        output: { 'a[]': '123', 'b[]': '321' },
        opts: { arrayLikeAsArrayAlways: false }
    },
    {
        note: 'Decode as array always',
        input: 'a%5B%5D=123&b=321&c=123&c=12333',
        output: { 'a[]': ['123'], 'b': ['321'], 'c': ['123', '12333'] },
        opts: { alwaysArray: true }
    },
    {
        note: 'Decode and trim key/value',
        input: 'a%5B%5D=123%20&b=%20321&c=123&c%20=12333',
        output: { 'a[]': ['123'], 'b': '321', 'c': ['123', '12333'] },
        opts: { trim: true }
    },
    {
        note: 'Decode and trim key/value',
        input: 'a%5B%5D=123%20&b=%20321&c=+123&c+%20=123+3%203',
        output: { 'a[]': ['123'], 'b': '321', 'c': ['123', '123 3 3'] },
        opts: { trim: true, plusAsSpace: true }
    },
];

describe('QueryString', function() {
    describe('parse', function() {

        for (const t of testSuites) {

            it([
                t.note,
                `Input:     '${t.input}'`,
                `Expected:  ${JSON.stringify(t.output)}`,
                `Options:   ${JSON.stringify(t.opts)}`,
            ].join('\n          '), function() {

                Assert.deepStrictEqual(QueryString.parse(t.input, t.opts), t.output);
            });
        }
    });
});
