export interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  isIntegrated: boolean
  fields: {
    name: string
    label: string
    type: string
    required: boolean
    placeholder: string
    description?: string
  }[]
  color: string
}

export interface ScheduledPost {
  id: string
  contentId: string
  contentTitle: string
  platforms: string[]
  scheduledDate: Date
  timezone: string
  status: "scheduled" | "published" | "failed"
}

export interface ContentItem {
  id: string
  title: string
  type: string
  preview: string
  platforms: string[]
}

export interface BrandFile {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  url: string
}

// lib/redux/types.ts
export interface BrandData {
  brand_id: string;
  brand_name: string;
  description?: string;
  platforms?: string;
  logo?: File | null;
}

export interface BrandResponse {
  brand_id: string;
  brand_name: string;
  description: string;
  logo_url: string;
  marketing_platforms: string[];
  timestamp: string;
}

export interface BrandState {
  loading: boolean;
  error: string | null;
  brand: BrandResponse | null;
  success: boolean;
}

export interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Action types
export interface BrandAction {
  type: string;
  payload?: any;
}

export interface AuthAction {
  type: string;
  payload?: any;
}