import { useState } from "react";
import { ImageModal } from "./ImageModal";

interface ImagePreviewProps {
  file: File;
}

export const ImagePreview = ({ file }: ImagePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  useState(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  });

  return (
    <div className="relative group">
      <img
        src={previewUrl}
        alt={file.name}
        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <ImageModal imageUrl={previewUrl} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};