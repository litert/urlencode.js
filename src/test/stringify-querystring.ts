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

    input: QueryString.IQueryInput;

    output: false | string;
}

const testSuites: ITestSuite[] = [
    {
        note: 'Empty input',
        input: {},
        output: '',
    },
    {
        note: 'Simple key-value pair',
        input: {
            a: 'b',
            b: 123,
            c: true,
            d: false,
            e: null,
            f: undefined,
            g: 1.1
        },
        output: 'a=b&b=123&c=true&d=false&e=null&f=undefined&g=1.1',
    },
    {
        note: 'Array value',
        input: {
            a: ['b', 123, true, false, null, undefined, 1.1],
        },
        output: 'a=b&a=123&a=true&a=false&a=null&a=undefined&a=1.1',
    },
    {
        note: 'Array-like value',
        input: {
            'a[]': 123,
            'b[]': [123, 321],
        },
        output: 'a%5B%5D=123&b%5B%5D=123&b%5B%5D=321',
    },
    {
        note: 'escape required',
        input: {
            a: 'b c',
            b: 'b+c',
            c: 'b&c',
            d: 'b=c',
            e: 'b?c',
            f: 'b#d',
            g: 'b/c',
            h: 'b\\c',
            i: 'b%c',
            j: 'b\'c',
            k: 'b"c',
            l: 'b`c',
            m: 'b~c',
            n: '你好',
            o: 'I❤️U',
        },
        output: 'a=b%20c&b=b%2Bc&c=b%26c&d=b%3Dc&e=b%3Fc&f=b%23d&g=b%2Fc&h=b%5Cc&i=b%25c&j=b\'c&k=b%22c&l=b%60c&m=b~c&n=%E4%BD%A0%E5%A5%BD&o=I%E2%9D%A4%EF%B8%8FU',
    },

];

describe('QueryString', function() {
    describe('stringify', function() {

        for (const t of testSuites) {

            if (t.output === false) {

                it([
                    t.note,
                    `Input:     ${JSON.stringify(t.input)}`,
                    `Expected:  Throws an exception`,
                ].join('\n          '), function() {

                    Assert.throws(function(): void {
                        QueryString.stringify(t.input);
                    });
                });
            }
            else {

                it([
                    t.note,
                    `Input:     ${JSON.stringify(t.input)}`,
                    `Expected:  '${t.output}'`,
                ].join('\n          '), function() {

                    Assert.deepStrictEqual(QueryString.stringify(t.input), t.output);
                });
            }
        }
    });
});
