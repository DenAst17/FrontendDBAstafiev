import { Column } from "./column";
import { Record } from "./record";

export interface Table {
  name: string;
  columns: Column[];
  records: Record[];
}
