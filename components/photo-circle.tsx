"use client"

import Image from "next/image"
import type { CSSProperties } from "react"

interface PhotoCircleProps {
  src: string
  style: CSSProperties
  delay: number
}

export function PhotoCircle({ src, style, delay }: PhotoCircleProps) {
  return (
    <div
      className="photo-circle photo-float"
      style={{
        ...style,
        animationDelay: `${delay * -1}s`,
      }}
    >
      <Image src={src || "/placeholder.svg"} alt="Group photo" fill className="object-cover" sizes="80px" />
    </div>
  )
}
