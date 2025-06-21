export interface BrandData {
    brand_id: string;
    brand_name: string;
    description?: string;
    platforms?: string[];
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