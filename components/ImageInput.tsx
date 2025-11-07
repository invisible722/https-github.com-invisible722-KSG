import React, { useState, useRef } from 'react';
import { fileToBase64 } from '../utils/imageUtils';

interface ImageInputProps {
  onImageSelected: (base64: string | null, mimeType: string | null) => void;
  isLoading: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageSelected, isLoading }) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
      try {
        const base64 = await fileToBase64(file);
        onImageSelected(base64, file.type);
      } catch (error) {
        console.error("Error converting file to base64:", error);
        onImageSelected(null, null);
      }
    } else {
      setImagePreviewUrl(null);
      onImageSelected(null, null);
    }
  };

  const handleClear = () => {
    setImagePreviewUrl(null);
    onImageSelected(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the input
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-full max-w-xl mx-auto mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Upload or Take Photo of Business Card</h2>
      
      {imagePreviewUrl && (
        <div className="mb-4 relative">
          <img src={imagePreviewUrl} alt="Business Card Preview" className="max-w-xs md:max-w-sm lg:max-w-md h-auto rounded-lg border border-gray-200 shadow-sm" />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs font-bold hover:bg-red-600 transition-colors"
            title="Remove Image"
            disabled={isLoading}
          >
            &times;
          </button>
        </div>
      )}

      {!imagePreviewUrl && (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <label className="flex-1 cursor-pointer bg-blue-600 text-white py-3 px-6 rounded-lg text-center text-lg font-medium shadow hover:bg-blue-700 transition-colors duration-200">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              disabled={isLoading}
            />
            Chụp Ảnh
          </label>
          <label className="flex-1 cursor-pointer bg-green-600 text-white py-3 px-6 rounded-lg text-center text-lg font-medium shadow hover:bg-green-700 transition-colors duration-200">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              disabled={isLoading}
            />
            Tải Ảnh Lên
          </label>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center text-blue-600">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xử lý ảnh...
        </div>
      )}
    </div>
  );
};

export default ImageInput;
