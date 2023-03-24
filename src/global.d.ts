export {};

declare global {
  declare type Immutable<T> = T extends (infer U)[]
    ? ReadonlyArray<Immutable<U>>
    : T extends {}
    ? { readonly [P in keyof T]: Immutable<T[P]> }
    : T;

  declare type Mutable<T> = T extends {}
    ? { -readonly [P in keyof T]: Mutable<T[P]> }
    : T extends ReadonlyArray<infer U>
    ? Array<Mutable<U>>
    : T;
}
