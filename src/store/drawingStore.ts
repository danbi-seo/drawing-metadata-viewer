import { create } from 'zustand'
import type { NormalizedRevision } from '../data/parser'

interface DrawingState {
  selectedDrawingId: string | null
  selectedDisciplineKey: string | null
  selectedRegionKey: string | null
  selectedRevision: NormalizedRevision | null
  overlayDisciplineKeys: string[]
  compareMode: boolean
  compareRevision: NormalizedRevision | null
}

interface DrawingActions {
  selectDrawing: (drawingId: string) => void
  selectDiscipline: (disciplineKey: string) => void
  selectRegion: (regionKey: string | null) => void
  selectRevision: (revision: NormalizedRevision) => void

  toggleOverlay: (disciplineKey: string) => void
  clearOverlays: () => void

  enterCompareMode: (revision: NormalizedRevision) => void
  exitCompareMode: () => void

  reset: () => void
}

const initialState: DrawingState = {
  selectedDrawingId: '00',
  selectedDisciplineKey: null,
  selectedRegionKey: null,
  selectedRevision: null,
  overlayDisciplineKeys: [],
  compareMode: false,
  compareRevision: null,
}

export const useDrawingStore = create<DrawingState & DrawingActions>((set) => ({
  ...initialState,

  /**
   * 도면(건물) 선택
   * @note 데이터 무결성을 위해 도면 변경 시 모든 하위 선택 상태(공종, 리비전, 오버레이 등)를 초기화합니다.
   */
  selectDrawing: (drawingId) =>
    set({
      selectedDrawingId: drawingId,
      selectedDisciplineKey: null,
      selectedRegionKey: null,
      selectedRevision: null,
      overlayDisciplineKeys: [],
      compareMode: false,
      compareRevision: null,
    }),

  /**
   * 공종 선택
   * @note 새로운 공종을 선택하면 기존의 리비전 선택과 오버레이 상태를 초기화하여 컨텍스트 충돌을 방지합니다.
   */
  selectDiscipline: (disciplineKey) =>
    set({
      selectedDisciplineKey: disciplineKey,
      selectedRegionKey: null,
      selectedRevision: null,
      overlayDisciplineKeys: [],
      compareMode: false,
      compareRevision: null,
    }),

  selectRegion: (regionKey) =>
    set({
      selectedRegionKey: regionKey,
      selectedRevision: null,
    }),

  selectRevision: (revision) =>
    set({ selectedRevision: revision }),

  /**
   * 오버레이 토글
   * @description 현재 메인 공종 외에 추가로 겹쳐볼 공종을 리스트에 추가하거나 제거합니다.
   */
  toggleOverlay: (disciplineKey) =>
    set((state) => ({
      overlayDisciplineKeys: state.overlayDisciplineKeys.includes(disciplineKey)
        ? state.overlayDisciplineKeys.filter((k) => k !== disciplineKey)
        : [...state.overlayDisciplineKeys, disciplineKey],
    })),

  clearOverlays: () => set({ overlayDisciplineKeys: [] }),

  // 비교 모드 : 메인 이미지 위에 다른 리비전을 반투명하게 얹는 상태
  enterCompareMode: (revision) =>
    set({ compareMode: true, compareRevision: revision }),

  exitCompareMode: () =>
    set({ compareMode: false, compareRevision: null }),

  reset: () => set(initialState),
}))