import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { photoId, url } = await request.json()

    if (!photoId && !url) {
      return NextResponse.json({ error: "Photo ID or URL required" }, { status: 400 })
    }

    // If photoId provided, get photo details and verify ownership
    if (photoId) {
      const { data: photo, error: photoError } = await supabase
        .from("photos")
        .select("url, user_id")
        .eq("id", photoId)
        .single()

      if (photoError || !photo) {
        return NextResponse.json({ error: "Photo not found" }, { status: 404 })
      }

      if (photo.user_id !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      // Delete from Vercel Blob
      await del(photo.url)

      // Delete from database
      await supabase.from("photos").delete().eq("id", photoId)
    } else if (url) {
      // Direct URL deletion (for cleanup purposes)
      await del(url)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
