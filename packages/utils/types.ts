import { App } from 'vue'

export type HelloType = {
  count:number,
  msg:string,
}

// Single File Component
export type SFCWithInstall<T> = T & { install(app: App): void; }
