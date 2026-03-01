import { useDrawingNavigation } from '../../hooks/useDrawingNavigation'
import { useDrawingStore } from '../../store/drawingStore'

/**
 * 사이드바 최상단에 위치한 '전체 배치도' 바로가기 버튼입니다.
 * 모든 필터링을 해제하고 프로젝트 전체 구도를 보여주는 역할을 합니다.
 */
export function SidebarOverviewButton() {
  const { selectedDrawingId } = useDrawingStore()
  const { navigateToDrawing } = useDrawingNavigation()
  const isSelected = selectedDrawingId === '00'

  return (
    <button
      onClick={() => navigateToDrawing('00')}
      style={{
        width: '100%', textAlign: 'left',
        padding: '10px 12px', borderRadius: '12px',
        border: isSelected ? '1.5px solid #ddd6fe' : '1.5px solid #f1f5f9',
        background: isSelected
          ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
          : '#f8fafc',
        cursor: 'pointer', transition: 'all 0.15s',
        display: 'flex', alignItems: 'center', gap: '10px',
        boxShadow: isSelected
          ? '0 2px 8px rgba(124,58,237,0.12)'
          : '0 1px 2px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = '#f1f5f9'
          el.style.borderColor = '#e2e8f0'
          el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = '#f8fafc'
          el.style.borderColor = '#f1f5f9'
          el.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'
        }
      }}
    >
      {/* 그리드 아이콘 : 4개의 사각형으로 전체 레이아웃을 형상화 */}
      <div style={{
        width: '30px', height: '30px', borderRadius: '9px',
        background: isSelected ? '#ede9fe' : '#e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.15s',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="5" height="5" rx="1" stroke={isSelected ? '#7c3aed' : '#94a3b8'} strokeWidth="1.3" />
          <rect x="8" y="1" width="5" height="5" rx="1" stroke={isSelected ? '#7c3aed' : '#94a3b8'} strokeWidth="1.3" />
          <rect x="1" y="8" width="5" height="5" rx="1" stroke={isSelected ? '#7c3aed' : '#94a3b8'} strokeWidth="1.3" />
          <rect x="8" y="8" width="5" height="5" rx="1" stroke={isSelected ? '#7c3aed' : '#94a3b8'} strokeWidth="1.3" />
        </svg>
      </div>

      <div>
        <span style={{
          fontSize: '13px', fontWeight: isSelected ? 600 : 500,
          color: isSelected ? '#5b21b6' : '#374151',
          display: 'block', transition: 'color 0.15s',
        }}>
          전체 배치도
        </span>
        <span style={{
          fontSize: '10px',
          color: isSelected ? '#8b5cf6' : '#9ca3af',
          display: 'block', marginTop: '1px',
        }}>
          Site Overview
        </span>
      </div>
    </button>
  )
}