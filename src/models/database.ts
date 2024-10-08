import { Table } from "./table";

export interface Database {
  name: string;
  tables: Table[];
}
