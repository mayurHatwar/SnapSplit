"use client"

import { PhotoUploadDialog } from "./photo-upload-dialog"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface UploadPhotosButtonProps {
  albumId: string
  onUploadComplete?: () => void
}

export function UploadPhotosButton({ albumId, onUploadComplete }: UploadPhotosButtonProps) {
  return (
    <PhotoUploadDialog albumId={albumId} onUploadComplete={onUploadComplete}>
      <Button>
        <Upload className="w-4 h-4 mr-2" />
        Upload Photos
      </Button>
    </PhotoUploadDialog>
  )
}
