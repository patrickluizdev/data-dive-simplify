import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OperatorSectionProps {
  operators: string[];
  value: string;
  onChange: (value: string) => void;
}

export const OperatorSection = ({ operators, value, onChange }: OperatorSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">4. Operador</h3>
      <div className="space-y-2">
        <Label htmlFor="operator">Operador Responsável</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o operador" />
          </SelectTrigger>
          <SelectContent>
            {operators.map((operator) => (
              <SelectItem key={operator} value={operator}>
                {operator}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};