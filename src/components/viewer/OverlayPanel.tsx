import { useDrawingStore } from '../../store/drawingStore'
import { useViewStore } from '../../store/viewStore'

// 공종별 식별을 위한 고유 색상 맵
const DISCIPLINE_COLORS: Record<string, string> = {
  건축: '#60a5fa',
  구조: '#fb923c',
  공조설비: '#22d3ee',
  배관설비: '#c084fc',
  설비: '#2dd4bf',
  소방: '#f87171',
  조경: '#4ade80',
}

/**
 * 활성화된 도면 겹쳐보기(Overlay) 목록을 관리하고 투명도를 조절하는 플로팅 패널입니다.
 * @description 캔버스 중앙 하단에 위치하며, 선택된 오버레이 공종들을 태그 형태로 표시합니다.
 */
export function OverlayPanel() {
  const {
    selectedDisciplineKey,
    overlayDisciplineKeys,
    toggleOverlay,
    clearOverlays,
  } = useDrawingStore()
  const { overlayOpacity, setOverlayOpacity } = useViewStore()

  if (!overlayDisciplineKeys.length) return null

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 30,
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '340px',
    }}>
      {/* 라벨 */}
      <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
        겹쳐보기
      </span>

      {/* 활성 오버레이 태그들 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
        {selectedDisciplineKey && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '3px 10px', borderRadius: '999px',
            background: '#f8fafc', border: '1px solid #e2e8f0',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: DISCIPLINE_COLORS[selectedDisciplineKey] ?? '#94a3b8', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>{selectedDisciplineKey}</span>
          </div>
        )}

        {/* 메인 도면 위에 추가로 겹쳐진 오버레이 공종 태그들 */}
        {overlayDisciplineKeys.map((key) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#d1d5db' }}>+</span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '3px 8px 3px 10px', borderRadius: '999px',
              background: '#f8fafc', border: '1px solid #e2e8f0',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: DISCIPLINE_COLORS[key] ?? '#94a3b8', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>{key}</span>
              <button
                onClick={() => toggleOverlay(key)} // 개별 공종 겹쳐보기 해제
                style={{
                  marginLeft: '2px', padding: '1px', background: 'transparent',
                  border: 'none', cursor: 'pointer', color: '#9ca3af',
                  display: 'flex', alignItems: 'center', borderRadius: '3px',
                  transition: 'color 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
              >
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 투명도 슬라이더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', fontWeight: 500, color: '#9ca3af' }}>투명도</span>
        <input
          type="range"
          min={0} max={1} step={0.05}
          value={overlayOpacity}
          onChange={(e) => setOverlayOpacity(Number(e.target.value))}
          style={{ width: '72px', accentColor: '#7c3aed' }}
        />
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', minWidth: '28px', textAlign: 'right' }}>
          {Math.round(overlayOpacity * 100)}%
        </span>
      </div>

      {/* 전체 해제 */}
      <button
        onClick={clearOverlays}
        style={{
          fontSize: '11px', fontWeight: 500, color: '#9ca3af',
          background: 'transparent', border: 'none', cursor: 'pointer',
          flexShrink: 0, padding: '2px 4px', borderRadius: '5px', transition: 'color 0.1s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
      >
        해제
      </button>
    </div>
  )
}