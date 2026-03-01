import type { Metadata } from '../types/metadata'
import type { Discipline, Revision, Region, Polygon, ImageTransform } from '../types/drawing'
import rawMetadata from './metadata.json'

export interface NormalizedRevision {
  version: string
  image: string
  date: string
  description: string
  changes: string[]
  isLatest: boolean
  regionKey?: string
  imageTransform?: ImageTransform
  polygon?: Polygon
}

export interface NormalizedDiscipline {
  key: string
  image?: string
  hasRegions: boolean
  revisions: NormalizedRevision[]
  regions?: Record<string, {
    revisions: NormalizedRevision[]
  }>
  polygon?: Polygon
  imageTransform?: ImageTransform
}

/**
 * 리비전 배열을 날짜 순으로 정렬하고 마지막 요소를 '최신(isLatest)'으로 마킹합니다.
 * @note 원본 데이터의 정렬 상태가 보장되지 않으므로 파싱 시점에 반드시 정렬을 수행합니다.
 * @param revisions 정규화되지 않은 원본 리비전 배열
 */

function markLatest(revisions: Revision[]): NormalizedRevision[] {
  if (revisions.length === 0) return []

  const sorted = [...revisions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return sorted.map((rev, index) => ({
    version: rev.version,
    image: rev.image,
    date: rev.date,
    description: rev.description,
    changes: rev.changes,
    isLatest: index === sorted.length - 1,
    imageTransform: rev.imageTransform,
    polygon: rev.polygon,
  }))
}

/**
 * 공종(Discipline) 데이터를 정규화합니다.
 * @description 
 * 공종 하위에 구역(Region)이 있는 경우 : 각 구역별로 리비전을 정규화
 * 구역이 없는 경우 : 공종 직계 리비전을 정규화
 * @param key 공종의 고유 키
 * @param discipline 원본 공종 데이터
 */

export function normalizeDiscipline(
  key: string,
  discipline: Discipline
): NormalizedDiscipline {

  if (discipline.regions) {
    const regions: Record<string, { revisions: NormalizedRevision[] }> = {}

    Object.entries(discipline.regions).forEach(([regionKey, region]: [string, Region]) => {
      regions[regionKey] = {
        revisions: markLatest(region.revisions).map(rev => ({
          ...rev,
          regionKey,
        })),
      }
    })

    return {
      key,
      image: discipline.image,
      hasRegions: true,
      revisions: [],
      regions,
      polygon: discipline.polygon,
      imageTransform: discipline.imageTransform,
    }
  }

  return {
    key,
    image: discipline.image,
    hasRegions: false,
    revisions: markLatest(discipline.revisions),
    polygon: discipline.polygon,
    imageTransform: discipline.imageTransform,
  }
}

export function parseMetadata(): Metadata {
  return rawMetadata as unknown as Metadata
}

export const metadata = parseMetadata()