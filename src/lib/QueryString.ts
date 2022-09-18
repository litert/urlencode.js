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

type ISimpleType = string | number | null | boolean;

export type IQueryInput = Record<string, ISimpleType | ISimpleType[]>;

/**
 * Encode an object into a query string.
 *
 * > Also works for `application/x-www-form-urlencoded` encoding.
 */
export function stringify(query: IQueryInput): string {

    return Object.entries(query)
        .map(([k, v]) => {
            if (Array.isArray(v)) {
                return v.map((i) => `${encodeURIComponent(k)}=${encodeURIComponent(`${i}`)}`).join('&');
            }
            return `${encodeURIComponent(k)}=${encodeURIComponent(`${v}`)}`;
        })
        .join('&');
}

export interface IParserOptions {

    /**
     * Decode '+' as ' '.
     *
     * @default true
     */
    plusAsSpace?: boolean;

    /**
     * Decode each field as an array.
     *
     * @default false
     */
    alwaysArray?: boolean;

    /**
     * Decode each field ending with `'[]'` as an array.
     *
     * @examples 'a[]=1' => { 'a[]': ['1'] }
     *
     * @default true
     */
    arrayLikeAsArrayAlways?: boolean;

    /**
     * Trim space of each field and value.
     *
     * @default false
     */
    trim?: boolean;
}

interface IURISegment {

    uri: string;

    isArrayLike: boolean;
}

function decodeQueryKey(uri: string, opts: IParserOptions): IURISegment {

    uri = decodeURIComponent(uri);

    if (opts.trim) {

        uri = uri.trim();
    }

    const isArrayLike = uri.endsWith('[]');

    return { uri, isArrayLike };
}

function decodeQueryValue(uri: string, opts: IParserOptions): string {

    uri = decodeURIComponent(uri);

    if (opts.trim) {

        uri = uri.trim();
    }

    return uri;
}

/**
 * Decode a querystring into an object.
 *
 * > Also works for `application/x-www-form-urlencoded` encoding.
 */
export function parse(query: string, opts: IParserOptions = {}): Record<string, string | string[]> {

    const ret: Record<string, string | string[]> = {};

    if (opts.plusAsSpace ?? true) {

        query = query.replace(/\+/g, '%20');
    }

    for (const i of query.split('&')) {

        if (!i.length) {

            continue;
        }

        const pos = i.indexOf('=');

        const { uri: key, isArrayLike } = decodeQueryKey(pos === -1 ? i : i.slice(0, pos), opts);

        const value = pos === -1 ? '' : decodeQueryValue(i.slice(pos + 1), opts);

        if (undefined === ret[key]) {

            if (opts.alwaysArray || (isArrayLike && (opts.arrayLikeAsArrayAlways ?? true))) {

                ret[key] = [value];
            }
            else {

                ret[key] = value;
            }
        }
        else if (Array.isArray(ret[key])) {

            (ret[key] as string[]).push(value);
        }
        else {

            ret[key] = [ret[key] as string, value];
        }
    }

    return ret;
}
