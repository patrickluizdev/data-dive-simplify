import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ImagePreview } from "./ImagePreview";
import { useToast } from "./ui/use-toast";

interface ImageUploadSectionProps {
  photos: File[];
  onPhotosChange: (files: File[]) => void;
  onCameraCapture: () => void;
}

export const ImageUploadSection = ({
  photos,
  onPhotosChange,
  onCameraCapture,
}: ImageUploadSectionProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      onPhotosChange(filesArray);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">3. Image Upload</h3>
      <div className="space-y-2">
        <Input
          id="photos"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        {photos.map((photo, index) => (
          <ImagePreview key={index} file={photo} />
        ))}
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={onCameraCapture}
        className="w-full"
      >
        Take Photo
      </Button>
    </div>
  );
};