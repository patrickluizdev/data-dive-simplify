import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImageModal = ({ imageUrl, onClose }: ImageModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <img
          src={imageUrl}
          alt="Full size"
          className="w-full h-auto object-contain"
        />
      </DialogContent>
    </Dialog>
  );
};