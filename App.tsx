import React, { useState, useCallback, useEffect } from 'react';
import { BusinessCardData, IndustryGroup } from './types';
import { extractBusinessCardData } from './services/geminiService';
import ImageInput from './components/ImageInput';
import InfoDisplay from './components/InfoDisplay';

// Define initial empty business card data
const initialBusinessCardData: BusinessCardData = {
  name: '',
  title: '',
  company: '',
  phone: '',
  email: '',
};

const App: React.FC = () => {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<BusinessCardData>(initialBusinessCardData);
  const [industryGroup, setIndustryGroup] = useState<IndustryGroup>(IndustryGroup.OTHER);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback((base64: string | null) => {
    setSelectedImageBase64(base64);
    if (!base64) {
      setExtractedData(initialBusinessCardData);
      setIndustryGroup(IndustryGroup.OTHER);
      setNotes('');
      setError(null);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedImageBase64) {
      setExtractedData(initialBusinessCardData);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await extractBusinessCardData(selectedImageBase64);
      setExtractedData(data);
    } catch (err: any) {
      console.error("Error during data extraction:", err);
      setError(err.message || "Đã xảy ra lỗi khi trích xuất thông tin. Vui lòng thử lại.");
      setExtractedData(initialBusinessCardData); // Reset data on error
    } finally {
      setIsLoading(false);
    }
  }, [selectedImageBase64]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageBase64]); // Rerun extraction when a new image is selected

  const handleDataChange = useCallback((field: keyof BusinessCardData, value: string) => {
    setExtractedData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleIndustryGroupChange = useCallback((group: IndustryGroup) => {
    setIndustryGroup(group);
  }, []);

  const handleNotesChange = useCallback((newNotes: string) => {
    setNotes(newNotes);
  }, []);

  const handleShare = useCallback(async () => {
    const shareText = `Thông tin danh thiếp:
Tên: ${extractedData.name}
Chức vụ: ${extractedData.title}
Công ty: ${extractedData.company}
Điện thoại: ${extractedData.phone}
Email: ${extractedData.email}
Nhóm ngành nghề: ${industryGroup}
Ghi chú: ${notes || 'Không có'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Thông tin Danh thiếp',
          text: shareText,
        });
        alert('Đã chia sẻ thành công!');
      } catch (error) {
        console.error('Lỗi khi chia sẻ:', error);
        alert('Không thể chia sẻ. Vui lòng thử lại hoặc sao chép thủ công.');
      }
    } else {
      // Fallback for browsers that do not support navigator.share
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Thông tin đã được sao chép vào clipboard!');
      } catch (err) {
        console.error('Không thể sao chép vào clipboard:', err);
        alert('Trình duyệt của bạn không hỗ trợ chia sẻ hoặc sao chép. Vui lòng sao chép thủ công.');
      }
    }
  }, [extractedData, industryGroup, notes]);

  const isShareButtonVisible = selectedImageBase64 && !isLoading;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 text-gray-900 w-full p-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 mt-4 md:mt-8">Quản Lý Danh Thiếp</h1>

      <ImageInput onImageSelected={handleImageSelected} isLoading={isLoading} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-xl mx-auto mb-4" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {selectedImageBase64 && !isLoading && (
        <InfoDisplay
          extractedData={extractedData}
          onDataChange={handleDataChange}
          industryGroup={industryGroup}
          onIndustryGroupChange={handleIndustryGroupChange}
          notes={notes}
          onNotesChange={handleNotesChange}
          isLoading={isLoading}
        />
      )}

      {isShareButtonVisible && (
        <div className="sticky bottom-0 w-full max-w-xl mx-auto p-4 bg-white border-t border-gray-200 shadow-lg mt-auto">
          <button
            onClick={handleShare}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-bold shadow-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            Chia sẻ thông tin
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
