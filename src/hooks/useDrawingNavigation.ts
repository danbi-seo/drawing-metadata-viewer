import { useCallback } from 'react'
import { useDrawingStore } from '../store/drawingStore'
import { useViewStore } from '../store/viewStore'
import { getLatestRevision, getAllRevisions } from '../data/selectors'

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

  /**
   * 도면(건물) 단위 이동
   * @note 도면이 바뀌면 이전의 줌/팬 상태가 유효하지 않으므로 뷰를 반드시 초기화합니다.
   */
  const navigateToDrawing = useCallback((drawingId: string) => {
    selectDrawing(drawingId)
    resetView()
  }, [selectDrawing, resetView])

  /**
   * 공종 선택 및 최신 리비전 자동 연결
   * @note 사용자 편의를 위해 공종 선택 시 해당 공종의 최신본(Latest)을 자동으로 로드합니다.
   */
  const navigateToDiscipline = useCallback((disciplineKey: string) => {
    if (!selectedDrawingId) return

    selectDiscipline(disciplineKey)

    // 최신 리비전 자동 선택
    const latest = getLatestRevision(selectedDrawingId, disciplineKey)
    if (latest) selectRevision(latest)
  }, [selectedDrawingId, selectDiscipline, selectRevision])

  /**
   * Region 선택 및 리비전 갱신
   */
  const navigateToRegion = useCallback((regionKey: string | null) => {
    if (!selectedDrawingId || !selectedDisciplineKey) return

    selectRegion(regionKey)

    if (regionKey) {
      const latest = getLatestRevision(selectedDrawingId, selectedDisciplineKey, regionKey)
      if (latest) selectRevision(latest)
    }
  }, [selectedDrawingId, selectedDisciplineKey, selectRegion, selectRevision])

  /**
   * 이전/다음 리비전 탐색
   * @description 현재 필터링된 리비전 목록 내에서 순차적으로 이동합니다.
   */
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

  // UI 조작 및 버튼 활성 상태 판단
  const isAtRoot = selectedDrawingId === '00' || !selectedDrawingId
  const hasDiscipline = !!selectedDisciplineKey
  const hasRevision = !!selectedRevision

  /**
   * 리비전 이동 가능 여부 판단
   */
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