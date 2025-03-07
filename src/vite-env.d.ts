/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_TEMPO?: string;
    readonly [key: string]: string | undefined;
  };
}
