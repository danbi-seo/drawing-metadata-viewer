import { useMemo } from 'react'
import { useDrawingStore } from '../store/drawingStore'
import { useViewStore } from '../store/viewStore'
import { getDiscipline, getDrawing } from '../data/selectors'
import type { ImageTransform } from '../types/drawing'

const DRAWINGS_PATH = '/drawings/'

export interface ImageLayer {
  key: string
  src: string
  transform: string
  opacity: number
  zIndex: number
  isMain: boolean
}

function buildCSSTransform(t: ImageTransform): string {
  const { x, y, scale, rotation } = t

  return `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`
}

const IDENTITY_TRANSFORM: ImageTransform = { x: 0, y: 0, scale: 1, rotation: 0 }

/**
 * 상대적 좌표 체계를 절대 좌표로 변환합니다.
 * @note 특정 리비전이 다른 리비전을 기준으로 위치가 설정된 경우, 
 * 해당 기준점의 Transform 값을 합산하여 최종 좌표를 도출합니다.
 */
function resolveTransform(
  transform: ImageTransform | undefined,
  allRevisionTransforms: Map<string, ImageTransform>
): ImageTransform {
  if (!transform) return IDENTITY_TRANSFORM

  if (transform.relativeTo) {
    const base = allRevisionTransforms.get(transform.relativeTo) ?? IDENTITY_TRANSFORM
    return {
      x: base.x + transform.x,
      y: base.y + transform.y,
      scale: base.scale * transform.scale,
      rotation: base.rotation + transform.rotation,
    }
  }

  return transform
}

export function useImageOverlay(): ImageLayer[] {
  const {
    selectedDrawingId,
    selectedDisciplineKey,
    selectedRevision,
    overlayDisciplineKeys,
    compareMode,
    compareRevision,
  } = useDrawingStore()

  const { overlayOpacity } = useViewStore()

  return useMemo(() => {
    if (!selectedDrawingId) return []

    const drawing = getDrawing(selectedDrawingId)
    if (!drawing) return []

    const layers: ImageLayer[] = []

    const discipline = selectedDisciplineKey
      ? getDiscipline(selectedDrawingId, selectedDisciplineKey)
      : null

    /** * 1. 메인 레이어 결정 
     * 우선순위: 선택된 리비전 > 선택된 공종 > 전체 도면
     */
    const mainImageSrc =
      selectedRevision?.image ??
      discipline?.image ??
      drawing.image

    if (mainImageSrc) {
      // relativeTo 계산을 위한 현재 공종 내 모든 리비전의 트랜스폼 맵
      const transformMap = new Map<string, ImageTransform>()
      if (discipline) {
        discipline.revisions.forEach(rev => {
          if (rev.image && rev.imageTransform) {
            transformMap.set(rev.image, rev.imageTransform)
          }
        })
      }

      const rawTransform = selectedRevision?.imageTransform
        ?? discipline?.imageTransform

      const resolvedTransform = resolveTransform(rawTransform, transformMap)

      layers.push({
        key: 'main',
        src: `${DRAWINGS_PATH}${mainImageSrc}`,
        transform: buildCSSTransform(resolvedTransform),
        opacity: 1,
        zIndex: 1, // 가장 아래쪽
        isMain: true,
      })
    }

    /** * 2. 공종 오버레이 레이어 
     * @description 선택된 메인 공종 위에 다른 공종들을 반투명하게 겹쳐서 비교합니다.
     */
    overlayDisciplineKeys.forEach((key, index) => {
      const overlayDiscipline = getDiscipline(selectedDrawingId, key)
      if (!overlayDiscipline) return

      const latestRev = overlayDiscipline.revisions.find(r => r.isLatest)
      const imageSrc = latestRev?.image ?? overlayDiscipline.image
      if (!imageSrc) return

      const rawTransform = latestRev?.imageTransform
        ?? overlayDiscipline.imageTransform
      const resolvedTransform = resolveTransform(rawTransform, new Map())

      layers.push({
        key: `overlay-${key}`,
        src: `${DRAWINGS_PATH}${imageSrc}`,
        transform: buildCSSTransform(resolvedTransform),
        opacity: overlayOpacity,
        zIndex: 2 + index, // 메인보다 위에 순차적으로 쌓임
        isMain: false,
      })
    })

    /** * 3. 리비전 비교 레이어 
     * @description 동일 공종 내 다른 버전을 겹쳐볼 때 사용하며, 가장 상단에 위치합니다.
     */
    if (compareMode && compareRevision?.image) {
      const rawTransform = compareRevision.imageTransform
      const resolvedTransform = resolveTransform(rawTransform, new Map())

      layers.push({
        key: `compare-${compareRevision.version}`,
        src: `${DRAWINGS_PATH}${compareRevision.image}`,
        transform: buildCSSTransform(resolvedTransform),
        opacity: 0.5,
        zIndex: 10, // 가장 상단에 고정
        isMain: false,
      })
    }

    return layers
  }, [
    selectedDrawingId,
    selectedDisciplineKey,
    selectedRevision,
    overlayDisciplineKeys,
    compareMode,
    compareRevision,
    overlayOpacity,
  ])
}
