import { useDrawingStore } from '../../store/drawingStore'
import { getDrawing } from '../../data/selectors'
import { useDrawingNavigation } from '../../hooks/useDrawingNavigation'

export function Header() {
  const {
    selectedDrawingId,
    selectedDisciplineKey,
    selectedRevision,
    selectDrawing,
  } = useDrawingStore()

  const drawing = selectedDrawingId ? getDrawing(selectedDrawingId) : null
  const { navigateToDrawing } = useDrawingNavigation()

  /**
   * 브레드크럼 아이템 구성 로직
   * @description 
   * 1. 전체 배치도 (Root)
   * 2. 선택된 도면 (Building) - 이동 시 뷰 리셋 포함
   * 3. 선택된 공종 (Discipline)
   * 4. 선택된 리비전 (Revision)
   */
  const crumbs = [
    {
      label: '전체 배치도',
      onClick: () => selectDrawing('00'),
      active: selectedDrawingId === '00',
    },
    // 도면 단위: '00'이 아닌 특정 건물을 선택했을 때 표시
    ...(drawing && drawing.id !== '00'
      ? [{ label: drawing.name, onClick: () => navigateToDrawing(drawing.id), active: !selectedDisciplineKey }]
      : []),
    // 공종 단위: 현재는 별도의 클릭 액션 없이 표시만 함
    ...(selectedDisciplineKey
      ? [{ label: selectedDisciplineKey, onClick: () => { }, active: !selectedRevision }]
      : []),
    // 리비전 단위: 최하위 뎁스이므로 항상 활성 상태로 표시
    ...(selectedRevision
      ? [{ label: selectedRevision.version, onClick: () => { }, active: true }]
      : []),
  ]

  return (
    <header
      className="h-14 flex items-center px-6 gap-4 shrink-0 gap-3"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)',
      }}
    >
      {/* 로고 */}
      <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => selectDrawing('00')}>
        <div
          className="w-9 h-9 flex items-center justify-center overflow-hidden"
          style={{
            background: '#ffffff',
          }}
        >
          <img
            src="/timwork_logo.png"
            alt="timwork Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1">
        {crumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-0.5 shrink-0">
            {/* 구분선: 첫 번째 아이템 이후부터 렌더링 */}
            {i > 0 && (
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="mx-0.5">
                <path d="M4 2l4 4-4 4" stroke="#e5e7eb" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
            <button
              onClick={crumb.onClick}
              disabled={crumb.active} // 현재 위치인 경우 클릭 방지
              style={crumb.active ? {
                background: '#f3f0ff',
                color: '#6d28d9',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'default',
                border: 'none',
              } : {
                background: 'transparent',
                color: '#9ca3af',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!crumb.active) {
                  (e.target as HTMLButtonElement).style.background = '#f9fafb'
                    ; (e.target as HTMLButtonElement).style.color = '#374151'
                }
              }}
              onMouseLeave={(e) => {
                if (!crumb.active) {
                  (e.target as HTMLButtonElement).style.background = 'transparent'
                    ; (e.target as HTMLButtonElement).style.color = '#9ca3af'
                }
              }}
            >
              {crumb.label}
            </button>
          </div>
        ))}
      </nav>

      {/* 리비전 정보: 선택된 리비전이 있을 때만 날짜 및 LATEST 태그 노출 */}
      {selectedRevision && (
        <div className="flex items-center gap-5 shrink-0">
          {selectedRevision.isLatest && (
            <span
              className="text-[10px] font-bold tracking-wider uppercase"
              style={{
                color: '#059669',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '2px 10px',
                borderRadius: '999px',
              }}
            >
              LATEST
            </span>
          )}
          <span className="text-[12px] font-medium" style={{ color: '#9ca3af' }}>
            {selectedRevision.date}
          </span>
        </div>
      )}
    </header>
  )
}