import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FileText, ImageIcon, Video, Music, Archive, Badge } from "lucide-react"
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileText className="w-5 h-5 text-red-600" />
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <ImageIcon className="w-5 h-5 text-blue-600" />
    case "mp4":
    case "avi":
    case "mov":
      return <Video className="w-5 h-5 text-purple-600" />
    case "mp3":
    case "wav":
      return <Music className="w-5 h-5 text-green-600" />
    case "zip":
    case "rar":
      return <Archive className="w-5 h-5 text-orange-600" />
    default:
      return <FileText className="w-5 h-5 text-gray-600" />
  }
}

export const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "twitter":
      return <Twitter className="w-4 h-4" />
    case "facebook":
      return <Facebook className="w-4 h-4" />
    case "instagram":
      return <Instagram className="w-4 h-4" />
    case "linkedin":
      return <Linkedin className="w-4 h-4" />
    default:
      return <Globe className="w-4 h-4" />
  }
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "scheduled":
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>
    case "published":
      return <Badge className="bg-green-50 text-green-700 border-green-200">Published</Badge>
    case "failed":
      return <Badge className="bg-red-50 text-red-700 border-red-200">Failed</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}