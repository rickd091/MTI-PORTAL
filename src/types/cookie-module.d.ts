// This file provides type definitions for the 'cookie' module

declare module 'cookie' {
  export interface ParseOptions {
    decode?: (value: string) => string;
  }

  export interface SerializeOptions {
    domain?: string;
    encode?: (value: string) => string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | 'lax' | 'none' | 'strict';
    secure?: boolean;
  }

  export function parse(str: string, options?: ParseOptions): { [key: string]: string };
  export function serialize(name: string, value: string, options?: SerializeOptions): string;
}
