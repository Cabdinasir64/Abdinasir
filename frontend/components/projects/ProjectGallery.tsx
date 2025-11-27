"use client";
import { useState, useMemo, useCallback, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const ProjectGallery = ({ images, mainImage }: { images: string[], mainImage: string }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const allImages = useMemo(() => {
    return [mainImage, ...images].filter(Boolean);
  }, [mainImage, images]);

  const openModal = useCallback((img: string) => {
    setSelectedImage(img);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">Gallery</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {allImages.map((img, idx) => (
          <GalleryItem key={`${img}-${idx}`} img={img} idx={idx} onClick={openModal} />
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 h-screen -top-6 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center  cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Full View"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GalleryItem = memo(({ img, idx, onClick }: { img: string, idx: number, onClick: (img: string) => void }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onClick(img)}
    className="relative h-40 md:h-48 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary-500 transition-all shadow-md hover:shadow-xl"
  >
    <Image
      src={img}
      alt={`Project shot ${idx + 1}`}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 50vw, 33vw"
    />
  </motion.div>
));

GalleryItem.displayName = "GalleryItem";

export default memo(ProjectGallery);