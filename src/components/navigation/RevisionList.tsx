import { getAllRevisions } from '../../data/selectors'
import { useDrawingStore } from '../../store/drawingStore'
import { RevisionCard } from './RevisionCard'
import type { NormalizedRevision } from '../../data/parser'

/**
 * 선택된 도면/공종의 리비전 이력을 타임라인 형태로 표시합니다.
 * @description 리비전 선택 및 두 리비전 간의 도면 비교(Overlay) 기능을 제어합니다.
 */
export function RevisionList() {
  const {
    selectedDrawingId, selectedDisciplineKey, selectedRegionKey,
    selectedRevision, compareMode, compareRevision,
    selectRevision, enterCompareMode, exitCompareMode,
  } = useDrawingStore()

  // 도면과 공종이 모두 선택된 상태에서만 이력을 표시합니다.
  if (!selectedDrawingId || !selectedDisciplineKey) return null

  const revisions = getAllRevisions(
    selectedDrawingId,
    selectedDisciplineKey,
    selectedRegionKey ?? undefined
  )

  if (revisions.length === 0) return null

  /**
   * 리비전 카드 클릭 핸들러
   * @logic 비교 모드 활성 여부에 따라 동작이 달라집니다.
   * - 일반 모드: 해당 리비전으로 메인 도면 교체
   * - 비교 모드: 해당 리비전을 비교 대상(Overlay)으로 지정
   */
  const handleRevisionClick = (rev: NormalizedRevision) => {
    if (compareMode) { enterCompareMode(rev); return }
    selectRevision(rev)
  }

  // 비교 대상 토글 로직
  const handleCompareToggle = (rev: NormalizedRevision) => {
    if (compareMode && compareRevision?.version === rev.version) exitCompareMode()
    else enterCompareMode(rev)
  }

  return (
    <div className="px-2">
      {/* 헤더 : 리비전이 2개 이상일 때만 비교 기능 활성화 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 8px 6px',
      }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, color: '#9ca3af',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          리비전 이력
        </span>

        {/* 리비전을 연결하는 수직 타임라인 선 */}
        {revisions.length > 1 && (
          <button
            onClick={() => compareMode ? exitCompareMode() : enterCompareMode(selectedRevision!)}
            style={{
              fontSize: '10px', fontWeight: 600,
              color: compareMode ? '#d97706' : '#9ca3af',
              background: compareMode ? '#fef3c7' : '#f3f4f6',
              border: compareMode ? '1px solid #fde68a' : '1px solid transparent',
              padding: '2px 8px', borderRadius: '999px',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {compareMode ? '비교 중' : '비교'}
          </button>
        )}
      </div>

      {/* 타임라인 목록 */}
      <div style={{ position: 'relative' }}>
        {revisions.length > 1 && (
          <div style={{
            position: 'absolute', left: '19px', top: '14px', bottom: '14px',
            width: '1px', background: '#e5e7eb',
          }} />
        )}

        <div className="space-y-1">
          {/* 최신 리비전이 위로 오도록 역순(Reverse)으로 정렬하여 렌더링 */}
          {[...revisions].reverse().map((rev) => (
            <RevisionCard
              key={rev.version}
              rev={rev}
              isSelected={selectedRevision?.version === rev.version}
              isCompare={compareRevision?.version === rev.version}
              // 메인으로 선택된 리비전이 아닌 다른 리비전들만 비교 대상으로 선택 가능
              showCompareButton={
                revisions.length > 1 &&
                !!selectedRevision &&
                selectedRevision.version !== rev.version
              }
              onSelect={() => handleRevisionClick(rev)}
              onCompareToggle={() => handleCompareToggle(rev)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}