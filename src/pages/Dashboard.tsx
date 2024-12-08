import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { ImageModal } from "@/components/ImageModal";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Record {
  "Carimbo de data/hora": string;
  Cliente: string;
  Matricula: string;
  "Número encomenda copy": string | null;
  "Número encomenda": string;
  "Registos - Fotos": string;
  Operador: string;
  "Nome da empresa": string;
  "Número Contentor": string;
  Id: number;
  CreatedAt: string;
  UpdatedAt: string | null;
}

interface ApiResponse {
  data: Record[];
}

interface TotalResponse {
  data: {
    total: number;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["records", page],
    queryFn: async () => {
      try {
        console.log(`Fetching data for page ${page}...`);
        const response = await fetch(
          `https://gateway.codeheroes.com.br/webhook/data/registros/?p=${page * 10}`,
          {
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json() as ApiResponse;
        console.log("Fetched data:", jsonData);
        return jsonData.data;
      } catch (err) {
        console.error("Error fetching data:", err);
        throw err;
      }
    },
  });

  const { data: totalData } = useQuery({
    queryKey: ["total"],
    queryFn: async () => {
      try {
        console.log("Fetching total count...");
        const response = await fetch(
          "https://gateway.codeheroes.com.br/webhook/data/total",
          {
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch total count");
        }
        const jsonData = await response.json() as TotalResponse;
        console.log("Fetched total count:", jsonData);
        return jsonData.data.total;
      } catch (err) {
        console.error("Error fetching total count:", err);
        throw err;
      }
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

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
          <DataTable 
            data={data || []} 
            isLoading={isLoading} 
            onImageClick={setSelectedImage} 
          />
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={handlePreviousPage}
                  className={`cursor-pointer ${page === 1 ? 'opacity-50' : ''}`}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 py-2">Page {page}</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={handleNextPage}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          <div className="text-sm text-gray-600">
            Total Records: {totalData || 'Loading...'}
          </div>
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