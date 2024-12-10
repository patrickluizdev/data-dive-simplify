import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface Column {
  id: keyof Record;
  label: string;
}

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

interface EditRecordDialogProps {
  record: Record | null;
  columns: Column[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditRecordDialog = ({ 
  record, 
  columns, 
  isOpen, 
  onClose,
  onSuccess 
}: EditRecordDialogProps) => {
  const { toast } = useToast();
  const [editingRecord, setEditingRecord] = useState<Record | null>(record);

  const handleEditSubmit = async () => {
    if (!editingRecord) return;

    try {
      console.log('A submeter edição para o registo:', editingRecord);
      const response = await fetch('https://gateway.codeheroes.com.br/webhook/data/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingRecord),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar registo');
      }

      toast({
        title: "Sucesso",
        description: "Registo atualizado com sucesso",
      });
      onSuccess();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar registo:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar registo",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Registo</DialogTitle>
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
            Guardar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};