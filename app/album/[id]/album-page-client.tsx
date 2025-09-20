"use client"

import { useState } from "react"
import { PhotoGrid } from "@/components/photo-grid"
import { AlbumHeader } from "@/components/album-header"
import { UploadPhotosButton } from "@/components/upload-photos-button"
import { createClient } from "@/lib/supabase/client"

interface Photo {
  id: string
  filename: string
  url: string
  size: number
  mime_type: string
  created_at: string
}

interface Album {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface AlbumPageClientProps {
  album: Album
  initialPhotos: Photo[]
  albumId: string
}

export function AlbumPageClient({ album, initialPhotos, albumId }: AlbumPageClientProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const supabase = createClient()

  const refreshPhotos = async () => {
    const { data } = await supabase
      .from("photos")
      .select("*")
      .eq("album_id", albumId)
      .order("created_at", { ascending: false })

    if (data) {
      setPhotos(data)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <AlbumHeader album={album} />

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">Photos ({photos.length})</h2>
        <UploadPhotosButton albumId={albumId} onUploadComplete={refreshPhotos} />
      </div>

      <PhotoGrid photos={photos} onPhotoDeleted={refreshPhotos} />
    </div>
  )
}
