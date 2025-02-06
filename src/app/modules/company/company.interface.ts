export type TCompany = {
  id: string;
  name: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  subscription: string;
  profileImageUrl: string;
  address: string;
  contactNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean;
};
