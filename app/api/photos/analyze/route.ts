import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
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

    const { photoId, faces } = await request.json()

    if (!photoId || !faces) {
      return NextResponse.json({ error: "Photo ID and faces data required" }, { status: 400 })
    }

    // Verify user owns the photo
    const { data: photo, error: photoError } = await supabase
      .from("photos")
      .select("id, user_id")
      .eq("id", photoId)
      .eq("user_id", user.id)
      .single()

    if (photoError || !photo) {
      return NextResponse.json({ error: "Photo not found or unauthorized" }, { status: 404 })
    }

    // Store face detection results
    const faceInserts = faces.map((face: any) => ({
      photo_id: photoId,
      user_id: user.id,
      x: face.x,
      y: face.y,
      width: face.width,
      height: face.height,
      confidence: face.confidence,
      landmarks: face.landmarks,
      descriptor: face.descriptor ? Array.from(face.descriptor) : null,
    }))

    const { data: insertedFaces, error: faceError } = await supabase.from("faces").insert(faceInserts).select()

    if (faceError) {
      console.error("Face insert error:", faceError)
      return NextResponse.json({ error: "Failed to save face data" }, { status: 500 })
    }

    // Update photo to mark as analyzed
    await supabase
      .from("photos")
      .update({
        analyzed_at: new Date().toISOString(),
        face_count: faces.length,
      })
      .eq("id", photoId)

    return NextResponse.json({
      success: true,
      faces: insertedFaces,
      message: `Detected ${faces.length} face(s)`,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
