import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CargoSectionProps {
  orderNumber: string;
  containerNumber: string;
  registrationNumber: string;
  companyName: string;
  onOrderNumberChange: (value: string) => void;
  onContainerNumberChange: (value: string) => void;
  onRegistrationNumberChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
}

export const CargoSection = ({
  orderNumber,
  containerNumber,
  registrationNumber,
  companyName,
  onOrderNumberChange,
  onContainerNumberChange,
  onRegistrationNumberChange,
  onCompanyNameChange,
}: CargoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">2. Informação da Carga</h3>
      <div className="space-y-2">
        <Label htmlFor="companyName">Nome da Empresa</Label>
        <Input
          id="companyName"
          required
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="orderNumber">Número da Encomenda</Label>
        <Input
          id="orderNumber"
          required
          value={orderNumber}
          onChange={(e) => onOrderNumberChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="containerNumber">Número do Contentor (opcional)</Label>
        <Input
          id="containerNumber"
          value={containerNumber}
          onChange={(e) => onContainerNumberChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="registrationNumber">Número de Matrícula</Label>
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