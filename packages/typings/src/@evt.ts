export declare namespace Evt {
  export interface AttachOnlyEvt<T> {
    attach(cb: (data: T) => void): void;
    detach(cb: (data: T) => void): boolean;
  }
  export interface PostOnlyEvt<T> {
    post(data: T): void;
  }
  export interface Evt<T> extends AttachOnlyEvt<T>, PostOnlyEvt<T> {}
}
