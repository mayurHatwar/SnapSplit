"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Share2, Edit, Trash2, Images, Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

interface AlbumGridProps {
  albums: Album[]
}

export function AlbumGrid({ albums }: AlbumGridProps) {
  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <Images className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No albums yet</h3>
        <p className="text-muted-foreground mb-6">Create your first album to start organizing your photos</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {albums.map((album) => (
        <Card key={album.id} className="group hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <Link href={`/album/${album.id}`}>
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                {album.cover_photo_url ? (
                  <img
                    src={album.cover_photo_url || "/placeholder.svg"}
                    alt={album.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Images className="w-12 h-12 text-muted-foreground" />
                )}
                {album.is_shared && (
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    <Share2 className="w-3 h-3 mr-1" />
                    Shared
                  </Badge>
                )}
              </div>
            </Link>
          </CardContent>
          <CardFooter className="p-4">
            <div className="flex-1 min-w-0">
              <Link href={`/album/${album.id}`}>
                <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">{album.name}</h3>
              </Link>
              {album.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{album.description}</p>
              )}
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDistanceToNow(new Date(album.created_at), { addSuffix: true })}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
