import { useViewStore } from '../../store/viewStore'
import { useDrawingStore } from '../../store/drawingStore'
import { BuildingList } from '../navigation/BuildingList'
import { SidebarOverviewButton } from '../navigation/SidebarOverviewButton'
import { DisciplineTab } from '../navigation/DisciplineTab'
import { RevisionList } from '../navigation/RevisionList'

/**
 * 도면 탐색 및 리비전 관리를 위한 메인 사이드바 컴포넌트입니다.
 * @description 
 * - 레이아웃: [전체 배치도] -> [건물 목록] -> [공종(선택 시)] -> [리비전(선택 시)]
 * - 상태: 좌측 고정 레이아웃이며, 토글 버튼을 통해 열고닫기가 가능합니다.
 */
export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useViewStore()
  const { selectedDrawingId, selectedDisciplineKey } = useDrawingStore()

  return (
    <>
      <aside
        className="relative flex flex-col h-full overflow-hidden"
        style={{
          width: sidebarOpen ? '264px' : '0px',
          minWidth: sidebarOpen ? '264px' : '0px',
          transition: 'width 200ms ease-in-out, min-width 200ms ease-in-out',
          background: '#ffffff',
          borderRight: '1px solid #f0f0f0',
          boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
        }}
      >
        {/* 내부 컨텐츠의 너비를 고정하여 사이드바가 닫힐 때 컨텐츠가 찌그러지는 현상 방지 */}
        <div style={{
          width: '264px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#e5e7eb transparent',
        }}>
          {/* 1. 최상위 네비게이션 */}
          <div style={{ padding: '12px 12px 4px' }}>
            <SidebarOverviewButton />
          </div>

          <div style={{ height: '1px', background: '#f3f4f6', margin: '6px 16px' }} />

          {/* 2. 건물/동 목록 */}
          <BuildingList />

          {/* 3. 특정 건물 선택 시에만 공종 탭 노출 */}
          {selectedDrawingId && selectedDrawingId !== '00' && (
            <>
              <div style={{ height: '1px', background: '#f3f4f6', margin: '4px 16px' }} />
              <div style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                <DisciplineTab />
              </div>
            </>
          )}

          {/* 4. 특정 공종 선택 시에만 리비전 이력 노출 */}
          {selectedDisciplineKey && (
            <>
              <div style={{ height: '1px', background: '#f3f4f6', margin: '4px 16px' }} />
              <div style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                <RevisionList />
              </div>
            </>
          )}

          <div style={{ paddingBottom: '32px' }} />
        </div>
      </aside>

      {/* 사이드바 토글 버튼 */}
      <button
        onClick={toggleSidebar}
        title={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: sidebarOpen ? '264px' : '0px',
          transition: 'left 200ms ease-in-out',
          zIndex: 20,
          width: '18px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          border: '1px solid #f0f0f0',
          borderLeft: 'none',
          borderRadius: '0 10px 10px 0',
          boxShadow: '3px 0 8px rgba(0,0,0,0.06)',
          color: '#9ca3af',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = '#374151'
            ; (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'
            ; (e.currentTarget as HTMLButtonElement).style.background = '#ffffff'
        }}
      >
        {/* 열림/닫힘 상태에 따른 화살표 아이콘 방향 반전 */}
        <svg
          width="7" height="11" viewBox="0 0 8 12" fill="none"
          style={{ transform: sidebarOpen ? 'none' : 'rotate(180deg)', transition: 'transform 200ms' }}
        >
          <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  )
}