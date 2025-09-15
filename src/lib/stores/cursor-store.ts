import { create } from 'zustand'

interface CursorState {
  position: { x: number; y: number }
  isHovering: boolean
  cursorVariant: 'default' | 'button' | 'link' | 'project'
  isClicking: boolean
  trail: Array<{ x: number; y: number; id: number }>

  // Actions
  updatePosition: (position: { x: number; y: number }) => void
  setHovering: (hovering: boolean) => void
  setCursorVariant: (variant: 'default' | 'button' | 'link' | 'project') => void
  setClicking: (clicking: boolean) => void
  addTrailPoint: (point: { x: number; y: number; id: number }) => void
  clearTrail: () => void
}

export const useCursorStore = create<CursorState>(set => ({
  position: { x: 0, y: 0 },
  isHovering: false,
  cursorVariant: 'default',
  isClicking: false,
  trail: [],

  updatePosition: position => set({ position }),

  setHovering: hovering => set({ isHovering: hovering }),

  setCursorVariant: variant => set({ cursorVariant: variant }),

  setClicking: clicking => set({ isClicking: clicking }),

  addTrailPoint: point =>
    set(state => ({
      trail: [...state.trail, point].slice(-6), // Keep only last 6 points
    })),

  clearTrail: () => set({ trail: [] }),
}))
