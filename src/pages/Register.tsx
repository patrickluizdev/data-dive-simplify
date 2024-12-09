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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    photos.forEach((photo) => {
      formDataToSend.append("photos", photo);
    });

    try {
      const response = await fetch(
        "https://gateway.codeheroes.com.br/webhook/715e13e4-b758-4c8b-be0c-62b28f17b675",
        {
          method: "POST",
          body: formDataToSend,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Here you would typically implement the camera capture UI
      // For now, we'll just show a message
      toast({
        title: "Camera",
        description: "Camera functionality would be implemented here",
      });
      stream.getTracks().forEach(track => track.stop());
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
          <CardTitle className="text-2xl text-center">Register New Cargo</CardTitle>
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
                <Label htmlFor="containerNumber">Container Number (optional)</Label>
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
                    setFormData({ ...formData, registrationNumber: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">3. Image Upload</h3>
              <div className="space-y-2">
                <Label htmlFor="photos">Photos</Label>
                <Input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCameraCapture}
                className="w-full"
              >
                Take Photo
              </Button>
            </div>

            {/* Operator */}
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