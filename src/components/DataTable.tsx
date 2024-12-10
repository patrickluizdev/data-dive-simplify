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
import { FileEdit, FileText, FilePdf, Settings2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PhotosDisplay } from "./PhotosDisplay";
import { generatePDF } from "@/utils/pdfGenerator";

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
  const { toast } = useToast();
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(col => col.id))
  );
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (isLoading) {
    return <TableSkeleton />;
  }

  const toggleColumn = (columnId: string) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(columnId)) {
      newVisibleColumns.delete(columnId);
    } else {
      newVisibleColumns.add(columnId);
    }
    setVisibleColumns(newVisibleColumns);
  };

  const handleGenerateReport = (recordId: number) => {
    console.log('Generating report for record ID:', recordId);
    const reportUrl = `https://gateway.codeheroes.com.br/webhook/data/relatorio?id=${recordId}`;
    window.open(reportUrl, '_blank');
  };

  const handleEditClick = (record: Record) => {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingRecord) return;

    try {
      console.log('Submitting edit for record:', editingRecord);
      const response = await fetch('https://gateway.codeheroes.com.br/webhook/data/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingRecord),
      });

      if (!response.ok) {
        throw new Error('Failed to update record');
      }

      toast({
        title: "Success",
        description: "Record updated successfully",
      });
      setIsEditDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating record:', error);
      toast({
        title: "Error",
        description: "Failed to update record",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePDF = async (record: Record) => {
    console.log('Generating PDF for record:', record);
    try {
      await generatePDF(record);
      toast({
        title: "Sucesso",
        description: "PDF gerado com sucesso",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar PDF",
        variant: "destructive",
      });
    }
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
                        ? <PhotosDisplay 
                            photosData={record[column.id]} 
                            onImageClick={onImageClick}
                          />
                        : record[column.id]?.toString() || '-'}
                    </TableCell>
                  )
                )}
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(record)}
                  >
                    <FileEdit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateReport(record.Id)}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">Gerar Relatório</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGeneratePDF(record)}
                  >
                    <FilePdf className="h-4 w-4" />
                    <span className="sr-only">Exportar PDF</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingRecord && columns.map((column) => (
              column.id !== "Registos - Fotos" && 
              column.id !== "Id" && 
              column.id !== "CreatedAt" && 
              column.id !== "UpdatedAt" && (
                <div key={column.id} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={column.id} className="text-right">
                    {column.label}
                  </Label>
                  <Input
                    id={column.id}
                    value={editingRecord[column.id]?.toString() || ''}
                    className="col-span-3"
                    onChange={(e) => 
                      setEditingRecord({
                        ...editingRecord,
                        [column.id]: e.target.value
                      })
                    }
                  />
                </div>
              )
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditSubmit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
