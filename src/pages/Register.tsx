import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageUploadSection } from "@/components/ImageUploadSection";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    orderNumber: "",
    containerNumber: "",
    registrationNumber: "",
    operator: "Alda",
  });
  const [photos, setPhotos] = useState<File[]>([]);

  const companies = [
    "L-Founders",
    "AR.CA. SRL",
    "ADELINA SILVA - UNIPESSOAL, LDA",
    "EGIDIO JOAQUIM OLIVEIRA ABREU",
    "LEINER & KIKA MOBELHANDELS GmbH",
  ];

  const convertToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert all photos to base64
      const base64Photos = await Promise.all(photos.map(convertToBase64));

      const payload = {
        ...formData,
        photos: base64Photos,
      };

      const response = await fetch(
        "https://gateway.codeheroes.com.br/webhook/715e13e4-b758-4c8b-be0c-62b28f17b675",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Registration completed successfully!",
        });
        navigate("/");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      toast({
        title: "Camera",
        description: "Camera functionality would be implemented here",
      });
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access camera",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Register New Cargo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Client</h3>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, companyName: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cargo Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">2. Cargo Information</h3>
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  required
                  value={formData.orderNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, orderNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="containerNumber">
                  Container Number (optional)
                </Label>
                <Input
                  id="containerNumber"
                  value={formData.containerNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, containerNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <ImageUploadSection
              photos={photos}
              onPhotosChange={setPhotos}
              onCameraCapture={handleCameraCapture}
            />

            {/* Operator Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">4. Operator</h3>
              <div className="space-y-2">
                <Label htmlFor="operator">Responsible Operator</Label>
                <Input
                  id="operator"
                  value={formData.operator}
                  onChange={(e) =>
                    setFormData({ ...formData, operator: e.target.value })
                  }
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;