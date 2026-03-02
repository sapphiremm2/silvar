'use client'

import { useEffect, useRef } from 'react'

export function ParticleBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const colors = ['#00f2ff', '#ff00c1', '#00ff88', '#ffffff']
    const sparks: HTMLDivElement[] = []

    for (let i = 0; i < 55; i++) {
      const spark = document.createElement('div')
      const size = Math.random() * 2.5 + 0.5
      const color = colors[Math.floor(Math.random() * colors.length)]
      const duration = Math.random() * 16 + 8
      const delay = -Math.random() * 16
      const dx = (Math.random() - 0.5) * 180

      spark.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        opacity: ${Math.random() * 0.5 + 0.15};
        --dx: ${dx}px;
        animation: drift ${duration}s linear ${delay}s infinite;
        pointer-events: none;
      `
      container.appendChild(spark)
      sparks.push(spark)
    }

    return () => sparks.forEach((s) => s.remove())
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  )
}
