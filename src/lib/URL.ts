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

import * as QueryString from './QueryString';

export interface IURL {

    /**
     * The protocol scheme of the URL, including the final ':', in lower case.
     */
    'protocol'?: string;

    /**
     * The full authentication portion of the URL.
     */
    'auth'?: string;

    /**
     * The username portion of the URL, for authentication.
     */
    'user'?: string;

    /**
     * The password portion of the URL, for authentication.
     */
    'pass'?: string;

    /**
     * The host portion of the URL, including the port if specified.
     */
    'host'?: string;

    /**
     * The hostname portion of the URL, without the port.
     */
    'hostname'?: string;

    /**
     * The port number portion of the URL.
     */
    'port'?: number;

    /**
     * The path portion of the URL, that comes after the host and before the query, including the initial '/'.
     */
    'pathname'?: string;

    /**
     * The path portion of the URL, including 'query string'.
     */
    'path'?: string;

    /**
     * The 'query string' portion of the URL, including the leading '?'.
     */
    'query'?: string;

    /**
     * The 'fragment identifier' portion of the URL, including the leading '#'.
     */
    'hash'?: string;
}

/**
 * Source:
 *
 * ```
 * /^
 *   (
 *     (?<protocol>\w+:)?
 *     [/]{2}
 *   )?
 *   (
 *     (
 *       (?<auth>
 *         (?<user>[^@:]+)
 *         (:(?<pass>[^@]+))?
 *       )
 *       [@]
 *     )?
 *     (?<host>
 *       (?<hostname>[-.\w]+)
 *       (:(?<port>\d{1,5}))?
 *     )
 *   )?
 *   (?<path>
 *     (?<pathname>[/][^?#]*)?
 *     (?<query>[?][^#]*)?
 *   )?
 *   (?<hash>#.*)?
 * $/
 * ```
 */
// eslint-disable-next-line max-len
const URL_REGEX = /^((?<protocol>\w+:)?[/]{2})?(((?<auth>(?<user>[^@:]+)(:(?<pass>[^@]+))?)[@])?(?<host>(?<hostname>[-.\w]+)(:(?<port>\d{1,5}))?))?(?<path>(?<pathname>[/][^?#]*)?(?<query>[?][^#]*)?)?(?<hash>#.*)?$/;

/**
 * Decode a URL into an object.
 *
 * > Notes: All parts of the URL are parsed as it shows in the input string, no URL decoding, excepting the protocol.
 *
 * @param url The URL string to be parsed, can not be an empty string.
 *
 * @throws SyntaxError if the URL is invalid.
 */
export function parse(url: string): IURL {

    const r = URL_REGEX.exec(url);

    if (r === null) {

        throw new SyntaxError(`Invalid URL: ${url}`);
    }
    if (!r.groups?.protocol && !r.groups?.host && !r.groups?.pathname && !r.groups?.query && !r.groups?.hash) {

        return {};
    }

    const ret: IURL = {};

    for (const k of [
        'protocol', 'auth', 'user', 'pass',
        'host', 'hostname', 'path', 'pathname',
        'query', 'hash'
    ] as const) {

        if (r.groups[k]) {

            ret[k] = r.groups[k];
        }
    }

    if (ret.host) {

        ret.path ??= '/';
        ret.pathname ??= '/';
    }

    if (ret.protocol) {

        ret.protocol = ret.protocol.toLowerCase();
    }

    if (r.groups.port) {

        ret.port = parseInt(r.groups.port, 10);

        if (!Number.isSafeInteger(ret.port) || ret.port < 0 || ret.port > 65535) {

            throw new SyntaxError('INVALID_URL: port is invalid');
        }
    }

    return ret;
}

export interface IURLBuildOptions  {

    /**
     * The protocol scheme of the URL, including the final ':', in lower case.
     */
    'protocol'?: string;

    /**
     * The username portion of the URL, for authentication.
     */
    'user'?: string;

    /**
     * The password portion of the URL, for authentication.
     */
    'pass'?: string;

    /**
     * The hostname portion of the URL, without the port.
     */
    'hostname'?: string;

    /**
     * The port number portion of the URL.
     */
    'port'?: number;

    /**
     * The path portion of the URL, that comes after the host and before the query, the leading '/' is optional.
     */
    'pathname'?: string;

    /**
     * The 'fragment identifier' portion of the URL, the leading '#' is optional.
     */
    'hash'?: string;

    /**
     * The query of the URL, can be a querystring-encoded string or an object of raw values.
     */
    'query'?: Record<string, string | number | boolean | null | undefined> | string;
}

/**
 * Construct a URL from an object.
 *
 * @param opts  The URL options, all fields except `query` should not be url-encoded.
 */
export function stringify(opts: IURLBuildOptions): string {

    const segs: string[] = [];

    if (opts.protocol) {

        if (!/^\w+:$/.test(opts.protocol)) {

            throw new SyntaxError(`INVALID_URL: protocol "${opts.protocol}" is invalid`);
        }

        segs.push(opts.protocol.toLowerCase());

        segs.push('//');
    }

    if (opts.hostname) {

        if (opts.user) {

            segs.push(encodeURIComponent(opts.user));

            if (opts.pass) {

                segs.push(':');
                segs.push(encodeURIComponent(opts.pass));
            }

            segs.push('@');
        }

        segs.push(opts.hostname);

        if (opts.port !== undefined) {

            if (opts.port < 0 || opts.port > 65535) {

                throw new SyntaxError(`INVALID_URL: port "${opts.port}" is invalid`);
            }

            segs.push(':');
            segs.push(opts.port.toString());
        }
    }

    if (opts.pathname) {

        if (!opts.pathname.startsWith('/')) {

            segs.push('/');
        }

        segs.push(encodeURI(opts.pathname));
    }

    if (opts.query) {

        if (typeof opts.query === 'string') {

            opts.query = opts.query.trim();

            if (!opts.query.startsWith('?')) {

                segs.push('?');
            }

            segs.push(opts.query);
        }
        else {

            if (Object.keys(opts.query).length) {

                segs.push('?');
                segs.push(QueryString.stringify(opts.query));
            }
        }
    }

    if (typeof opts.hash === 'string') {

        opts.hash = opts.hash.trim();

        if (!opts.hash.startsWith('#')) {

            segs.push('#');
        }

        segs.push(opts.hash);
    }

    if (!segs.length) {

        throw new Error('INVALID_URL: no valid segments');
    }

    return segs.join('');
}
