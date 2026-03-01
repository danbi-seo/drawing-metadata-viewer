export function CanvasEmptyState() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8f9fa',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px', height: '48px', margin: '0 auto 12px',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px',
          opacity: 0.2,
        }}>
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              style={{ background: '#94a3b8', borderRadius: '3px' }}
            />
          ))}
        </div>
        <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af' }}>
          도면을 선택하세요
        </p>
      </div>
    </div>
  )
}