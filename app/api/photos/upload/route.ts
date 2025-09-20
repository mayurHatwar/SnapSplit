import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    debugger;
    console.log("user");
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const albumId = formData.get("albumId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!albumId) {
      return NextResponse.json({ error: "Album ID required" }, { status: 400 });
    }

    // Verify user owns the album
    const { data: album, error: albumError } = await supabase
      .from("albums")
      .select("id")
      .eq("id", albumId)
      .eq("user_id", user.id)
      .single();

    if (albumError || !album) {
      return NextResponse.json(
        { error: "Album not found or unauthorized" },
        { status: 404 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${user.id}/${albumId}/${timestamp}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    // Save photo metadata to database
    const { data: photo, error: photoError } = await supabase
      .from("photos")
      .insert({
        album_id: albumId,
        user_id: user.id,
        url: blob.url,
        filename: file.name,
        size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (photoError) {
      // If database insert fails, clean up the blob
      await fetch(`/api/photos/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blob.url }),
      });
      return NextResponse.json(
        { error: "Failed to save photo metadata" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      photo,
      message: "Photo uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
