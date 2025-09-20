"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Mail, MessageSquare, Share2, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SharePhotoDialogProps {
  photo: {
    id: string
    url: string
    filename: string
  }
  children: React.ReactNode
}

export function SharePhotoDialog({ photo, children }: SharePhotoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareMethod, setShareMethod] = useState<"link" | "email" | "social">("link")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [message, setMessage] = useState("")
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()

  const shareUrl = photo.url
  const shareText = `Check out this photo: ${photo.filename}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied",
        description: "Photo URL copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.filename,
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      handleCopyLink()
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Shared photo: ${photo.filename}`)
    const body = encodeURIComponent(`${message}\n\nView photo: ${shareUrl}`)
    const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`
    window.open(mailtoUrl)
  }

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareText)

    let shareUrlPlatform = ""

    switch (platform) {
      case "twitter":
        shareUrlPlatform = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case "facebook":
        shareUrlPlatform = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case "whatsapp":
        shareUrlPlatform = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        break
      case "telegram":
        shareUrlPlatform = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
        break
    }

    if (shareUrlPlatform) {
      window.open(shareUrlPlatform, "_blank", "width=600,height=400")
    }
  }

  const generateQRCode = async () => {
    setGenerating(true)
    try {
      // Generate QR code using a free API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`

      // Create download link
      const link = document.createElement("a")
      link.href = qrUrl
      link.download = `qr-${photo.filename}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "QR Code generated",
        description: "QR code downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "QR Code failed",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Photo</DialogTitle>
          <DialogDescription>Share "{photo.filename}" with others</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share Method Selection */}
          <div>
            <Label htmlFor="share-method">Share Method</Label>
            <Select value={shareMethod} onValueChange={(value: any) => setShareMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="link">Direct Link</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {shareMethod === "link" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button onClick={handleCopyLink} size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleNativeShare} className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button onClick={generateQRCode} variant="outline" disabled={generating}>
                  <QrCode className="w-4 h-4 mr-2" />
                  {generating ? "Generating..." : "QR Code"}
                </Button>
              </div>
            </div>
          )}

          {shareMethod === "email" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Recipient Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={3}
                />
              </div>

              <Button onClick={handleEmailShare} disabled={!recipientEmail} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          )}

          {shareMethod === "social" && (
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => handleSocialShare("twitter")} variant="outline" className="w-full">
                Twitter
              </Button>
              <Button onClick={() => handleSocialShare("facebook")} variant="outline" className="w-full">
                Facebook
              </Button>
              <Button onClick={() => handleSocialShare("whatsapp")} variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button onClick={() => handleSocialShare("telegram")} variant="outline" className="w-full">
                Telegram
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
