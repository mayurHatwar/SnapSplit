import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AlbumPageClient } from "./album-page-client"

interface AlbumPageProps {
  params: Promise<{ id: string }>
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch album details
  const { data: album, error: albumError } = await supabase
    .from("albums")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (albumError || !album) {
    redirect("/dashboard")
  }

  // Fetch photos in this album
  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("album_id", id)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  return <AlbumPageClient album={album} initialPhotos={photos || []} albumId={id} />
}
