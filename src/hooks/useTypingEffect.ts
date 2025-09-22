"use client"

import { useEffect, useState } from "react"

interface UseTypingEffectOptions {
  speed?: number
  delay?: number
  loop?: boolean
  deleteSpeed?: number
  deleteDelay?: number
}

export function useTypingEffect(texts: string[], options: UseTypingEffectOptions = {}) {
  const { speed = 100, delay = 1000, loop = true, deleteSpeed = 50, deleteDelay = 2000 } = options

  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (texts.length === 0) return

    const currentText = texts[currentIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting) {
      // Typing phase
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, speed)
      } else {
        // Finished typing current text
        if (loop && texts.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true)
          }, deleteDelay)
        } else {
          setIsComplete(true)
        }
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, deleteSpeed)
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false)
        setCurrentIndex(prev => (prev + 1) % texts.length)
        timeout = setTimeout(() => {
          // Small delay before starting to type next text
        }, delay)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, currentIndex, isDeleting, texts, speed, delay, loop, deleteSpeed, deleteDelay])

  return {
    displayText,
    isComplete,
    currentIndex,
    isDeleting,
  }
}

export function useSimpleTypingEffect(text: string, options: { speed?: number; delay?: number } = {}) {
  const { speed = 100, delay = 0 } = options
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    // Initial delay
    if (delay > 0 && displayText === "") {
      timeout = setTimeout(() => {
        setDisplayText(text.slice(0, 1))
      }, delay)
      return () => clearTimeout(timeout)
    }

    if (displayText.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1))
      }, speed)
    } else if (displayText.length === text.length) {
      setIsComplete(true)
    }

    return () => clearTimeout(timeout)
  }, [displayText, text, speed, delay])

  return {
    displayText,
    isComplete,
  }
}
