import { useRef, useState } from 'react';
import { useVirtualTryOn } from '@/hooks/useVirtualTryOn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, RefreshCw } from 'lucide-react';

export function VirtualTryOn() {
  const {
    userImage,
    garmentImage,
    resultImage,
    isLoading,
    error,
    uploadImage,
    processTryOn,
    reset,
  } = useVirtualTryOn();

  const userFileInputRef = useRef<HTMLInputElement>(null);
  const garmentFileInputRef = useRef<HTMLInputElement>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [garmentFile, setGarmentFile] = useState<File | null>(null);

  const handleUserFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUserFile(e.target.files[0]);
    }
  };

  const handleGarmentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGarmentFile(e.target.files[0]);
    }
  };

  const handleUploadUserImage = async () => {
    if (userFile) {
      await uploadImage(userFile, 'user');
    }
  };

  const handleUploadGarmentImage = async () => {
    if (garmentFile) {
      await uploadImage(garmentFile, 'garment');
    }
  };

  const handleTryOn = async () => {
    if (userFile && garmentFile) {
      await processTryOn(userFile, garmentFile);
    }
  };

  const handleReset = () => {
    setUserFile(null);
    setGarmentFile(null);
    if (userFileInputRef.current) userFileInputRef.current.value = '';
    if (garmentFileInputRef.current) garmentFileInputRef.current.value = '';
    reset();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Virtual Try-On</CardTitle>
          <CardDescription>
            Upload your photo and a garment to see how it looks on you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="user-image">Your Photo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="user-image"
                  type="file"
                  accept="image/*"
                  onChange={handleUserFileChange}
                  ref={userFileInputRef}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleUploadUserImage}
                  disabled={!userFile || isLoading}
                  size="icon"
                  variant="outline"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>
              {userImage && (
                <div className="mt-2">
                  <img
                    src={userImage}
                    alt="User preview"
                    className="h-40 w-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Garment Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="garment-image">Garment Photo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="garment-image"
                  type="file"
                  accept="image/*"
                  onChange={handleGarmentFileChange}
                  ref={garmentFileInputRef}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleUploadGarmentImage}
                  disabled={!garmentFile || isLoading}
                  size="icon"
                  variant="outline"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>
              {garmentImage && (
                <div className="mt-2">
                  <img
                    src={garmentImage}
                    alt="Garment preview"
                    className="h-40 w-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Result Preview */}
          {resultImage && (
            <div className="space-y-2">
              <Label>Result</Label>
              <div className="border rounded-md p-4">
                <img
                  src={resultImage}
                  alt="Virtual try-on result"
                  className="max-h-96 w-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={handleTryOn}
              disabled={!userFile || !garmentFile || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Try It On!'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
