import { OverlayPanel } from '../viewer/OverlayPanel'
import { useDrawingStore } from '../../store/drawingStore'
import { DrawingCanvas } from '../viewer/DrawingCanvas'
import { useViewStore } from '../../store/viewStore'
import { ToolbarButton } from '../ui/ToolbarButton'

/**
 * 도면 뷰어의 메인 영역 컴포넌트입니다.
 * @description 상단 툴바(상태 표시)와 중앙 캔버스(도면 렌더링), 하단 오버레이 패널을 포함합니다.
 */
export function Viewer() {
  const { showPolygon, togglePolygon } = useViewStore()
  const { overlayDisciplineKeys, compareMode, exitCompareMode } = useDrawingStore()

  return (
    <div className="flex-1 flex flex-col relative min-w-0" style={{ background: '#f8f9fa' }}>
      {/* 1. 뷰어 툴바 */}
      <div
        className="flex items-center shrink-0"
        style={{
          height: '48px',
          padding: '0 16px',
          gap: '8px',
          background: '#ffffff',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {/* 폴리곤 토글 */}
        <ToolbarButton
          active={showPolygon}
          onClick={togglePolygon}
          title="영역 표시"
          icon={
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l5 4-2 7H4L2 5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          }
        />

        {/* 리비전 비교 모드 상태 표시 및 종료 제어 */}
        {compareMode && (
          <div className="flex items-center gap-2">
            <span style={{
              fontSize: '11px', fontWeight: 600,
              color: '#92400e', background: '#fffbeb',
              border: '1px solid #fde68a',
              padding: '3px 10px', borderRadius: '999px',
            }}>
              비교 모드
            </span>
            <button
              onClick={exitCompareMode}
              style={{
                fontSize: '11px', fontWeight: 500,
                color: '#9ca3af', background: 'transparent',
                border: 'none', cursor: 'pointer',
                padding: '2px 6px', borderRadius: '6px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
            >
              종료
            </button>
          </div>
        )}

        {/* 다중 공종 겹쳐보기 활성화 수 표시 */}
        {overlayDisciplineKeys.length > 0 && (
          <span style={{
            fontSize: '11px', fontWeight: 500,
            color: '#6d28d9', background: '#f5f3ff',
            border: '1px solid #ede9fe',
            padding: '3px 10px', borderRadius: '999px',
          }}>
            {overlayDisciplineKeys.length}개 겹쳐보기 중
          </span>
        )}

        {/* 사용자 조작 편의를 위한 단축키/가이드 힌트 */}
        <div className="ml-auto">
          <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
            스크롤 : 줌 · 드래그 : 이동
          </span>
        </div>
      </div>

      {/* 2. 메인 컨텐츠 영역 */}
      <div className="flex-1 relative">
        <DrawingCanvas />
        <OverlayPanel />
      </div>
    </div>
  )
}