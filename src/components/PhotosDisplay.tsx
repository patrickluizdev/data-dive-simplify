import { useState } from "react";

interface PhotosDisplayProps {
  photosData: string;
  onImageClick: (url: string) => void;
}

export const PhotosDisplay = ({ photosData, onImageClick }: PhotosDisplayProps) => {
  const [error, setError] = useState<string | null>(null);

  const parsePhotos = (data: string): string[] => {
    try {
      // Handle the case where the data is already a comma-separated string
      if (data.startsWith("http")) {
        return data.split(",").map(url => url.trim());
      }
      
      // Handle the case where the data is a JSON array of comma-separated URLs
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.flatMap(urlSet => urlSet.split(",").map((url: string) => url.trim()));
      }
      
      return [];
    } catch (err) {
      console.error("Error parsing photos data:", err);
      setError("Error displaying photos");
      return [];
    }
  };

  if (!photosData) return null;
  if (error) return <div className="text-red-500 text-sm">{error}</div>;

  const photos = parsePhotos(photosData);

  return (
    <div className="flex gap-2 flex-wrap">
      {photos.map((url, index) => (
        <img
          key={`${url}-${index}`}
          src={url}
          alt={`Thumbnail ${index + 1}`}
          className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onImageClick(url)}
          onError={() => console.error(`Failed to load image: ${url}`)}
        />
      ))}
    </div>
  );
};