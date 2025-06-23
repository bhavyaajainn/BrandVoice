import { FileText, ImageIcon, Video, Music, Archive, Badge, CalendarDays, CheckCircle, AlertCircle, Youtube } from "lucide-react"
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react"

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
    case "youtube":
      return <Youtube className="w-4 h-4" />
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
      return <Badge>Unknown</Badge>
  }
}

export const getDataByFilter = (timeFilter : any, viewsData : any, monthlyData : any) => {
  switch (timeFilter) {
    case "day":
      return viewsData.slice(-1)
    case "week":
      return viewsData
    case "month":
      return monthlyData.slice(-4)
    case "year":
      return monthlyData
    default:
      return viewsData
  }
}

export const getTotalViews = (timeFilter : any, viewsData : any, monthlyData : any) => {
  const data = getDataByFilter(timeFilter, viewsData, monthlyData)
  return data.reduce((sum : any, item : any) => sum + item.views, 0)
}

export const getTotalClicks = (timeFilter : any, viewsData : any, monthlyData : any) => {
  const data = getDataByFilter(timeFilter, viewsData, monthlyData)
  return data.reduce((sum : any, item : any) => sum + item.clicks, 0)
}

export const getClickThroughRate = (timeFilter : any, viewsData : any, monthlyData : any) => {
  const totalViews = getTotalViews(timeFilter, viewsData, monthlyData)
  const totalClicks = getTotalClicks(timeFilter, viewsData, monthlyData)
  return totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : "0"
}

export const getTabIcon = (tab: string) => {
  switch (tab) {
      case "upcoming":
          return <CalendarDays className="w-4 h-4 mr-2" />
      case "published":
          return <CheckCircle className="w-4 h-4 mr-2" />
      case "failed":
          return <AlertCircle className="w-4 h-4 mr-2" />
      default:
          return null
  }
}