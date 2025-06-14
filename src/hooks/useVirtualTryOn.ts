import { useState } from 'react';
import { api } from '@/lib/api';

export interface TryOnState {
  userImage: string | null;
  garmentImage: string | null;
  resultImage: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useVirtualTryOn = () => {
  const [state, setState] = useState<TryOnState>({
    userImage: null,
    garmentImage: null,
    resultImage: null,
    isLoading: false,
    error: null,
  });

  const uploadImage = async (file: File, type: 'user' | 'garment') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await api.uploadImage(file);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        const imageUrl = `http://localhost:8000/uploads/${response.data.filename}`;
        setState(prev => ({
          ...prev,
          [type === 'user' ? 'userImage' : 'garmentImage']: imageUrl,
        }));
        return imageUrl;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const processTryOn = async (userFile: File, garmentFile: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // First upload both images
      await uploadImage(userFile, 'user');
      await uploadImage(garmentFile, 'garment');
      
      // Then process the try-on
      const response = await api.processTryOnWithFiles(userFile, garmentFile);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        const resultUrl = `http://localhost:8000${response.data.result_url}`;
        setState(prev => ({
          ...prev,
          resultImage: resultUrl,
        }));
        return resultUrl;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process try-on';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const reset = () => {
    setState({
      userImage: null,
      garmentImage: null,
      resultImage: null,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...state,
    uploadImage,
    processTryOn,
    reset,
  };
};
