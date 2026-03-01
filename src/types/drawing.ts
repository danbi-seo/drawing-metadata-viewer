export interface ImageTransform {
  relativeTo?: string
  x: number
  y: number
  scale: number
  rotation: number
}

export interface PolygonTransform {
  x: number
  y: number
  scale: number
  rotation: number
}

export interface Polygon {
  vertices: [number, number][]
  polygonTransform: PolygonTransform
}

export interface Revision {
  version: string
  image: string
  date: string
  description: string
  changes: string[]
  imageTransform?: ImageTransform
  polygon?: Polygon
}

export interface Region {
  polygon: Polygon
  revisions: Revision[]
}

export interface Discipline {
  image?: string
  imageTransform?: ImageTransform
  polygon?: Polygon
  regions?: Record<string, Region>
  revisions: Revision[]
}

export interface Position {
  vertices: [number, number][]
  imageTransform: ImageTransform
}

export interface Drawing {
  id: string
  name: string
  image: string
  parent: string | null
  position: Position | null
  disciplines?: Record<string, Discipline>
}