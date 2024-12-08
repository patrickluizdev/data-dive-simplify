import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "./TableSkeleton";
import { Button } from "@/components/ui/button";
import { FileEdit, FileText, Settings2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface DataTableProps {
  data: Record[];
  isLoading: boolean;
  onImageClick: (url: string) => void;
}

interface Column {
  id: keyof Record;
  label: string;
}

const columns: Column[] = [
  { id: "Carimbo de data/hora", label: "Date/Time" },
  { id: "Cliente", label: "Client" },
  { id: "Matricula", label: "Registration" },
  { id: "Número encomenda", label: "Order Number" },
  { id: "Registos - Fotos", label: "Photos" },
  { id: "Operador", label: "Operator" },
  { id: "Nome da empresa", label: "Company Name" },
  { id: "Número Contentor", label: "Container Number" },
  { id: "Id", label: "ID" },
  { id: "CreatedAt", label: "Created At" },
  { id: "UpdatedAt", label: "Updated At" },
];

export const DataTable = ({ data, isLoading, onImageClick }: DataTableProps) => {
  console.log("DataTable received data:", data);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(col => col.id))
  );

  if (isLoading) {
    return <TableSkeleton />;
  }

  const renderImageThumbnails = (imageUrls: string) => {
    if (!imageUrls) return null;
    
    const urls = imageUrls.split(",").map((url) => url.trim());
    return (
      <div className="flex gap-2 flex-wrap">
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

  const toggleColumn = (columnId: string) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(columnId)) {
      newVisibleColumns.delete(columnId);
    } else {
      newVisibleColumns.add(columnId);
    }
    setVisibleColumns(newVisibleColumns);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={visibleColumns.has(column.id)}
                onCheckedChange={() => toggleColumn(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => 
                visibleColumns.has(column.id) && (
                  <TableHead key={column.id}>
                    {column.label}
                  </TableHead>
                )
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(data) && data.map((record, index) => (
              <TableRow key={index}>
                {columns.map((column) => 
                  visibleColumns.has(column.id) && (
                    <TableCell key={column.id}>
                      {column.id === "Registos - Fotos" 
                        ? renderImageThumbnails(record[column.id])
                        : record[column.id]?.toString() || '-'}
                    </TableCell>
                  )
                )}
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Edit record:', record)}
                  >
                    <FileEdit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Generate report for record:', record)}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">Generate Report</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};