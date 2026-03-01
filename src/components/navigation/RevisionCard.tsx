import type { NormalizedRevision } from '../../data/parser'

interface Props {
  rev: NormalizedRevision
  isSelected: boolean
  isCompare: boolean
  showCompareButton: boolean
  onSelect: () => void
  onCompareToggle: () => void
}

export function RevisionCard({
  rev, isSelected, isCompare, showCompareButton, onSelect, onCompareToggle,
}: Props) {
  const isInitial = rev.changes.length === 0

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      {/* 타임라인 노드 */}
      <div style={{
        position: 'relative', flexShrink: 0, zIndex: 1,
        marginTop: '12px', marginLeft: '14px',
        width: '10px', height: '10px', borderRadius: '50%',
        border: `2px solid ${rev.isLatest ? '#10b981' : isSelected ? '#7c3aed' : '#d1d5db'}`,
        background: rev.isLatest ? '#10b981' : isSelected ? '#7c3aed' : '#ffffff',
        boxShadow: rev.isLatest
          ? '0 0 0 3px #d1fae5'
          : isSelected ? '0 0 0 3px #ede9fe' : 'none',
      }} />

      {/* 카드 */}
      <button
        onClick={onSelect}
        style={{
          flex: 1, textAlign: 'left', padding: '9px 11px', borderRadius: '10px',
          border: isSelected
            ? '1px solid #ddd6fe'
            : isCompare ? '1px solid #fde68a' : '1px solid transparent',
          background: isSelected ? '#f5f3ff' : isCompare ? '#fffbeb' : 'transparent',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!isSelected && !isCompare)
            (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'
        }}
        onMouseLeave={(e) => {
          if (!isSelected && !isCompare)
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        }}
      >
        {/* 버전 + 뱃지 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#6d28d9' : '#1f2937' }}>
            {rev.version}
          </span>
          {rev.isLatest && (
            <span style={{
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0',
              padding: '1px 7px', borderRadius: '999px',
            }}>
              LATEST
            </span>
          )}
          {isCompare && (
            <span style={{
              fontSize: '9px', fontWeight: 700,
              color: '#d97706', background: '#fef3c7', border: '1px solid #fde68a',
              padding: '1px 7px', borderRadius: '999px',
            }}>
              비교
            </span>
          )}
        </div>

        {/* 날짜 */}
        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px', fontWeight: 500 }}>
          {rev.date}
        </div>

        {/* 변경사항 */}
        {!isInitial && rev.changes.length > 0 ? (
          <ul style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {rev.changes.map((change, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#6b7280' }}>
                <span style={{ color: '#d1d5db', marginTop: '1px', flexShrink: 0 }}>—</span>
                <span>{change}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', display: 'block' }}>
            초기 설계
          </span>
        )}
      </button>

      {/* 비교 버튼 */}
      {showCompareButton && (
        <button
          onClick={onCompareToggle}
          title="이 버전과 비교"
          style={{
            marginTop: '10px', padding: '5px', borderRadius: '7px', border: 'none',
            background: isCompare ? '#fef3c7' : 'transparent',
            color: isCompare ? '#d97706' : '#d1d5db',
            cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!isCompare) {
              (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6'
                ; (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'
            }
          }}
          onMouseLeave={(e) => {
            if (!isCompare) {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                ; (e.currentTarget as HTMLButtonElement).style.color = '#d1d5db'
            }
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}