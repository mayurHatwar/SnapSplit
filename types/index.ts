export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  face_profile_url?: string
  created_at: string
  updated_at: string
}

export interface Album {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  updated_at: string
  invite_code: string
  is_public: boolean
}

export interface Photo {
  id: string
  album_id: string
  uploader_id: string
  url: string
  thumbnail_url?: string
  filename: string
  file_size: number
  width: number
  height: number
  faces_detected: FaceDetection[]
  processed: boolean
  created_at: string
}

export interface FaceDetection {
  id: string
  photo_id: string
  user_id?: string
  bounding_box: {
    x: number
    y: number
    width: number
    height: number
  }
  confidence: number
  embedding: number[]
  verified: boolean
}

export interface AlbumMember {
  id: string
  album_id: string
  user_id: string
  role: "owner" | "admin" | "member"
  joined_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: "new_photos" | "album_invite" | "face_detected"
  title: string
  message: string
  data: Record<string, any>
  read: boolean
  created_at: string
}
