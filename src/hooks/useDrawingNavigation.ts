import { useCallback } from 'react'
import { useDrawingStore } from '../store/drawingStore'
import { useViewStore } from '../store/viewStore'
import { getLatestRevision, getAllRevisions } from '../data/selectors'

/**
 * 도면 탐색 및 상태 변경을 위한 통합 내비게이션 인터페이스입니다.
 * @description 
 * 도면/공종/리비전 선택 시 필요한 비즈니스 로직을 통합 처리합니다.
 */
export function useDrawingNavigation() {
  const {
    selectedDrawingId,
    selectedDisciplineKey,
    selectedRegionKey,
    selectedRevision,
    selectDrawing,
    selectDiscipline,
    selectRegion,
    selectRevision,
  } = useDrawingStore()

  const { resetView } = useViewStore()

  {/* 1. 도면 이동: 도면이 변경되면 캔버스의 확대/위치 값을 초기화 */ }
  const navigateToDrawing = useCallback((drawingId: string) => {
    selectDrawing(drawingId)
    resetView()
  }, [selectDrawing, resetView])
  {/* 2. 공종 이동: 공종 선택 시 해당 공종의 가장 최신 리비전을 자동으로 로드 */ }
  const navigateToDiscipline = useCallback((disciplineKey: string) => {
    if (!selectedDrawingId) return

    selectDiscipline(disciplineKey)

    // 최신 리비전 자동 선택
    const latest = getLatestRevision(selectedDrawingId, disciplineKey)
    if (latest) selectRevision(latest)
  }, [selectedDrawingId, selectDiscipline, selectRevision])

  {/* 3. 리전(구역) 이동: 특정 구역 선택 시 해당 구역 내 최신 리비전을 자동 로드 */ }
  const navigateToRegion = useCallback((regionKey: string | null) => {
    if (!selectedDrawingId || !selectedDisciplineKey) return

    selectRegion(regionKey)

    if (regionKey) {
      const latest = getLatestRevision(selectedDrawingId, selectedDisciplineKey, regionKey)
      if (latest) selectRevision(latest)
    }
  }, [selectedDrawingId, selectedDisciplineKey, selectRegion, selectRevision])

  {/* 4. 리비전 이전/다음 탐색: 타임라인 순서에 따라 리비전을 순차적으로 이동 */ }
  const navigateToPrevRevision = useCallback(() => {
    if (!selectedDrawingId || !selectedDisciplineKey || !selectedRevision) return

    const revisions = getAllRevisions(
      selectedDrawingId,
      selectedDisciplineKey,
      selectedRegionKey ?? undefined
    )
    const currentIndex = revisions.findIndex(r => r.version === selectedRevision.version)
    if (currentIndex > 0) {
      selectRevision(revisions[currentIndex - 1])
    }
  }, [selectedDrawingId, selectedDisciplineKey, selectedRegionKey, selectedRevision, selectRevision])

  const navigateToNextRevision = useCallback(() => {
    if (!selectedDrawingId || !selectedDisciplineKey || !selectedRevision) return

    const revisions = getAllRevisions(
      selectedDrawingId,
      selectedDisciplineKey,
      selectedRegionKey ?? undefined
    )
    const currentIndex = revisions.findIndex(r => r.version === selectedRevision.version)
    if (currentIndex < revisions.length - 1) {
      selectRevision(revisions[currentIndex + 1])
    }
  }, [selectedDrawingId, selectedDisciplineKey, selectedRegionKey, selectedRevision, selectRevision])

  // 탐색 가능 상태
  const isAtRoot = selectedDrawingId === '00' || !selectedDrawingId
  const hasDiscipline = !!selectedDisciplineKey
  const hasRevision = !!selectedRevision

  const canGoPrev = (() => {
    if (!selectedDrawingId || !selectedDisciplineKey || !selectedRevision) return false
    const revisions = getAllRevisions(
      selectedDrawingId,
      selectedDisciplineKey,
      selectedRegionKey ?? undefined
    )
    const idx = revisions.findIndex(r => r.version === selectedRevision.version)
    return idx > 0
  })()

  // 현재 리비전 리스트 내에서의 위치를 계산하여 이전/다음 버튼 활성화 여부를 결정
  const canGoNext = (() => {
    if (!selectedDrawingId || !selectedDisciplineKey || !selectedRevision) return false
    const revisions = getAllRevisions(
      selectedDrawingId,
      selectedDisciplineKey,
      selectedRegionKey ?? undefined
    )
    const idx = revisions.findIndex(r => r.version === selectedRevision.version)
    return idx < revisions.length - 1
  })()

  return {
    // 현재 상태
    selectedDrawingId,
    selectedDisciplineKey,
    selectedRegionKey,
    selectedRevision,
    isAtRoot,
    hasDiscipline,
    hasRevision,
    canGoPrev,
    canGoNext,

    // 탐색 액션
    navigateToDrawing,
    navigateToDiscipline,
    navigateToRegion,
    navigateToPrevRevision,
    navigateToNextRevision,
  }
}