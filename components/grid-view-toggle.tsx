'use client'

import { cn } from '@/lib/utils'

export type GridViewMode = '5' | '4' | '3' | '2' | '1'

interface GridViewToggleProps {
  className?: string
  currentView?: GridViewMode
  onViewChange?: (view: GridViewMode) => void
}

export function GridViewToggle({ className, currentView = '4', onViewChange }: GridViewToggleProps) {
  const getBtnClass = (view: GridViewMode) => 
    cn(
      "p-1 transition-all duration-300 rounded-sm flex items-center justify-center border",
      currentView === view 
        ? "text-foreground border-camel/40 bg-camel/5" 
        : "text-foreground/40 border-transparent hover:text-camel hover:bg-neutral-50"
    )

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* 5 columns */}
      <button 
        onClick={() => onViewChange?.('5')}
        className={getBtnClass('5')} 
        aria-label="5 columnas"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="6" width="3" height="4" />
          <rect x="6" y="6" width="3" height="4" />
          <rect x="10" y="6" width="3" height="4" />
          <rect x="14" y="6" width="3" height="4" />
          <rect x="18" y="6" width="3" height="4" />
          <rect x="2" y="12" width="3" height="4" />
          <rect x="6" y="12" width="3" height="4" />
          <rect x="10" y="12" width="3" height="4" />
          <rect x="14" y="12" width="3" height="4" />
          <rect x="18" y="12" width="3" height="4" />
        </svg>
      </button>

      {/* 4 columns */}
      <button 
        onClick={() => onViewChange?.('4')}
        className={getBtnClass('4')} 
        aria-label="4 columnas"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="6" width="3.5" height="4" />
          <rect x="7.5" y="6" width="3.5" height="4" />
          <rect x="12" y="6" width="3.5" height="4" />
          <rect x="16.5" y="6" width="3.5" height="4" />
          <rect x="3" y="12" width="3.5" height="4" />
          <rect x="7.5" y="12" width="3.5" height="4" />
          <rect x="12" y="12" width="3.5" height="4" />
          <rect x="16.5" y="12" width="3.5" height="4" />
        </svg>
      </button>

      {/* 3 columns */}
      <button 
        onClick={() => onViewChange?.('3')}
        className={getBtnClass('3')} 
        aria-label="3 columnas"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="6" width="4.5" height="4" />
          <rect x="9.5" y="6" width="4.5" height="4" />
          <rect x="15" y="6" width="4.5" height="4" />
          <rect x="4" y="12" width="4.5" height="4" />
          <rect x="9.5" y="12" width="4.5" height="4" />
          <rect x="15" y="12" width="4.5" height="4" />
        </svg>
      </button>

      {/* 2 columns / list */}
      <button 
        onClick={() => onViewChange?.('2')}
        className={getBtnClass('2')} 
        aria-label="Vista detallada"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="6" width="6" height="4" />
          <rect x="12" y="6" width="8" height="1.5" />
          <rect x="12" y="8.5" width="6" height="1.5" />
          
          <rect x="4" y="12" width="6" height="4" />
          <rect x="12" y="12" width="8" height="1.5" />
          <rect x="12" y="14.5" width="6" height="1.5" />
        </svg>
      </button>

      {/* 1 column / small list */}
      <button 
        onClick={() => onViewChange?.('1')}
        className={getBtnClass('1')} 
        aria-label="Vista lista"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="6" width="3" height="3" />
          <rect x="9" y="6" width="11" height="1" />
          <rect x="9" y="8" width="8" height="1" />
          
          <rect x="4" y="11" width="3" height="3" />
          <rect x="9" y="11" width="11" height="1" />
          <rect x="9" y="13" width="8" height="1" />
          
          <rect x="4" y="16" width="3" height="3" />
          <rect x="9" y="16" width="11" height="1" />
          <rect x="9" y="18" width="8" height="1" />
        </svg>
      </button>
    </div>
  )
}
