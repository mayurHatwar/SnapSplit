import { createClient } from "@/lib/supabase/server"

export type NotificationType = "photo_upload" | "face_detected" | "album_shared" | "analysis_complete" | "album_created"

export interface NotificationData {
  photoId?: string
  albumId?: string
  faceCount?: number
  albumName?: string
  [key: string]: any
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data?: NotificationData
  read: boolean
  created_at: string
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: NotificationData,
) {
  const supabase = await createClient()

  const { data: notification, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      type,
      title,
      message,
      data,
    })
    .select()
    .single()

  if (error) {
    console.error("Failed to create notification:", error)
    return null
  }

  return notification
}

export async function getUserNotifications(userId: string, limit = 50) {
  const supabase = await createClient()

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Failed to fetch notifications:", error)
    return []
  }

  return notifications as Notification[]
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

  if (error) {
    console.error("Failed to mark notification as read:", error)
    return false
  }

  return true
}

export async function markAllNotificationsAsRead(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false)

  if (error) {
    console.error("Failed to mark all notifications as read:", error)
    return false
  }

  return true
}

export async function getUnreadNotificationCount(userId: string) {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false)

  if (error) {
    console.error("Failed to get unread count:", error)
    return 0
  }

  return count || 0
}

// Helper functions for creating specific notification types
export async function notifyPhotoUpload(userId: string, albumName: string, photoCount: number) {
  return createNotification(
    userId,
    "photo_upload",
    "Photos uploaded successfully",
    `${photoCount} photo${photoCount !== 1 ? "s" : ""} uploaded to "${albumName}"`,
    { albumName, photoCount },
  )
}

export async function notifyFaceDetection(userId: string, photoId: string, faceCount: number) {
  return createNotification(
    userId,
    "face_detected",
    "Face detection complete",
    `Detected ${faceCount} face${faceCount !== 1 ? "s" : ""} in your photo`,
    { photoId, faceCount },
  )
}

export async function notifyAnalysisComplete(userId: string, albumId: string, albumName: string, totalFaces: number) {
  return createNotification(
    userId,
    "analysis_complete",
    "Album analysis complete",
    `Found ${totalFaces} face${totalFaces !== 1 ? "s" : ""} across all photos in "${albumName}"`,
    { albumId, albumName, totalFaces },
  )
}

export async function notifyAlbumCreated(userId: string, albumId: string, albumName: string) {
  return createNotification(userId, "album_created", "Album created", `New album "${albumName}" has been created`, {
    albumId,
    albumName,
  })
}
