interface ToolbarButtonProps {
  active: boolean
  onClick: () => void
  title: string
  icon: React.ReactNode
}

export function ToolbarButton({ active, onClick, title, icon }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '6px 12px', marginLeft: '10px', borderRadius: '8px',
        border: active ? '1px solid transparent' : '1px solid #e5e7eb',
        background: active ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : '#ffffff',
        color: active ? '#ffffff' : '#6b7280',
        fontSize: '12px', fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.15s',
        boxShadow: active
          ? '0 2px 8px rgba(109,40,217,0.25)'
          : '0 1px 2px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#d8b4fe'
            ; (e.currentTarget as HTMLButtonElement).style.color = '#7c3aed'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'
            ; (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'
        }
      }}
    >
      {icon}
      {title}
    </button>
  )
}