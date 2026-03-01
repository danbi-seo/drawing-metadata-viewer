import { create } from 'zustand'

interface ViewState {
  scale: number
  offsetX: number
  offsetY: number
  showPolygon: boolean
  sidebarOpen: boolean
  revisionPanelOpen: boolean
  overlayOpacity: number
}

interface ViewActions {
  setScale: (scale: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  setOffset: (x: number, y: number) => void
  resetOffset: () => void
  resetView: () => void

  togglePolygon: () => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleRevisionPanel: () => void
  setRevisionPanelOpen: (open: boolean) => void

  setOverlayOpacity: (opacity: number) => void
}

const MIN_SCALE = 0.2
const MAX_SCALE = 5.0
const ZOOM_STEP = 0.2

const initialViewState: ViewState = {
  scale: 0.3,
  offsetX: 0,
  offsetY: 0,
  showPolygon: true,
  sidebarOpen: true,
  revisionPanelOpen: false,
  overlayOpacity: 0.5,
}

export const useViewStore = create<ViewState & ViewActions>((set) => ({
  ...initialViewState,

  setScale: (scale) =>
    set({ scale: clamp(scale, MIN_SCALE, MAX_SCALE) }),

  zoomIn: () =>
    set((state) => ({
      scale: clamp(state.scale + ZOOM_STEP, MIN_SCALE, MAX_SCALE),
    })),

  zoomOut: () =>
    set((state) => ({
      scale: clamp(state.scale - ZOOM_STEP, MIN_SCALE, MAX_SCALE),
    })),

  resetZoom: () => set({ scale: 0.3 }),

  setOffset: (x, y) => set({ offsetX: x, offsetY: y }),

  resetOffset: () => set({ offsetX: 0, offsetY: 0 }),

  // 모든 뷰 상태를 초기화
  resetView: () =>
    set({
      scale: 0.3,
      offsetX: 0,
      offsetY: 0,
    }),

  togglePolygon: () =>
    set((state) => ({ showPolygon: !state.showPolygon })),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleRevisionPanel: () =>
    set((state) => ({ revisionPanelOpen: !state.revisionPanelOpen })),

  setRevisionPanelOpen: (open) => set({ revisionPanelOpen: open }),

  /**
   * @param opacity 0(투명) ~ 1(불투명) 사이의 값 제한
   */
  setOverlayOpacity: (opacity) =>
    set({ overlayOpacity: clamp(opacity, 0, 1) }),
}))


// 값이 지정된 범위를 벗어나지 않도록 제한하는 유틸리티
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}