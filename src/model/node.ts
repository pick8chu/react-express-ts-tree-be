export type Node = {
    id: number;
    name: string;
    parentId: number;
    height: number;
  } & (
    | {
        departmentName: string;
        role: 'manager';
      }
    | {
        programmingLanguage: string;
        role: 'employee';
      }
  );
  