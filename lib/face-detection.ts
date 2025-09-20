// Face detection utility using face-api.js
export interface FaceDetection {
  id: string
  x: number
  y: number
  width: number
  height: number
  confidence: number
  landmarks?: Array<{ x: number; y: number }>
  descriptor?: Float32Array
}

export interface PhotoAnalysis {
  photoId: string
  faces: FaceDetection[]
  processedAt: string
}

// Client-side face detection using face-api.js
export async function detectFacesInImage(imageElement: HTMLImageElement): Promise<FaceDetection[]> {
  try {
    // Dynamically import face-api.js to avoid SSR issues
    const faceapi = await import("@vladmandic/face-api")

    // Load models if not already loaded
    if (!faceapi.nets.tinyFaceDetector.isLoaded) {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ])
    }

    // Detect faces with landmarks and descriptors
    const detections = await faceapi
      .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors()

    return detections.map((detection, index) => ({
      id: `face_${Date.now()}_${index}`,
      x: detection.detection.box.x,
      y: detection.detection.box.y,
      width: detection.detection.box.width,
      height: detection.detection.box.height,
      confidence: detection.detection.score,
      landmarks: detection.landmarks?.positions.map((pos) => ({ x: pos.x, y: pos.y })),
      descriptor: detection.descriptor,
    }))
  } catch (error) {
    console.error("Face detection error:", error)
    return []
  }
}

// Compare face descriptors for similarity
export function compareFaces(descriptor1: Float32Array, descriptor2: Float32Array): number {
  if (!descriptor1 || !descriptor2) return 0

  // Calculate Euclidean distance
  let sum = 0
  for (let i = 0; i < descriptor1.length; i++) {
    sum += Math.pow(descriptor1[i] - descriptor2[i], 2)
  }

  const distance = Math.sqrt(sum)
  // Convert distance to similarity score (0-1, where 1 is identical)
  return Math.max(0, 1 - distance / 2)
}

// Group faces by similarity
export function groupFacesBySimilarity(faces: FaceDetection[], threshold = 0.6): FaceDetection[][] {
  const groups: FaceDetection[][] = []
  const processed = new Set<string>()

  for (const face of faces) {
    if (processed.has(face.id) || !face.descriptor) continue

    const group = [face]
    processed.add(face.id)

    for (const otherFace of faces) {
      if (processed.has(otherFace.id) || !otherFace.descriptor) continue

      const similarity = compareFaces(face.descriptor, otherFace.descriptor)
      if (similarity >= threshold) {
        group.push(otherFace)
        processed.add(otherFace.id)
      }
    }

    groups.push(group)
  }

  return groups
}
