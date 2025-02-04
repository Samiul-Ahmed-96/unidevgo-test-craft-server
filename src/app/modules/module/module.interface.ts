export type TModule = {
  id: string;
  projectId: string;
  name: string;
  parentId?: string | null;
  children: string[];
  testCases: string[];
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean;
};
