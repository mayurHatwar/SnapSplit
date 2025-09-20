"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FaceDetectionOverlay } from "./face-detection-overlay"
import type { FaceDetection } from "@/lib/face-detection"

interface PhotoAnalysisDialogProps {
  photo: {
    id: string
    url: string
    filename: string
  }
  children: React.ReactNode
}

export function PhotoAnalysisDialog({ photo, children }: PhotoAnalysisDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [faces, setFaces] = useState<FaceDetection[]>([])

  const handleAnalysisComplete = (detectedFaces: FaceDetection[]) => {
    setFaces(detectedFaces)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Face Detection Analysis</DialogTitle>
          <DialogDescription>Analyze faces in "{photo.filename}" using AI-powered detection</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <FaceDetectionOverlay photoUrl={photo.url} photoId={photo.id} onAnalysisComplete={handleAnalysisComplete} />
        </div>

        {faces.length > 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Detection Results:</h4>
            <div className="space-y-2">
              {faces.map((face, index) => (
                <div key={face.id} className="text-sm">
                  <span className="font-medium">Face {index + 1}:</span>
                  <span className="ml-2 text-muted-foreground">Confidence: {Math.round(face.confidence * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
