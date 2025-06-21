
import { BrandData, BrandResponse } from '../redux/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://brandvoice-backend-172212688771.us-central1.run.app';

export class BrandService {
  static async createBrand(brandData: BrandData, token: string): Promise<BrandResponse> {
    const formData = new FormData();

    formData.append('brand_id', brandData.brand_id);
    formData.append('brand_name', brandData.brand_name);

    if (brandData.description) {
      formData.append('description', brandData.description);
    }

    if (brandData.platforms) {
      brandData.platforms.forEach((platform, index) => {
        formData.append(`platforms[${index}]`, platform);
      });
    }

    if (brandData.logo) {
      formData.append('logo', brandData.logo);
    }

    const response = await fetch(`${API_BASE_URL}/brand`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  static async getBrand(brandId: string, token: string): Promise<BrandResponse> {
    const response = await fetch(`${API_BASE_URL}/brand/${brandId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  static async updateBrand(brandId: string, brandData: Partial<BrandData>, token: string): Promise<BrandResponse> {
    const formData = new FormData();

    if (brandData.brand_name) {
      formData.append('brand_name', brandData.brand_name);
    }

    if (brandData.description) {
      formData.append('description', brandData.description);
    }

    if (brandData.platforms) {
      brandData.platforms.forEach((platform, index) => {
        formData.append(`platforms[${index}]`, platform);
      });
    }

    if (brandData.logo) {
      formData.append('logo', brandData.logo);
    }

    const response = await fetch(`${API_BASE_URL}/brand/${brandId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }
}