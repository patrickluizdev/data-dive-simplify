import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "./TableSkeleton";

interface Record {
  "Carimbo de data/hora": string;
  Cliente: string;
  Matricula: string;
  "Número encomenda": string;
  "Registos - Fotos": string;
  Operador: string;
  "Nome da empresa": string;
}

interface DataTableProps {
  data: Record[];
  isLoading: boolean;
  onImageClick: (url: string) => void;
}

export const DataTable = ({ data, isLoading, onImageClick }: DataTableProps) => {
  if (isLoading) {
    return <TableSkeleton />;
  }

  const renderImageThumbnails = (imageUrls: string) => {
    const urls = imageUrls.split(",").map((url) => url.trim());
    return (
      <div className="image-grid">
        {urls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Thumbnail ${index + 1}`}
            className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onImageClick(url)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date/Time</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Registration</TableHead>
            <TableHead>Order Number</TableHead>
            <TableHead>Photos</TableHead>
            <TableHead>Operator</TableHead>
            <TableHead>Company Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record["Carimbo de data/hora"]}</TableCell>
              <TableCell>{record.Cliente}</TableCell>
              <TableCell>{record.Matricula}</TableCell>
              <TableCell>{record["Número encomenda"]}</TableCell>
              <TableCell>
                {renderImageThumbnails(record["Registos - Fotos"])}
              </TableCell>
              <TableCell>{record.Operador}</TableCell>
              <TableCell>{record["Nome da empresa"]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};