import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ImageUploadSection } from "@/components/ImageUploadSection";
import { ClientSection } from "@/components/forms/ClientSection";
import { CargoSection } from "@/components/forms/CargoSection";
import { OperatorSection } from "@/components/forms/OperatorSection";

interface FormData {
  companyName: string;
  orderNumber: string;
  containerNumber: string;
  registrationNumber: string;
  operator: string;
}

interface ApiResponse {
  data: [
    {
      Clientes: string[];
    },
    {
      Operadores: string[];
    }
  ];
}

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    orderNumber: "",
    containerNumber: "",
    registrationNumber: "",
    operator: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);

  // Fetch companies and operators from API
  const { data: apiData, isLoading: isLoadingData } = useQuery({
    queryKey: ["formOptions"],
    queryFn: async () => {
      const response = await fetch(
        "https://gateway.codeheroes.com.br/webhook/data/registros/info"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch form options");
      }
      return response.json() as Promise<ApiResponse>;
    },
  });

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

  if (isLoadingData) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const companies = apiData?.data[0].Clientes || [];
  const operators = apiData?.data[1].Operadores || [];

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
            <ClientSection
              companies={companies}
              value={formData.companyName}
              onChange={(value) =>
                setFormData({ ...formData, companyName: value })
              }
            />

            <CargoSection
              orderNumber={formData.orderNumber}
              containerNumber={formData.containerNumber}
              registrationNumber={formData.registrationNumber}
              onOrderNumberChange={(value) =>
                setFormData({ ...formData, orderNumber: value })
              }
              onContainerNumberChange={(value) =>
                setFormData({ ...formData, containerNumber: value })
              }
              onRegistrationNumberChange={(value) =>
                setFormData({ ...formData, registrationNumber: value })
              }
            />

            <ImageUploadSection
              photos={photos}
              onPhotosChange={setPhotos}
              onCameraCapture={handleCameraCapture}
            />

            <OperatorSection
              operators={operators}
              value={formData.operator}
              onChange={(value) => setFormData({ ...formData, operator: value })}
            />

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