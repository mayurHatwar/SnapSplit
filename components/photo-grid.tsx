"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Images, Trash2, Download, Share2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Photo {
  id: string
  filename: string
  url: string
  size: number
  mime_type: string
  created_at: string
}

interface PhotoGridProps {
  photos: Photo[]
  onPhotoDeleted?: () => void
}

export function PhotoGrid({ photos, onPhotoDeleted }: PhotoGridProps) {
  const [deletingPhoto, setDeletingPhoto] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDeletePhoto = async (photoId: string) => {
    setDeletingPhoto(photoId)
    try {
      const response = await fetch("/api/photos/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete photo")
      }

      toast({
        title: "Photo deleted",
        description: "The photo has been removed from your album",
      })

      onPhotoDeleted?.()
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete the photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingPhoto(null)
    }
  }

  const handleDownloadPhoto = (photo: Photo) => {
    const link = document.createElement("a")
    link.href = photo.url
    link.download = photo.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSharePhoto = async (photo: Photo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.filename,
          url: photo.url,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(photo.url)
      toast({
        title: "Link copied",
        description: "Photo URL copied to clipboard",
      })
    }
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <Images className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No photos yet</h3>
        <p className="text-muted-foreground mb-6">
          Upload your first photos to get started with AI-powered organization
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
            <img
              src={photo.url || "/placeholder.svg"}
              alt={photo.filename}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleDownloadPhoto(photo)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSharePhoto(photo)}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeletePhoto(photo.id)}
                    disabled={deletingPhoto === photo.id}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deletingPhoto === photo.id ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="p-2">
            <p className="text-xs text-muted-foreground truncate" title={photo.filename}>
              {photo.filename}
            </p>
            <p className="text-xs text-muted-foreground">{new Date(photo.created_at).toLocaleDateString()}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
