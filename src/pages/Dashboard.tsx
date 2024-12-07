import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { ImageModal } from "@/components/ImageModal";
import { useToast } from "@/components/ui/use-toast";

interface Record {
  "Carimbo de data/hora": string;
  Cliente: string;
  Matricula: string;
  "Número encomenda": string;
  "Registos - Fotos": string;
  Operador: string;
  "Nome da empresa": string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["records"],
    queryFn: async () => {
      const response = await fetch(
        "https://gateway.codeheroes.com.br/webhook/data/registros/?p=10"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json() as Promise<Record[]>;
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load data. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Records Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <DataTable data={data || []} isLoading={isLoading} onImageClick={setSelectedImage} />
        </div>

        {selectedImage && (
          <ImageModal
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;