/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_JAVA: string
  readonly VITE_API_GO: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
