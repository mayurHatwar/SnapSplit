"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Images, Trash2, Download, Share2, Users, Scan, Calendar, FileImage } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PhotoSortControls, type SortOption, type ViewMode, type FilterOption } from "./photo-sort-controls"
import { PhotoAnalysisDialog } from "./photo-analysis-dialog"
import { SharePhotoDialog } from "./share-photo-dialog"
import { useToast } from "@/hooks/use-toast"

interface Photo {
  id: string
  filename: string
  url: string
  size: number
  mime_type: string
  created_at: string
  analyzed_at?: string | null
  face_count?: number
}

interface EnhancedPhotoGridProps {
  photos: Photo[]
  onPhotoDeleted?: () => void
}

export function EnhancedPhotoGrid({ photos, onPhotoDeleted }: EnhancedPhotoGridProps) {
  const [deletingPhoto, setDeletingPhoto] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const { toast } = useToast()

  // Sort and filter photos
  const processedPhotos = useMemo(() => {
    let filtered = photos

    // Apply filters
    switch (filterBy) {
      case "with-faces":
        filtered = photos.filter((photo) => (photo.face_count || 0) > 0)
        break
      case "no-faces":
        filtered = photos.filter((photo) => photo.analyzed_at && (photo.face_count || 0) === 0)
        break
      case "analyzed":
        filtered = photos.filter((photo) => photo.analyzed_at)
        break
      case "unanalyzed":
        filtered = photos.filter((photo) => !photo.analyzed_at)
        break
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "name-asc":
          return a.filename.localeCompare(b.filename)
        case "name-desc":
          return b.filename.localeCompare(a.filename)
        case "faces-desc":
          return (b.face_count || 0) - (a.face_count || 0)
        case "faces-asc":
          return (a.face_count || 0) - (b.face_count || 0)
        case "size-desc":
          return b.size - a.size
        case "size-asc":
          return a.size - b.size
        default:
          return 0
      }
    })
  }, [photos, sortBy, filterBy])

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
    <div>
      <PhotoSortControls
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        totalPhotos={photos.length}
        filteredCount={processedPhotos.length}
      />

      {processedPhotos.length === 0 ? (
        <div className="text-center py-12">
          <Images className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No photos match your filter</h3>
          <p className="text-muted-foreground">Try adjusting your filter settings to see more photos</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {processedPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />

                {(photo.face_count || 0) > 0 && (
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    <Users className="w-3 h-3 mr-1" />
                    {photo.face_count}
                  </Badge>
                )}

                {!photo.analyzed_at && (
                  <Badge className="absolute top-2 right-2" variant="outline">
                    <Scan className="w-3 h-3 mr-1" />
                    Analyze
                  </Badge>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <PhotoAnalysisDialog photo={photo}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Scan className="w-4 h-4 mr-2" />
                          Analyze Faces
                        </DropdownMenuItem>
                      </PhotoAnalysisDialog>
                      <DropdownMenuItem onClick={() => handleDownloadPhoto(photo)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <SharePhotoDialog photo={photo}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                      </SharePhotoDialog>
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
      ) : (
        // List view
        <div className="space-y-2">
          {processedPhotos.map((photo) => (
            <Card key={photo.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt={photo.filename}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{photo.filename}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(photo.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileImage className="w-3 h-3" />
                      {formatFileSize(photo.size)}
                    </span>
                    {(photo.face_count || 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {photo.face_count} face{photo.face_count !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!photo.analyzed_at && (
                    <Badge variant="outline">
                      <Scan className="w-3 h-3 mr-1" />
                      Analyze
                    </Badge>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <PhotoAnalysisDialog photo={photo}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Scan className="w-4 h-4 mr-2" />
                          Analyze Faces
                        </DropdownMenuItem>
                      </PhotoAnalysisDialog>
                      <DropdownMenuItem onClick={() => handleDownloadPhoto(photo)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <SharePhotoDialog photo={photo}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                      </SharePhotoDialog>
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
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
