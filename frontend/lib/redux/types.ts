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