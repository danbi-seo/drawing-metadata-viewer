import { useMemo } from 'react'
import { useDrawingStore } from '../store/drawingStore'
import { getDrawing, getDiscipline, getChildDrawings, getDisciplines } from '../data/selectors'
import type { Polygon, PolygonTransform } from '../types/drawing'

export const DISCIPLINE_POLYGON_COLORS: Record<string, { fill: string; stroke: string }> = {
  건축: { fill: 'rgba(96,165,250,0.15)', stroke: 'rgba(96,165,250,0.7)' },
  구조: { fill: 'rgba(251,146,60,0.15)', stroke: 'rgba(251,146,60,0.7)' },
  공조설비: { fill: 'rgba(34,211,238,0.15)', stroke: 'rgba(34,211,238,0.7)' },
  배관설비: { fill: 'rgba(192,132,252,0.15)', stroke: 'rgba(192,132,252,0.7)' },
  설비: { fill: 'rgba(45,212,191,0.15)', stroke: 'rgba(45,212,191,0.7)' },
  소방: { fill: 'rgba(248,113,113,0.15)', stroke: 'rgba(248,113,113,0.7)' },
  조경: { fill: 'rgba(74,222,128,0.15)', stroke: 'rgba(74,222,128,0.7)' },
}

export const DEFAULT_POLYGON_COLOR = {
  fill: 'rgba(124,58,237,0.15)',
  stroke: 'rgba(124,58,237,0.7)',
}

export interface PolygonLayer {
  id: string
  polygon: Polygon
  color: { fill: string; stroke: string }
  label?: string
  navigateTo?: string
}

/** * 폴리곤 좌표에 변환(Scale, Rotation)을 적용합니다.
 * @logic 
 * 1. 각 정점에 Scale을 곱합니다.
 * 2. 원점을 기준으로 Rotation Matrix수식을 적용하여 좌표를 회전시킵니다.
 */
export function applyPolygonTransform(
  vertices: [number, number][],
  t: PolygonTransform
): [number, number][] {
  const rad = (t.rotation * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  return vertices.map(([x, y]) => {
    const sx = x * t.scale
    const sy = y * t.scale
    const rx = sx * cos - sy * sin
    const ry = sx * sin + sy * cos
    return [rx, ry] as [number, number]
  })
}

export function verticesToPoints(vertices: [number, number][]): string {
  return vertices.map(([x, y]) => `${x},${y}`).join(' ')
}

/** 
 * 다각형의 무게중심을 계산하여 라벨 표시 위치를 결정합니다.
 * */
export function calcCentroid(vertices: [number, number][]): { cx: number; cy: number } {
  const cx = vertices.reduce((s, [x]) => s + x, 0) / vertices.length
  const cy = vertices.reduce((s, [, y]) => s + y, 0) / vertices.length
  return { cx, cy }
}

/**
 * 현재 선택된 도면 상태에 따라 렌더링할 폴리곤 레이어 목록을 생성합니다.
 * @logic [전체 배치도(건물영역)] -> [건물(공종영역)] -> [공종(구역/리비전영역)] 순으로 계산합니다.
 */
export function usePolygonLayers(): PolygonLayer[] {
  const { selectedDrawingId, selectedDisciplineKey, selectedRevision } = useDrawingStore()

  return useMemo(() => {
    if (!selectedDrawingId) return []

    const drawing = getDrawing(selectedDrawingId)
    if (!drawing) return []
    {/* CASE 1 : 전체 배치도 - 각 건물을 클릭하여 진입할 수 있는 영역을 표시 */ }
    const discipline = selectedDisciplineKey
      ? getDiscipline(selectedDrawingId, selectedDisciplineKey)
      : null

    if (selectedDrawingId === '00') {
      return getChildDrawings('00')
        .filter(child => child.position?.vertices)
        .map(child => ({
          id: child.id,
          polygon: {
            vertices: child.position!.vertices,
            polygonTransform: { x: 0, y: 0, scale: 1, rotation: 0 },
          },
          color: DEFAULT_POLYGON_COLOR,
          label: child.name
            .replace(' 지상1층 평면도', '')
            .replace(' 확대 평면도', ''),
          navigateTo: child.id,
        }))
    }
    {/* CASE 2 : 건물 진입 후 공종 미선택 - 해당 건물 내 존재하는 공종별 영역들을 표시 */ }
    if (!selectedDisciplineKey) {
      return getDisciplines(selectedDrawingId)
        .filter(disc => disc.polygon?.vertices)
        .map(disc => ({
          id: `discipline-${disc.key}`,
          polygon: disc.polygon!,
          color: DISCIPLINE_POLYGON_COLORS[disc.key] ?? DEFAULT_POLYGON_COLOR,
          label: disc.key,
        }))
    }
    {/* CASE 3 : 특정 공종 내 구역(Region)이 존재하는 경우 - 구역별 세부 영역을 표시 */ }
    if (discipline?.hasRegions && discipline.regions) {
      const color = DISCIPLINE_POLYGON_COLORS[selectedDisciplineKey] ?? DEFAULT_POLYGON_COLOR
      return Object.entries(discipline.regions)
        .filter(([, region]) => (region as any).polygon?.vertices)
        .map(([regionKey, region]) => ({
          id: `region-${regionKey}`,
          polygon: (region as any).polygon,
          color,
          label: `${selectedDisciplineKey} ${regionKey}`,
        }))
    }

    {/* CASE 4 : 일반 리비전/공종 - 선택된 특정 리비전의 폴리곤을 최종적으로 표시 */ }
    const polygon = selectedRevision?.polygon ?? discipline?.polygon
    if (!polygon?.vertices) return []

    return [{
      id: 'revision-polygon',
      polygon,
      color: DISCIPLINE_POLYGON_COLORS[selectedDisciplineKey] ?? DEFAULT_POLYGON_COLOR,
      label: selectedDisciplineKey,
    }]
  }, [selectedDrawingId, selectedDisciplineKey, selectedRevision])
}