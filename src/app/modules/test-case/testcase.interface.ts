export type TCustomPropertyType =
  | "text"
  | "boolean"
  | "multipleOptions"
  | "url"
  | "richText"
  | "attachment";

export type TCustomProperty = {
  name: string;
  type: TCustomPropertyType;
  value: string; // Consider `boolean | string` for stricter type enforcement
};

export type TDefaultProperties = {
  createdBy: string;
  testDescription: string;
  expectedResult: string;
  status: "Passed" | "Failed" | "Blocked" | "Skipped" | "Not Yet Tested";
  executedDate: string; // Use `Date` if parsing is required
  updatedDate: string;
  considerAsBug: boolean;
};

export type TTestCase = {
  id: string;
  moduleId: string;
  customProperties: TCustomProperty[];
  defaultProperties: TDefaultProperties;
  isDeleted: boolean;
};
