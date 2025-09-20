"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, Edit, ArrowLeft, Calendar, User } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Album {
  id: string
  name: string
  description: string | null
  cover_photo_url: string | null
  is_shared: boolean
  created_at: string
  updated_at: string
}

interface AlbumHeaderProps {
  album: Album
}

export function AlbumHeader({ album }: AlbumHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Albums
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center overflow-hidden">
          {album.cover_photo_url ? (
            <img
              src={album.cover_photo_url || "/placeholder.svg"}
              alt={album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No cover photo</p>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{album.name}</h1>
              {album.description && <p className="text-muted-foreground text-lg">{album.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              {album.is_shared && (
                <Badge variant="secondary">
                  <Share2 className="w-3 h-3 mr-1" />
                  Shared
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Created {formatDistanceToNow(new Date(album.created_at), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  )
}
