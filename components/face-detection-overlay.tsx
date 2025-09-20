"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scan, Users, Eye, EyeOff } from "lucide-react"
import { detectFacesInImage, type FaceDetection } from "@/lib/face-detection"
import { useToast } from "@/hooks/use-toast"

interface FaceDetectionOverlayProps {
  photoUrl: string
  photoId: string
  onAnalysisComplete?: (faces: FaceDetection[]) => void
}

export function FaceDetectionOverlay({ photoUrl, photoId, onAnalysisComplete }: FaceDetectionOverlayProps) {
  const [faces, setFaces] = useState<FaceDetection[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [showFaces, setShowFaces] = useState(true)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const analyzeFaces = async () => {
    if (!imageRef.current) return

    setAnalyzing(true)
    try {
      const detectedFaces = await detectFacesInImage(imageRef.current)
      setFaces(detectedFaces)

      // Send results to server
      if (detectedFaces.length > 0) {
        const response = await fetch("/api/photos/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photoId,
            faces: detectedFaces.map((face) => ({
              ...face,
              descriptor: face.descriptor ? Array.from(face.descriptor) : null,
            })),
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to save analysis")
        }

        toast({
          title: "Analysis complete",
          description: `Detected ${detectedFaces.length} face(s)`,
        })
      } else {
        toast({
          title: "No faces detected",
          description: "No faces were found in this photo",
        })
      }

      onAnalysisComplete?.(detectedFaces)
    } catch (error) {
      console.error("Face detection error:", error)
      toast({
        title: "Analysis failed",
        description: "Failed to analyze faces in this photo",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const drawFaceBoxes = () => {
    if (!canvasRef.current || !imageRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match image
    canvas.width = imageRef.current.naturalWidth
    canvas.height = imageRef.current.naturalHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!showFaces) return

    // Draw face boxes
    faces.forEach((face, index) => {
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 3
      ctx.strokeRect(face.x, face.y, face.width, face.height)

      // Draw face number
      ctx.fillStyle = "#3b82f6"
      ctx.font = "16px Arial"
      ctx.fillText(`${index + 1}`, face.x + 5, face.y + 20)

      // Draw confidence score
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(face.x, face.y - 25, 80, 20)
      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.fillText(`${Math.round(face.confidence * 100)}%`, face.x + 5, face.y - 10)
    })
  }

  useEffect(() => {
    drawFaceBoxes()
  }, [faces, showFaces])

  return (
    <div className="relative">
      <div className="relative inline-block">
        <img
          ref={imageRef}
          src={photoUrl || "/placeholder.svg"}
          alt="Photo for analysis"
          className="max-w-full h-auto"
          onLoad={() => drawFaceBoxes()}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ transform: "scale(1)", transformOrigin: "top left" }}
        />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Button onClick={analyzeFaces} disabled={analyzing} size="sm">
          <Scan className="w-4 h-4 mr-2" />
          {analyzing ? "Analyzing..." : "Detect Faces"}
        </Button>

        {faces.length > 0 && (
          <>
            <Button variant="outline" size="sm" onClick={() => setShowFaces(!showFaces)}>
              {showFaces ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showFaces ? "Hide" : "Show"} Faces
            </Button>

            <Badge variant="secondary">
              <Users className="w-3 h-3 mr-1" />
              {faces.length} face{faces.length !== 1 ? "s" : ""}
            </Badge>
          </>
        )}
      </div>
    </div>
  )
}
