import { getChildDrawings, getDisciplines } from '../../data/selectors'
import { useDrawingNavigation } from '../../hooks/useDrawingNavigation'
import { useDrawingStore } from '../../store/drawingStore'

/**
 * 사이드바에 표시되는 건물 리스트 컴포넌트입니다.
 * 각 건물의 공종 요약 정보를 보여주며, 선택 시 해당 건물의 상세 뷰로 이동합니다.
 */
export function BuildingList() {
  const { navigateToDrawing } = useDrawingNavigation()
  const { selectedDrawingId } = useDrawingStore()

  const handleSelect = (id: string) => navigateToDrawing(id)

  const buildings = getChildDrawings('00')

  return (
    <div style={{ padding: '4px 12px 8px' }}>
      {/* 섹션 레이블 */}
      <div style={{ padding: '12px 4px 8px' }}>
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          color: '#9ca3af',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          건물 목록
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {buildings.map((building) => {
          const isSelected = selectedDrawingId === building.id
          const disciplines = getDisciplines(building.id)
          const disciplineCount = disciplines.length

          return (
            <button
              key={building.id}
              onClick={() => handleSelect(building.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: '12px',
                border: isSelected ? '1.5px solid #ddd6fe' : '1.5px solid #f1f5f9',
                background: isSelected
                  ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
                  : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.15s',
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
              {/* 상단 row: 아이콘 + 이름 + 공종수 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '9px',
                  background: isSelected ? '#ede9fe' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="6" width="12" height="9" rx="1" stroke={isSelected ? '#7c3aed' : '#94a3b8'} strokeWidth="1.3" />
                    <path d="M1 7L8 1.5L15 7" stroke={isSelected ? '#7c3aed' : '#94a3b8'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="6" y="10" width="4" height="5" rx="0.5" stroke={isSelected ? '#7c3aed' : '#94a3b8'} strokeWidth="1.1" />
                  </svg>
                </div>

                <span style={{
                  flex: 1,
                  fontSize: '13px',
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#5b21b6' : '#374151',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {building.name.replace(' 지상1층 평면도', '').replace(' 확대 평면도', '')}
                </span>

                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: isSelected ? '#7c3aed' : '#94a3b8',
                  background: isSelected ? '#ede9fe' : '#e2e8f0',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}>
                  {disciplineCount}공종
                </span>
              </div>

              {/* 선택 시 공종 태그 */}
              {isSelected && disciplines.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  marginTop: '10px',
                  paddingTop: '10px',
                  borderTop: '1px solid #ddd6fe',
                }}>
                  {disciplines.map((d) => (
                    <span key={d.key} style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: '#6d28d9',
                      background: '#ffffff',
                      border: '1px solid #ddd6fe',
                      padding: '2px 8px',
                      borderRadius: '999px',
                    }}>
                      {d.key}
                    </span>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}