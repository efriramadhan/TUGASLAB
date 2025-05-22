declare module 'text-encoding' {
  export class TextEncoder {
    constructor(encoding?: string);
    encode(input?: string): Uint8Array;
  }

  export class TextDecoder {
    constructor(encoding?: string, options?: { fatal?: boolean });
    decode(input?: Uint8Array | ArrayBuffer): string;
  }
}

declare module 'base-64' {
  export function encode(str: string): string;
  export function decode(str: string): string;
}

declare module 'web-streams-polyfill/dist/ponyfill.es6.js' {
  export class ReadableStream<T = any> {
    constructor(underlyingSource?: UnderlyingSource<T>, strategy?: QueuingStrategy<T>);
    getReader(): ReadableStreamDefaultReader<T>;
  }

  export class WritableStream<T = any> {
    constructor(underlyingSink?: UnderlyingSink<T>, strategy?: QueuingStrategy<T>);
    getWriter(): WritableStreamDefaultWriter<T>;
  }

  export class TransformStream<I = any, O = any> {
    constructor(transformer?: Transformer<I, O>, writableStrategy?: QueuingStrategy<I>, readableStrategy?: QueuingStrategy<O>);
    readonly readable: ReadableStream<O>;
    readonly writable: WritableStream<I>;
  }

  export interface ReadableStreamDefaultReader<T = any> {
    readonly closed: Promise<void>;
    cancel(reason?: any): Promise<void>;
    read(): Promise<ReadableStreamReadResult<T>>;
    releaseLock(): void;
  }

  export interface ReadableStreamReadResult<T> {
    done: boolean;
    value: T | undefined;
  }

  export interface WritableStreamDefaultWriter<T = any> {
    readonly closed: Promise<void>;
    readonly desiredSize: number | null;
    readonly ready: Promise<void>;
    abort(reason?: any): Promise<void>;
    close(): Promise<void>;
    releaseLock(): void;
    write(chunk: T): Promise<void>;
  }

  export interface UnderlyingSource<T = any> {
    start?(controller: ReadableStreamController<T>): void | Promise<void>;
    pull?(controller: ReadableStreamController<T>): void | Promise<void>;
    cancel?(reason?: any): void | Promise<void>;
    type?: string;
  }

  export interface UnderlyingSink<T = any> {
    start?(controller: WritableStreamDefaultController): void | Promise<void>;
    write?(chunk: T, controller: WritableStreamDefaultController): void | Promise<void>;
    close?(controller: WritableStreamDefaultController): void | Promise<void>;
    abort?(reason?: any): void | Promise<void>;
  }

  export interface ReadableStreamController<T = any> {
    close(): void;
    enqueue(chunk: T): void;
    error(error?: any): void;
    desiredSize?: number | null;
  }

  export interface WritableStreamDefaultController {
    error(error?: any): void;
  }

  export interface QueuingStrategy<T = any> {
    highWaterMark?: number;
    size?(chunk: T): number;
  }

  export interface Transformer<I = any, O = any> {
    start?(controller: TransformStreamDefaultController<O>): void | Promise<void>;
    transform?(chunk: I, controller: TransformStreamDefaultController<O>): void | Promise<void>;
    flush?(controller: TransformStreamDefaultController<O>): void | Promise<void>;
  }

  export interface TransformStreamDefaultController<O = any> {
    enqueue(chunk: O): void;
    error(reason?: any): void;
    terminate(): void;
  }
}