import { useRef, useEffect, useState, useCallback } from 'react'
import { useDrawingStore } from '../../store/drawingStore'
import { useViewStore } from '../../store/viewStore'
import { getDrawing, getDiscipline } from '../../data/selectors'
import { CanvasEmptyState } from './CanvasEmptyState'
import { ZoomControls } from './ZoomControls'
import { DrawingInfo } from './DrawingInfo'
import { PolygonOverlay } from './PolygonOverlay'

const DRAWINGS_PATH = '/drawings/'

/**
 * 메인 도면 렌더링 및 인터랙션(Pan/Zoom)을 담당하는 캔버스 컴포넌트입니다.
 * @description 여러 공종의 이미지를 중첩(Overlay)하고, 비교 모드 지원합니다.
 */
export function DrawingCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null)

  const {
    selectedDrawingId,
    selectedDisciplineKey,
    selectedRevision,
    overlayDisciplineKeys,
    compareMode,
    compareRevision,
  } = useDrawingStore()

  const {
    scale, offsetX, offsetY,
    overlayOpacity, setScale, setOffset, zoomIn, zoomOut,
  } = useViewStore()

  // 데이터 선택 로직
  const drawing = selectedDrawingId ? getDrawing(selectedDrawingId) : null
  const discipline = selectedDrawingId && selectedDisciplineKey
    ? getDiscipline(selectedDrawingId, selectedDisciplineKey)
    : null
  // 리비전 -> 공종 기본 -> 도면 기본 순으로 표시할 메인 이미지를 결정
  const mainImage = selectedRevision?.image ?? discipline?.image ?? drawing?.image

  /** 
   * 다중 공종 비교를 위해 선택된 오버레이 이미지들을 추출합니다. 
   */
  const overlayImages = overlayDisciplineKeys
    .map(key => {
      if (!selectedDrawingId) return null
      const d = getDiscipline(selectedDrawingId, key)
      if (!d) return null
      const latestRev = d.revisions.find(r => r.isLatest)
      return { key, image: latestRev?.image ?? d.image }
    })
    .filter(Boolean) as { key: string; image: string }[]

  /** 
   * 브라우저 기본 줌 기능을 막고 사용자 정의 줌 로직을 적용합니다. 
   * passive: false 설정을 위해 useEffect 내에서 수동으로 이벤트를 등록합니다.
   */
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setScale(scale + delta)
  }, [scale, setScale])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // 드래그 핸들러 
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    // 현재 마우스 위치와 기존 오프셋의 차이를 저장하여 드래그 가속도를 방지
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setOffset(e.clientX - dragStart.x, e.clientY - dragStart.y)
  }
  const handleMouseUp = () => setIsDragging(false)

  const handleImageLoad = () => {
    if (imgRef.current) {
      setImgSize({
        w: imgRef.current.naturalWidth,
        h: imgRef.current.naturalHeight,
      })
    }
  }

  if (!mainImage) return <CanvasEmptyState />

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden',
        background: '#f1f5f9',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 배경 도트 그리드 */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* 줌/팬이 적용되는 최상위 뷰포트 레이어 */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
        transformOrigin: 'center center',
        transition: isDragging ? 'none' : 'transform 0.05s ease-out',
      }}>
        {/* 이미지 + SVG를 같은 relative 컨테이너에 겹침 */}
        <div style={{ position: 'relative', lineHeight: 0 }}>

          {/* 메인 도면 */}
          <img
            ref={imgRef}
            src={`${DRAWINGS_PATH}${mainImage}`}
            alt={drawing?.name ?? '도면'}
            onLoad={handleImageLoad}
            style={{
              maxWidth: 'none', display: 'block',
              imageRendering: 'crisp-edges',
              borderRadius: '4px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            }}
            draggable={false}
          />

          {/* 공종 오버레이 이미지들 */}
          {overlayImages.map(({ key, image }) => (
            <img
              key={key}
              src={`${DRAWINGS_PATH}${image}`}
              alt={`${key} 오버레이`}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: overlayOpacity,
                mixBlendMode: 'multiply',
              }}
              draggable={false}
            />
          ))}

          {/* 비교 모드 활성화 시 표시되는 강조 가이드라인 */}
          {compareMode && compareRevision && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              border: '2px solid rgba(251,191,36,0.5)', borderRadius: '4px',
            }}>
              <div style={{
                position: 'absolute', top: '8px', right: '8px',
                background: 'rgba(251,191,36,0.15)',
                border: '1px solid rgba(251,191,36,0.4)',
                padding: '2px 10px', borderRadius: '999px',
              }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#d97706' }}>
                  비교: {compareRevision.version}
                </span>
              </div>
            </div>
          )}

          {/* 폴리곤 SVG 레이어 — imgSize 측정 후에만 렌더 */}
          {imgSize && <PolygonOverlay imgSize={imgSize} />}
        </div>
      </div>

      {/* 인터랙션 레이어 (항상 최상단 유지) */}
      < ZoomControls scale={scale} onZoomIn={zoomIn} onZoomOut={zoomOut} />
      <DrawingInfo />
    </div >
  )
}