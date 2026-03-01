import { useState } from 'react'
import { useViewStore } from '../../store/viewStore'
import { useDrawingNavigation } from '../../hooks/useDrawingNavigation'
import {
  usePolygonLayers,
  applyPolygonTransform,
  verticesToPoints,
  calcCentroid,
} from '../../hooks/usePolygonLayers'

interface Props {
  imgSize: { w: number; h: number }
}

export function PolygonOverlay({ imgSize }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { showPolygon } = useViewStore()
  const { navigateToDrawing } = useDrawingNavigation()
  const layers = usePolygonLayers()

  if (layers.length === 0) return null

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: showPolygon ? 1 : 0,
        transition: 'opacity 0.2s ease',
        pointerEvents: showPolygon ? 'auto' : 'none',
      }}
      // 이미지 원본 사이즈와 SVG 좌표계를 동기화하여 반응형 대응
      viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {layers.map((layer) => {
        // 원본 좌표에 캔버스 회전/스케일 등 변환 매트릭스 적용
        const transformed = applyPolygonTransform(
          layer.polygon.vertices,
          layer.polygon.polygonTransform
        )
        const points = verticesToPoints(transformed)
        const isHovered = hoveredId === layer.id
        const { fill, stroke } = layer.color

        return (
          <g key={layer.id}>
            <polygon
              points={points}
              fill={isHovered ? fill.replace('0.15', '0.3') : fill}
              stroke={stroke}
              strokeWidth={isHovered ? 2 : 1.5}
              strokeLinejoin="round"
              style={{
                cursor: layer.navigateTo ? 'pointer' : 'default',
                transition: 'fill 0.15s, stroke-width 0.15s',
              }}
              onMouseEnter={() => setHoveredId(layer.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={(e) => {
                if (!layer.navigateTo) return
                e.stopPropagation()
                navigateToDrawing(layer.navigateTo)
              }}
            />

            {/* 호버 레이블 */}
            {isHovered && layer.label && (() => {
              const { cx, cy } = calcCentroid(transformed)
              // 텍스트 길이에 따른 배경 박스 너비 동적 계산
              const labelW = Math.max(layer.label.length * 8 + 16, 60)
              return (
                <g pointerEvents="none">
                  <rect
                    x={cx - labelW / 2} y={cy - 13}
                    width={labelW} height={22}
                    rx={6}
                    fill="rgba(15,23,42,0.85)"
                  />
                  <text
                    x={cx} y={cy + 3}
                    textAnchor="middle"
                    fill="white"
                    fontSize={11}
                    fontWeight={600}
                    fontFamily="system-ui, sans-serif"
                  >
                    {layer.label}
                  </text>
                </g>
              )
            })()}
          </g>
        )
      })}
    </svg>
  )
}