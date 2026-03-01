import { useDrawingStore } from '../../store/drawingStore'
import { getDrawing } from '../../data/selectors'

/**
 * 캔버스 좌측 하단에 위치한 현재 도면 정보 배지입니다.
 * [도면명 · 공종 · 리비전 · LATEST 태그] 순서로 현재 뷰의 컨텍스트를 요약해 보여줍니다.
 */
export function DrawingInfo() {
  const { selectedDrawingId, selectedDisciplineKey, selectedRevision } = useDrawingStore()
  const drawing = selectedDrawingId ? getDrawing(selectedDrawingId) : null

  // 전체 배치도('00') 상태이거나 도면이 선택되지 않았다면 별도 정보를 표시하지 않습니다.
  if (!drawing || drawing.id === '00') return null

  return (
    <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
      <div style={{
        background: '#ffffff', border: '1px solid #e5e7eb',
        borderRadius: '10px', padding: '6px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        {/* 도면명 정제 로직 */}
        <span style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280' }}>
          {drawing.name.replace(' 지상1층 평면도', '')}
        </span>

        {/* 선택된 공종이 있을 경우 구분자와 함께 표시 */}
        {selectedDisciplineKey && (
          <>
            <span style={{ color: '#e5e7eb' }}>·</span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280' }}>
              {selectedDisciplineKey}
            </span>
          </>
        )}

        {/* 리비전 정보: 버전명 표시 및 최신본인 경우 전용 태그 노출 */}
        {selectedRevision && (
          <>
            <span style={{ color: '#e5e7eb' }}>·</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151' }}>
              {selectedRevision.version}
            </span>
            {selectedRevision.isLatest && (
              <span style={{
                fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: '#059669', background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '1px 7px', borderRadius: '999px',
              }}>
                LATEST
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}