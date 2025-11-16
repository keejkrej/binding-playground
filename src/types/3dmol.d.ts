declare module '3dmol' {
  type SelectionSpec = Record<string, string | number | boolean>
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
