import { getDisciplines } from '../../data/selectors'
import { useDrawingNavigation } from '../../hooks/useDrawingNavigation';
import { useDrawingStore } from '../../store/drawingStore'

/**
 * 공종(Discipline) 선택 탭 컴포넌트
 * @description 각 공종별 고유 색상을 적용하고, 리비전 수 또는 Region 존재 여부를 표시합니다.
 */
const DISCIPLINE_COLORS: Record<string, { dot: string; bg: string; border: string; text: string; tagBg: string }> = {
  건축: { dot: '#60a5fa', bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', tagBg: '#dbeafe' },
  구조: { dot: '#fb923c', bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', tagBg: '#ffedd5' },
  공조설비: { dot: '#22d3ee', bg: '#ecfeff', border: '#a5f3fc', text: '#0e7490', tagBg: '#cffafe' },
  배관설비: { dot: '#c084fc', bg: '#faf5ff', border: '#e9d5ff', text: '#7e22ce', tagBg: '#f3e8ff' },
  설비: { dot: '#2dd4bf', bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e', tagBg: '#ccfbf1' },
  소방: { dot: '#f87171', bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', tagBg: '#fee2e2' },
  조경: { dot: '#4ade80', bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', tagBg: '#dcfce7' },
}

const DEFAULT_COLOR = {
  dot: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', text: '#475569', tagBg: '#f1f5f9',
}

export function DisciplineTab() {
  const { navigateToDiscipline } = useDrawingNavigation()
  const {
    selectedDrawingId,
    selectedDisciplineKey,
  } = useDrawingStore()
  // 전체 배치도('00') 상태에서는 공종 선택을 제한합니다.
  if (!selectedDrawingId || selectedDrawingId === '00') return null

  const disciplines = getDisciplines(selectedDrawingId)

  return (
    <div className="px-2">
      {/* 섹션 레이블 */}
      <div className="px-2 pb-1.5 pt-2">
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          공종
        </span>
      </div>

      <div className="space-y-0.5">
        {disciplines.map((discipline) => {
          const isSelected = selectedDisciplineKey === discipline.key
          const color = DISCIPLINE_COLORS[discipline.key] ?? DEFAULT_COLOR
          const latestRevision = discipline.revisions?.find(r => r.isLatest)

          return (
            <div
              key={discipline.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                border: isSelected ? `1px solid ${color.border}` : '1px solid transparent',
                background: isSelected ? color.bg : 'transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'
              }}
            >
              {/* 메인 버튼 */}
              <button
                onClick={() => navigateToDiscipline(discipline.key)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {/* 색상 도트 */}
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: color.dot,
                  flexShrink: 0,
                  boxShadow: isSelected ? `0 0 0 3px ${color.tagBg}` : 'none',
                }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? color.text : '#374151',
                    }}>
                      {discipline.key}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: isSelected ? color.text : '#9ca3af',
                      background: isSelected ? color.tagBg : '#f3f4f6',
                      padding: '0px 6px',
                      borderRadius: '999px',
                      opacity: 0.9,
                    }}>
                      {discipline.hasRegions ? 'A/B' : `REV ${discipline.revisions?.length ?? 1}`}
                    </span>
                  </div>

                  {/* 선택된 공종의 최신 업데이트 날짜 노출 */}
                  {latestRevision && isSelected && (
                    <span style={{ fontSize: '10px', color: '#9ca3af', display: 'block', marginTop: '2px' }}>
                      {latestRevision.date}
                    </span>
                  )}
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}