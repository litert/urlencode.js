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

import { URL } from '../lib';
import * as Assert from 'assert';

interface ITestSuite {

    note: string;

    input: URL.IURLBuildOptions;

    output: false | string;
}

const testSuites: ITestSuite[] = [
    {
        note: 'Empty input',
        input: {},
        output: false,
    },
    {
        note: 'Host only',
        input: {
            hostname: 'example.com',
        },
        output: 'example.com',
    },
    {
        note: 'host and protocol',
        input: {
            hostname: 'example.com',
            protocol: 'https:'
        },
        output: 'https://example.com',
    },
    {
        note: 'host+invalid protocol',
        input: {
            hostname: 'example.com',
            protocol: 'https'
        },
        output: false,
    },
    {
        note: 'host+username',
        input: {
            hostname: 'example.com',
            user: 'admin+s'
        },
        output: 'admin%2Bs@example.com',
    },
    {
        note: 'host+username+password',
        input: {
            hostname: 'example.com',
            user: 'admin+s',
            pass: '!Y#$%TFC!@$D@$DR@#'
        },
        output: 'admin%2Bs:!Y%23%24%25TFC!%40%24D%40%24DR%40%23@example.com',
    },
    {
        note: 'host+password(ignored)',
        input: {
            hostname: 'example.com',
            pass: '!Y#$%TFC!@$D@$DR@#'
        },
        output: 'example.com',
    },
    {
        note: 'host+protocol+port',
        input: {
            hostname: 'example.com',
            protocol: 'https:',
            port: 1234,
        },
        output: 'https://example.com:1234',
    },
    {
        note: 'host+protocol+incorrect_port',
        input: {
            hostname: 'example.com',
            protocol: 'https:',
            port: 123422,
        },
        output: false,
    },
    {
        note: 'protocol+path',
        input: {
            protocol: 'vmess:',
            pathname: '/the/path/',
        },
        output: 'vmess:///the/path/',
    },
    {
        note: 'base+string-query',
        input: {
            protocol: 'https:',
            hostname: 'example.com',
            pathname: '/the/path/',
            query: 'query=string',
        },
        output: 'https://example.com/the/path/?query=string',
    },
    {
        note: 'base+string-query-with-question-mark',
        input: {
            protocol: 'https:',
            hostname: 'example.com',
            pathname: '/the/path/',
            query: '?query=string',
        },
        output: 'https://example.com/the/path/?query=string',
    },
    {
        note: 'base+dict-query',
        input: {
            protocol: 'https:',
            hostname: 'example.com',
            pathname: '/the/path/',
            query: { a: 'b', c: 'a b', t: 1234 },
        },
        output: 'https://example.com/the/path/?a=b&c=a%20b&t=1234',
    },
    {
        note: 'base+dict-query',
        input: {
            protocol: 'https:',
            hostname: 'example.com',
            pathname: '/the/path/',
            query: { a: 'b', t: 1234 },
        },
        output: 'https://example.com/the/path/?a=b&t=1234',
    },
    {
        note: 'base+hash',
        input: {
            protocol: 'https:',
            hostname: 'example.com',
            pathname: '/the/path/',
            hash: 'a=b',
        },
        output: 'https://example.com/the/path/#a=b',
    },
    {
        note: 'base+hash-with-mark',
        input: {
            protocol: 'https:',
            hostname: 'example.com',
            pathname: '/the/path/',
            hash: '#a=b',
        },
        output: 'https://example.com/the/path/#a=b',
    },
    {
        note: 'base without path',
        input: {
            protocol: 'https:',
            hostname: 'example.com',
            hash: '#a=b',
        },
        output: 'https://example.com#a=b',
    },
];

describe('URL', function() {
    describe('stringify', function() {

        for (const t of testSuites) {

            if (t.output === false) {

                it([
                    t.note,
                    `Input:     ${JSON.stringify(t.input)}`,
                    `Expected:  Throws an exception`,
                ].join('\n          '), function() {

                    Assert.throws(function(): void {
                        URL.stringify(t.input);
                    });
                });
            }
            else {

                it([
                    t.note,
                    `Input:     ${JSON.stringify(t.input)}`,
                    `Expected:  '${t.output}'`,
                ].join('\n          '), function() {

                    Assert.deepStrictEqual(URL.stringify(t.input), t.output);
                });
            }
        }
    });
});
