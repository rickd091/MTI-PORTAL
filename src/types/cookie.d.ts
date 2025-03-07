// Type definitions for cookie 0.5.0
// Project: https://github.com/jshttp/cookie
// Definitions by: Pine Mizune <https://github.com/pine>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'cookie' {
  /**
   * Parse a cookie header.
   *
   * Parse the given cookie header string into an object
   * The object has the various cookies as keys(names) => values
   */
  export function parse(str: string, options?: ParseOptions): { [key: string]: string };

  /**
   * Serialize a cookie name-value pair into a string suitable for
   * http headers. An optional options object specified cookie parameters.
   *
   * serialize('foo', 'bar', { httpOnly: true })
   *   => "foo=bar; httpOnly"
   */
  export function serialize(name: string, value: string, options?: SerializeOptions): string;

  export interface ParseOptions {
    /**
     * Specifies a function that will be used to decode a cookie's value.
     * Since the value of a cookie has a limited character set (and must be a simple string),
     * this function can be used to decode a previously-encoded cookie value into a JavaScript
     * string or other object.
     *
     * The default function is the global `decodeURIComponent`, which will decode any URL-encoded
     * sequences into their byte representations.
     *
     * @default decodeURIComponent
     */
    decode?: (value: string) => string;
  }

  export interface SerializeOptions {
    /**
     * Specifies the value for the Domain Set-Cookie attribute.
     * By default, no domain is set, and most clients will consider the cookie to apply to only
     * the current domain.
     */
    domain?: string;

    /**
     * Specifies a function that will be used to encode a cookie's value.
     * Since the value of a cookie has a limited character set (and must be a simple string),
     * this function can be used to encode a value into a string suited for a cookie's value.
     *
     * The default function is the global `encodeURIComponent`, which will encode a JavaScript
     * string into UTF-8 byte sequences and then URL-encode any that fall outside of the cookie
     * range.
     *
     * @default encodeURIComponent
     */
    encode?: (value: string) => string;

    /**
     * Specifies the `Date` object to be the value for the `Expires` `Set-Cookie` attribute.
     * By default, no expiration is set, and most clients will consider this a "non-persistent cookie"
     * and will delete it on a condition like exiting a web browser application.
     *
     * @note the cookie storage model specification states that if both `expires` and `maxAge` are set,
     * then `maxAge` takes precedence, but it is possible not all clients by obey this,
     * so if both are set, they should point to the same date and time.
     */
    expires?: Date;

    /**
     * Specifies the boolean value for the `HttpOnly` `Set-Cookie` attribute.
     * When truthy, the `HttpOnly` attribute is set, otherwise it is not.
     * By default, the `HttpOnly` attribute is not set.
     *
     * @note be careful when setting this to true, as compliant clients will not allow client-side
     * JavaScript to see the cookie in `document.cookie`.
     */
    httpOnly?: boolean;

    /**
     * Specifies the number (in seconds) to be the value for the `Max-Age` `Set-Cookie` attribute.
     * The given number will be converted to an integer by rounding down. By default, no maximum
     * age is set.
     *
     * @note the cookie storage model specification states that if both `expires` and `maxAge` are set,
     * then `maxAge` takes precedence, but it is possible not all clients by obey this,
     * so if both are set, they should point to the same date and time.
     */
    maxAge?: number;

    /**
     * Specifies the value for the `Path` `Set-Cookie` attribute.
     * By default, the path is considered the "default path".
     */
    path?: string;

    /**
     * Specifies the boolean or string to be the value for the `SameSite` `Set-Cookie` attribute.
     *
     * - `true` will set the `SameSite` attribute to `Strict` for strict same site enforcement.
     * - `false` will not set the `SameSite` attribute.
     * - `'lax'` will set the `SameSite` attribute to `Lax` for lax same site enforcement.
     * - `'none'` will set the `SameSite` attribute to `None` for an explicit cross-site cookie.
     * - `'strict'` will set the `SameSite` attribute to `Strict` for strict same site enforcement.
     *
     * More information about the different enforcement levels can be found in
     * [the specification](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1).
     *
     * @default false
     */
    sameSite?: boolean | 'lax' | 'none' | 'strict';

    /**
     * Specifies the boolean value for the `Secure` `Set-Cookie` attribute.
     * When truthy, the `Secure` attribute is set, otherwise it is not.
     * By default, the `Secure` attribute is not set.
     *
     * @note be careful when setting this to `false`, as compliant clients will send the cookie back to
     * the server even in the case of a HTTP request if the cookie was previously marked secure.
     */
    secure?: boolean;

    /**
     * Specifies whether the cookie should be signed.
     */
    signed?: boolean;
  }
}
