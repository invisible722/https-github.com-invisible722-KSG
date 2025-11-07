import React from 'react';
import { BusinessCardData, IndustryGroup } from '../types';

interface InfoDisplayProps {
  extractedData: BusinessCardData;
  onDataChange: (field: keyof BusinessCardData, value: string) => void;
  industryGroup: IndustryGroup;
  onIndustryGroupChange: (group: IndustryGroup) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  isLoading: boolean;
}

const InfoDisplay: React.FC<InfoDisplayProps> = ({
  extractedData,
  onDataChange,
  industryGroup,
  onIndustryGroupChange,
  notes,
  onNotesChange,
  isLoading,
}) => {
  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-md w-full max-w-xl mx-auto mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Thông Tin Trích Xuất</h2>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(extractedData).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
              {key === 'name' ? 'Tên' :
               key === 'title' ? 'Chức vụ' :
               key === 'company' ? 'Công ty' :
               key === 'phone' ? 'Số điện thoại' :
               key === 'email' ? 'Email' : key}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={value}
              onChange={(e) => onDataChange(key as keyof BusinessCardData, e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isLoading}
            />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">3. Nhóm Ngành Nghề</h2>
      <select
        id="industryGroup"
        name="industryGroup"
        value={industryGroup}
        onChange={(e) => onIndustryGroupChange(e.target.value as IndustryGroup)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        disabled={isLoading}
      >
        {Object.values(IndustryGroup).map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>

      <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">4. Ghi Chú (Không bắt buộc)</h2>
      <textarea
        id="notes"
        name="notes"
        rows={3}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
        placeholder="Ví dụ: địa điểm gặp, ngành nghề cụ thể..."
        disabled={isLoading}
      ></textarea>
    </div>
  );
};

export default InfoDisplay;
