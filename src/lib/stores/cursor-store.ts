import { create } from "zustand"

interface CursorState {
  position: { x: number; y: number }
  isHovering: boolean
  cursorVariant: "default" | "button" | "link" | "project" | "text" | "hero" | "about" | "skills" | "footer"
  isClicking: boolean
  trail: Array<{ x: number; y: number; id: number; timestamp: number }>
  currentSection: string

  // Actions
  updatePosition: (_position: { x: number; y: number }) => void
  setHovering: (_hovering: boolean) => void
  setCursorVariant: (
    _variant: "default" | "button" | "link" | "project" | "text" | "hero" | "about" | "skills" | "footer"
  ) => void
  setClicking: (_clicking: boolean) => void
  addTrailPoint: (_point: { x: number; y: number; id: number; timestamp: number }) => void
  clearTrail: () => void
  setCurrentSection: (_section: string) => void
}

export const useCursorStore = create<CursorState>(set => ({
  position: { x: 0, y: 0 },
  isHovering: false,
  cursorVariant: "default",
  isClicking: false,
  trail: [],
  currentSection: "default",

  updatePosition: position => set({ position }),

  setHovering: hovering => set({ isHovering: hovering }),

  setCursorVariant: variant => set({ cursorVariant: variant }),

  setClicking: clicking => set({ isClicking: clicking }),

  addTrailPoint: point =>
    set(state => {
      const now = Date.now()
      // Filter out old points for performance
      const filteredTrail = state.trail.filter(p => now - p.timestamp < 1000)
      return {
        trail: [...filteredTrail, point].slice(-12), // Keep more points for smoother trail
      }
    }),

  clearTrail: () => set({ trail: [] }),

  setCurrentSection: section => set({ currentSection: section }),
}))
