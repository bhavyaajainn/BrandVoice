export interface GenerateContentPayload {
  product_id: string;
  platform: string;
  media_type?: string;
  content_only?: boolean;
  media_only?: boolean;
  [key: string]: any; // For any additional dynamic properties
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ContentGenerationResponse {
  content?: string;
  media_url?: string;
  platform: string;
  product_id: string;
  timestamp: string;
}
