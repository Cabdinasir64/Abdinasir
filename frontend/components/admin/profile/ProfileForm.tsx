'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '../../../stores/userStore';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ProfileImage from './ProfileImage';

const ProfileForm: React.FC = () => {
  const { user, fetchUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showLargePreview, setShowLargePreview] = useState(false);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setImagePreview(null);
    }
  }, [image]);

  const handleImageChange = useCallback((file: File) => {
    setImage(file);
  }, []);

  const uploadProfileImage = useCallback(async (file: File): Promise<boolean> => {
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile-image`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      toast.success('Profile image updated successfully!');
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error uploading image';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!image) {

      toast.error('Please select an image to upload');
      return;
    }

    setIsLoading(true);

    try {
      const success = await uploadProfileImage(image);

      if (success) {
        await fetchUser();
        setIsEditing(false);
        setImage(null);
        setImagePreview(null);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error saving image';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [image, uploadProfileImage, fetchUser]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setImage(null);
    setImagePreview(null);
  }, []);

  const handleLargePreviewClick = useCallback(() => {
    setShowLargePreview(true);
  }, []);

  const handleCloseLargePreview = useCallback(() => {
    setShowLargePreview(false);
  }, []);



  return (
    <>
      <div className="max-w-md mx-auto p-4">
        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 text-center">
            <ProfileImage
              size={100}
              className="border-4 border-white shadow-lg mx-auto"
              editable={isEditing}
              onImageChange={handleImageChange}
              imagePreview={imagePreview}
              showLargePreview={!isEditing}
              onLargePreviewClick={handleLargePreviewClick}
            />
          </div>

          <div className="px-6 pb-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Username
              </label>
              <input
                className="w-full text-gray-800 font-medium cursor-not-allowed bg-transparent border-none outline-none p-0"
                value={user?.username}
                readOnly
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Email
              </label>
              <input
                className="w-full text-gray-800 font-medium cursor-not-allowed bg-transparent border-none outline-none p-0"
                value={user?.email}
                readOnly
              />
            </div>

            {!isEditing && (
              <motion.button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit Profile Image
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {isEditing && (
              <motion.div
                className="border-t border-gray-200 p-6 bg-gray-50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    disabled={isLoading || !image}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </div>
                    ) : (
                      'Save Image'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {showLargePreview && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseLargePreview}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Profile Image</h3>
                <button
                  onClick={handleCloseLargePreview}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center">
                {user?.profileImage ? (
                  <Image
                    src={user?.profileImage}
                    alt="Profile"
                    width={300}
                    height={300}
                    className="rounded-lg object-cover max-h-96"
                  />
                ) : (
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-6xl font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileForm;