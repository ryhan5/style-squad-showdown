const API_BASE_URL = 'http://localhost:8000/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.text();
    return { error: error || 'Something went wrong', status: response.status };
  }
  
  try {
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    return { error: 'Failed to parse response', status: response.status };
  }
}

export const api = {
  // Upload an image
  async uploadImage(file: File): Promise<ApiResponse<{ filename: string; url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      body: formData,
    });
    
    return handleResponse(response);
  },

  // Process virtual try-on
  async processTryOn(userImage: string, garmentImage: string): Promise<ApiResponse<{ result_url: string }>> {
    const response = await fetch(`${API_BASE_URL}/try-on`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_image: userImage,
        garment_image: garmentImage,
      }),
    });

    return handleResponse(response);
  },

  // Process virtual try-on with file uploads
  async processTryOnWithFiles(userFile: File, garmentFile: File): Promise<ApiResponse<{ result_url: string }>> {
    const formData = new FormData();
    formData.append('user_image_file', userFile);
    formData.append('garment_image_file', garmentFile);
    
    const response = await fetch(`${API_BASE_URL}/try-on`, {
      method: 'POST',
      body: formData,
    });
    
    return handleResponse(response);
  },
};

export default api;
