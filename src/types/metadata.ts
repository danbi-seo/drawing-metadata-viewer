import type { Drawing } from "./drawing"


export interface DisciplineMeta {
  name: string
}

export interface ProjectMeta {
  name: string
  unit: 'px' | string
}

export interface Metadata {
  project: ProjectMeta
  disciplines: DisciplineMeta[]
  drawings: Record<string, Drawing>
}