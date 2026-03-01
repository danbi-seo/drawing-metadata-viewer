import { metadata, normalizeDiscipline } from './parser'
import type { Drawing } from '../types/drawing'
import type { NormalizedDiscipline, NormalizedRevision } from '../data/parser'

export function getAllDrawings(): Drawing[] {
  return Object.values(metadata.drawings)
}

export function getDrawing(id: string): Drawing | undefined {
  return metadata.drawings[id]
}

export function getChildDrawings(parentId: string): Drawing[] {
  return Object.values(metadata.drawings).filter(
    drawing => drawing.parent === parentId
  )
}

export function getDisciplines(drawingId: string): NormalizedDiscipline[] {
  const drawing = getDrawing(drawingId)
  if (!drawing?.disciplines) return []

  return Object.entries(drawing.disciplines).map(([key, discipline]) =>
    normalizeDiscipline(key, discipline)
  )
}

/**
 * 정규화 연산 비용을 줄이기 위한 내부 캐시 객체
 * 'drawingId:disciplineKey' 조합을 키로 사용하여 중복 연산을 방지합니다.
 */

const disciplineCache = new Map<string, NormalizedDiscipline>()

/**
 * 특정 도면의 공종 정보를 조회합니다.
 * @description 내부적으로 normalizeDiscipline 결과를 캐싱하여 성능을 최적화합니다.
 * @param drawingId 도면 ID ('00'은 전체 배치도)
 * @param disciplineKey 공종 키 
 */

export function getDiscipline(drawingId: string, disciplineKey: string) {
  const cacheKey = `${drawingId}:${disciplineKey}`
  if (disciplineCache.has(cacheKey)) return disciplineCache.get(cacheKey)

  const drawing = getDrawing(drawingId)
  if (!drawing?.disciplines?.[disciplineKey]) return undefined

  const result = normalizeDiscipline(disciplineKey, drawing.disciplines[disciplineKey])
  disciplineCache.set(cacheKey, result)
  return result
}

/**
 * 특정 조건에 맞는 최신 리비전을 반환합니다.
 * @description Region 키가 제공되면 해당 구역 내의 최신본을, 없으면 공종 내 최신본을 찾습니다.
 * @returns 리비전이 없거나 데이터가 유효하지 않으면 undefined를 반환합니다.
 */

export function getLatestRevision(
  drawingId: string,
  disciplineKey: string,
  regionKey?: string
): NormalizedRevision | undefined {
  const discipline = getDiscipline(drawingId, disciplineKey)
  if (!discipline) return undefined

  if (regionKey && discipline.regions?.[regionKey]) {
    return discipline.regions[regionKey].revisions.find(r => r.isLatest)
  }

  return discipline.revisions.find(r => r.isLatest)
}

export function getAllRevisions(
  drawingId: string,
  disciplineKey: string,
  regionKey?: string
): NormalizedRevision[] {
  const discipline = getDiscipline(drawingId, disciplineKey)
  if (!discipline) return []

  if (regionKey && discipline.regions?.[regionKey]) {
    return discipline.regions[regionKey].revisions
  }

  return discipline.revisions
}

export function getProjectName(): string {
  return metadata.project.name
}

export function getAllDisciplineNames(): string[] {
  return metadata.disciplines.map(d => d.name)
}