import { useViewStore } from '../../store/viewStore'

interface Props {
  scale: number
  onZoomIn: () => void
  onZoomOut: () => void
}

/**
 * 도면 캔버스의 확대/축소 및 뷰 초기화를 제어하는 플로팅 컨트롤바입니다.
 * @description 우측 하단에 고정되어 현재 배율 표시 및 증감 기능을 제공합니다.
 */
export function ZoomControls({ scale, onZoomIn, onZoomOut }: Props) {
  const { resetView } = useViewStore()

  // 공통 버튼 베이스 스타일
  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#ffffff', border: '1px solid #e5e7eb',
    color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  }

  return (
    <div style={{
      position: 'absolute', bottom: '20px', right: '20px',
      display: 'flex', alignItems: 'center', gap: '4px',
    }}>
      {/* 축소 버튼 */}
      <button
        onClick={onZoomOut}
        style={{ ...btnBase, width: '30px', height: '30px', borderRadius: '8px', fontSize: '16px', fontWeight: 300 }}
      >
        −
      </button>
      {/* 현재 배율 표시 및 리셋 버튼 */}
      <button
        onClick={resetView}
        style={{ ...btnBase, height: '30px', padding: '0 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, minWidth: '50px', color: '#374151' }}
      >
        {Math.round(scale * 100)}%
      </button>
      {/* 확대 버튼 */}
      <button
        onClick={onZoomIn}
        style={{ ...btnBase, width: '30px', height: '30px', borderRadius: '8px', fontSize: '16px', fontWeight: 300 }}
      >
        +
      </button>
    </div>
  )
}