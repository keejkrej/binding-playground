declare module '3dmol' {
  export type SelectionValue = string | number | boolean | string[] | number[]
  export type SelectionSpec = Record<string, SelectionValue>
  type StyleSpec = Record<string, unknown>

  interface ViewerConfig {
    backgroundColor?: string
    antialias?: boolean
  }

  interface SurfaceSpec {
    opacity?: number
    color?: string
    [key: string]: unknown
  }

  export class GLViewer {
    constructor(element: Element, config?: ViewerConfig)
    addModel(data: string, format: string): void
    setStyle(selection: SelectionSpec, style: StyleSpec): void
    addSurface(type: number, style: SurfaceSpec, selection?: SelectionSpec): void
    zoomTo(selection?: SelectionSpec): void
    render(): void
    clear(): void
  }

  export const SurfaceType: Record<string, number>
}
