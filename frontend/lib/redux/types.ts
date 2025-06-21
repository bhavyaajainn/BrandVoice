export interface BrandData {
  brand_id: string;
  brand_name: string;
  description?: string;
  platforms?: string;
  logo?: File | null;
  user_id?: string;
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

export interface BrandAction {
  type: string;
  payload?: any;
}

export interface AuthAction {
  type: string;
  payload?: any;
}

export interface PlatformInfo {
  product_name: string;
  description: string;
  category: string;
}

export interface ProductInfo {
  product_id: string;
  platform: string;
  media_type: string;
  content_only?: boolean;
  media_only?: boolean;
}

export interface ProductState {
  loading: boolean;
  error: string | null;
  data: ProductInfoResponse;
  success: boolean;
}

export interface PlatformState {
  loading: boolean;
  error: string | null;
  data: PlatformInfoResponse;
  success: boolean;
}

export interface ProductInfoResponse {
  product_id: string;
  brand_id: string;
  product_name: string;
  description: string;
  category: string;
  timestamp: string;
}

export interface PlatformInfoResponse {
  product_id: string,
  platform: string,
  marketing_content: string[],
  media_type: string,
  media_data: string[]
}

export interface MediaRequestType{
  product_id: string,
  platform: string,
}

export interface TextContentResponse{
  product_id: string,
  platform: string,
  product_name: string,
  brand_id: string,
  marketing_content: object,
  timestamp: string
}

export interface MediaContentResponse{
  product_id: string,
  platform: string,
  product_name: string,
  brand_id: string,
  social_media_image_url: string,
  social_media_carousel_urls: string[],
  social_media_video_url: string,
  media_type: string,
  timestamp: string
}

export interface SaveContentRequest {
  product_id: string;
  platform: string;
  media_type?: string;
  file?: File;
  carousel_files?: File[];
  video_file?: File;
  content?: object;
}

export interface SaveContentResponse {
  product_id: string;
  platform: string;
  product_name: string;
  brand_id: string;
  marketing_content: object;
  social_media_image_url: string;
  social_media_carousel_urls: string[];
  social_media_video_url: string;
  media_type: string;
  timestamp: string;
}

export interface TextContentState {
  loading: boolean;
  error: string | null;
  data: TextContentResponse | null;
  success: boolean;
}

export interface MediaContentState {
  loading: boolean;
  error: string | null;
  data: MediaContentResponse | null;
  success: boolean;
}

export interface SaveContentState {
  loading: boolean;
  error: string | null;
  data: SaveContentResponse | null;
  success: boolean;
}