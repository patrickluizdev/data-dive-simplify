import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CargoSectionProps {
  orderNumber: string;
  containerNumber: string;
  registrationNumber: string;
  onOrderNumberChange: (value: string) => void;
  onContainerNumberChange: (value: string) => void;
  onRegistrationNumberChange: (value: string) => void;
}

export const CargoSection = ({
  orderNumber,
  containerNumber,
  registrationNumber,
  onOrderNumberChange,
  onContainerNumberChange,
  onRegistrationNumberChange,
}: CargoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">2. Cargo Information</h3>
      <div className="space-y-2">
        <Label htmlFor="orderNumber">Order Number</Label>
        <Input
          id="orderNumber"
          required
          value={orderNumber}
          onChange={(e) => onOrderNumberChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="containerNumber">Container Number (optional)</Label>
        <Input
          id="containerNumber"
          value={containerNumber}
          onChange={(e) => onContainerNumberChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="registrationNumber">Registration Number</Label>
        <Input
          id="registrationNumber"
          required
          value={registrationNumber}
          onChange={(e) => onRegistrationNumberChange(e.target.value)}
        />
      </div>
    </div>
  );
};