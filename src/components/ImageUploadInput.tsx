import React, { useState, useRef } from 'react';
import { Upload, Link, Image as ImageIcon, Trash2, Check, Loader2, FileImage } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label = 'Product / Service Image',
  required = false,
  placeholder = 'Paste image URL or upload image file...'
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, GIF)');
      return;
    }

    // 10MB limit check
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be less than 10MB');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      // Compress and optimize image to data URL for permanent cloud storage
      const compressedDataUrl = await compressImage(file);
      onChange(compressedDataUrl);
      setIsUploading(false);
    } catch (err: any) {
      setUploadError('Error processing image upload');
      setIsUploading(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            resolve(dataUrl);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {label} {required && <span className="text-[#FF1E1E]">*</span>}
        </label>
        
        {/* Toggle between Direct Upload & URL Input */}
        <div className="flex items-center gap-1 bg-[#050505] p-0.5 rounded-md border border-white/10">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
              activeMode === 'upload'
                ? 'bg-[#FF1E1E] text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
              activeMode === 'url'
                ? 'bg-[#FF1E1E] text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Link className="w-3 h-3" />
            <span>URL Link</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Direct Image File Upload (Drag & Drop or Click) */}
      {activeMode === 'upload' && (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
            className="hidden"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-[#FF1E1E] bg-[#FF1E1E]/10 scale-[0.99]'
                : value
                ? 'border-white/20 bg-white/5 hover:border-[#FF1E1E]/50'
                : 'border-white/10 bg-[#050505] hover:border-white/30'
            }`}
          >
            {isUploading ? (
              <div className="py-3 flex flex-col items-center gap-2 text-xs text-gray-300">
                <Loader2 className="w-6 h-6 animate-spin text-[#FF1E1E]" />
                <span className="font-bold uppercase tracking-wider">Uploading Image File...</span>
              </div>
            ) : value ? (
              <div className="flex items-center justify-between w-full gap-3 p-1">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    loading="lazy"
                    src={value}
                    alt="Uploaded Preview"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded-lg border border-white/20 bg-black shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-left min-w-0">
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">Image Attached</span>
                    </div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[200px] mt-0.5">
                      {value.startsWith('data:') ? 'Base64 Direct Upload' : value}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange('');
                    }}
                    className="p-1.5 rounded bg-red-950/80 hover:bg-red-900 text-[#FF1E1E] border border-red-800"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-2 flex flex-col items-center gap-1.5 text-gray-400">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF1E1E]">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-tight">Click to Upload Image</span>
                  <span className="text-xs text-gray-400"> or drag & drop file</span>
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                  Supports PNG, JPG, WEBP, GIF up to 10MB
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: External Image URL Input */}
      {activeMode === 'url' && (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              required={required && !value}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-sm p-2.5 pl-9 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
            />
            <Link className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          </div>

          {value && (
            <div className="flex items-center gap-3 p-2 bg-white/5 border border-white/10 rounded-lg">
              <img
                loading="lazy"
                src={value}
                alt="URL Preview"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-cover rounded bg-black shrink-0 border border-white/10"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="text-[10px] text-gray-400 truncate flex-1">
                Preview: <span className="text-white font-mono">{value}</span>
              </div>
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-gray-400 hover:text-red-400 text-xs px-1"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="text-[10px] text-[#FF1E1E] font-bold uppercase tracking-wider">
          {uploadError}
        </div>
      )}
    </div>
  );
};
