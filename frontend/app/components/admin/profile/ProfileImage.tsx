'use client';

import { useUserStore } from '../../../stores/userStore';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProfileImageProps {
  size?: number;
  className?: string;
  editable?: boolean;
  onImageChange?: (file: File) => void;
  imagePreview?: string | null;
  showLargePreview?: boolean;
  onLargePreviewClick?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  size = 150,
  className = "",
  editable = false,
  onImageChange,
  imagePreview = null,
  showLargePreview = false,
  onLargePreviewClick
}) => {
  const { user } = useUserStore();

  if (!user) return null;

  const firstChar = user.username?.charAt(0).toUpperCase();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  return (
    <motion.div
      className={`relative rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-lg ${className} ${showLargePreview ? 'cursor-pointer' : ''
        }`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      whileHover={{ scale: editable ? 1.05 : 1, rotate: editable ? 2 : 0 }}
      onClick={showLargePreview ? onLargePreviewClick : undefined}
    >
      {imagePreview ? (
        <Image
          src={imagePreview}
          alt="Profile preview"
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      ) : user.profileImage ? (
        <Image
          src={user.profileImage}
          alt="Profile"
          width={size}
          height={size}
          className="w-full h-full object-cover"
          priority
        />
      ) : (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {firstChar}
        </motion.span>
      )}

      {editable && (
        <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="text-white text-center">
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium">Change</span>
          </div>
        </label>
      )}

      {showLargePreview && !editable && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center cursor-pointer transition-opacity duration-200">
          <div className="text-white text-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7" />
            </svg>
            <span className="text-xs font-medium">View</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileImage;