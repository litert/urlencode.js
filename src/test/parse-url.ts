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

    input: string;

    output: false | URL.IURL;
}

const testSuites: ITestSuite[] = [
    {
        note: 'Empty string',
        input: '',
        output: {},
    },
    {
        note: 'Root path only',
        input: '/',
        output: { pathname: '/', path: '/' },
    },
    {
        note: 'Full URL',
        input: 'HTTPS://username:password@example.com:1234/the/path/?query=string#fragment',
        output: {
            protocol: 'https:',
            auth: 'username:password',
            user: 'username',
            pass: 'password',
            host: 'example.com:1234',
            hostname: 'example.com',
            port: 1234,
            pathname: '/the/path/',
            path: '/the/path/?query=string',
            query: '?query=string',
            hash: '#fragment',
        },
    },
    {
        note: 'Full URL without password',
        input: 'HTTPS://username@example.com:1234/the/path/?query=string#fragment',
        output: {
            protocol: 'https:',
            auth: 'username',
            user: 'username',
            host: 'example.com:1234',
            hostname: 'example.com',
            port: 1234,
            pathname: '/the/path/',
            path: '/the/path/?query=string',
            query: '?query=string',
            hash: '#fragment',
        },
    },
    {
        note: 'Full URL without auth',
        input: 'HTTPS://example.com:1234/the/path/?query=string#fragment',
        output: {
            protocol: 'https:',
            host: 'example.com:1234',
            hostname: 'example.com',
            port: 1234,
            pathname: '/the/path/',
            path: '/the/path/?query=string',
            query: '?query=string',
            hash: '#fragment',
        },
    },
    {
        note: 'Full URL without auth and port',
        input: 'HTTPS://example.com/the/path/?query=string#fragment',
        output: {
            protocol: 'https:',
            host: 'example.com',
            hostname: 'example.com',
            pathname: '/the/path/',
            path: '/the/path/?query=string',
            query: '?query=string',
            hash: '#fragment',
        },
    },
    {
        note: 'Full URL without protocol',
        input: '//example.com/the/path/?query=string#fragment',
        output: {
            host: 'example.com',
            hostname: 'example.com',
            pathname: '/the/path/',
            path: '/the/path/?query=string',
            query: '?query=string',
            hash: '#fragment',
        },
    },
    {
        note: 'URL of only path and hash',
        input: '/the/path/?query=string#fragment',
        output: {
            pathname: '/the/path/',
            path: '/the/path/?query=string',
            query: '?query=string',
            hash: '#fragment',
        },
    },
    {
        note: 'URL of only hash',
        input: '#fragment',
        output: {
            hash: '#fragment',
        },
    },
    {
        note: 'URL of only query',
        input: '?aa=123#fragment',
        output: {
            hash: '#fragment',
            path: '?aa=123',
            query: '?aa=123',
        },
    },
    {
        note: 'URL without path, query and hash',
        input: 'ssh://hostname.com:1234',
        output: {
            protocol: 'ssh:',
            host: 'hostname.com:1234',
            hostname: 'hostname.com',
            port: 1234,
            path: '/',
            pathname: '/',
        },
    },
    {
        note: 'URL without query and hash',
        input: 'ssh://hostname.com:1234/123',
        output: {
            protocol: 'ssh:',
            host: 'hostname.com:1234',
            hostname: 'hostname.com',
            port: 1234,
            path: '/123',
            pathname: '/123',
        },
    },
    {
        note: 'URL with incorrect port',
        input: 'ssh://hostname.com:655372',
        output: false,
    },
    {
        note: 'URL with malformed port',
        input: 'ssh://hostname.com:aaaa',
        output: false,
    },
    {
        note: 'URL of hostname only',
        input: 'hostname.com',
        output: {
            host: 'hostname.com',
            hostname: 'hostname.com',
            path: '/',
            pathname: '/',
        },
    },
    {
        note: 'URL of host only',
        input: 'hostname.com:2333',
        output: {
            host: 'hostname.com:2333',
            hostname: 'hostname.com',
            port: 2333,
            path: '/',
            pathname: '/',
        },
    },
    {
        note: 'URL of host and username only',
        input: 'test@hostname.com:2333',
        output: {
            host: 'hostname.com:2333',
            hostname: 'hostname.com',
            port: 2333,
            auth: 'test',
            user: 'test',
            path: '/',
            pathname: '/',
        },
    },
    {
        note: 'URL of username only',
        input: 'test@',
        output: false,
    },
];

describe('URL', function() {
    describe('parse', function() {

        for (const t of testSuites) {

            if (t.output === false) {

                it([
                    t.note,
                    `Input:     '${t.input}'`,
                    `Expected:  Throws an exception`,
                ].join('\n          '), function() {

                    Assert.throws(function(): void {
                        URL.parse(t.input);
                    });
                });
            }
            else {

                it([
                    t.note,
                    `Input:     '${t.input}'`,
                    `Expected:  ${JSON.stringify(t.output)}`,
                ].join('\n          '), function() {

                    Assert.deepStrictEqual(URL.parse(t.input), t.output);
                });
            }
        }
    });
});
