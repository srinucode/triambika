export type CateringPackage = {
  id?: string;
  packageName: string;
  pricePerPlate: number;
  minPeople: number;
  description: string;
  itemsIncluded: string;
  imageUrl: string;
  available: boolean;
};