import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientSectionProps {
  companies: string[];
  value: string;
  onChange: (value: string) => void;
}

export const ClientSection = ({ companies, value, onChange }: ClientSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">1. Client</h3>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Select value={value} onValueChange={onChange}>
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
  );
};