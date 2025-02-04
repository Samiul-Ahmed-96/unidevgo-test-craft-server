export type TProject = {
  id: string;
  companyId: string;
  name: string;
  region: string;
  tag: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean;
};
