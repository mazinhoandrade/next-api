export interface createProductType {
  id: string;
  amount: number;
  description: string|null;
  payerEmail: string|null;
  createdAt: Date;
  updatedAt?: Date | null;
}