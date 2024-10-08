import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { axios } from "../services/mainAxios";
import { Table } from "../models/table";
import { Database } from "../models/database";

export const useDatabase = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [databaseName, setDatabaseName] = useState("");
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("");
  const [selectedTableName, setSelectedTableName] = useState("");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [newRecordFields, setNewRecordFields] = useState<string[]>([]);
  const [newTableName, setNewTableName] = useState("");
  const [isEditingRecordIndex, setIsEditingRecordIndex] = useState<
    number | null
  >(null);
  const [editRecordFields, setEditRecordFields] = useState<string[]>([]);

  const [joinTable1, setJoinTable1] = useState<string>("");
  const [joinColumn1, setJoinColumn1] = useState<string>("");
  const [joinTable2, setJoinTable2] = useState<string>("");
  const [joinColumn2, setJoinColumn2] = useState<string>("");

  const [table1Columns, setTable1Columns] = useState<string[]>([]);
  const [table2Columns, setTable2Columns] = useState<string[]>([]);

  useEffect(() => {
    getTables();
  }, []);

  useEffect(() => {
    getTable(selectedTableName);
  }, [selectedTableName, tables]);

  useEffect(() => {
    if (joinTable1) {
      const columns1 =
        tables
          .find((table) => table.name === joinTable1)
          ?.columns.map((column) => column.name) ?? [];
      setTable1Columns(columns1 || []);
    }
    if (joinTable2) {
      const columns2 =
        tables
          .find((table) => table.name === joinTable2)
          ?.columns.map((column) => column.name) ?? [];
      setTable2Columns(columns2 || []);
    }
  }, [joinTable1, joinTable2]);

  const createDatabase = async () => {
    try {
      const response = await axios.post(
        "/api/database",
        JSON.stringify(databaseName),
      );
      if (response.status !== 200) {
        throw new Error();
      }
      toast.success("Database created successfully");
      getTables();
    } catch (error) {
      toast.error("Error creating database");
    }
  };

  const getTables = async () => {
    try {
      const response = await axios.get("/api/database");
      setTables(response.data.tables);
      if (selectedTableName === "") {
        setSelectedTableName((response.data as Database).tables[0].name);
      }
    } catch (error) {
      toast.error("Error getting tables");
    }
  };

  const getTable = async (name: string) => {
    try {
      if (name !== "") {
        const response = await axios.get(`/api/tables/${name}`);
        setSelectedTable(response.data);
      }
    } catch (error) {
      toast.error("Error getting table");
    }
  };

  const addColumn = async () => {
    try {
      const response = await axios.post("/api/columns", {
        tableName: selectedTableName,
        columnName: newColumnName,
        dataType: newColumnType,
      });
      if (response.status !== 200) {
        throw new Error();
      }
      toast.success("Column added successfully");
      getTables();
      setNewColumnName("");
      setNewColumnType("");
    } catch (error) {
      toast.error("Error adding column");
    }
  };

  const addRecord = async () => {
    try {
      const response = await axios.post("/api/records", {
        tableName: selectedTableName,
        fields: newRecordFields,
      });
      if (response.status !== 200) {
        throw new Error();
      }
      toast.success("Record added successfully");
      getTables();
    } catch (error) {
      toast.error("Error adding record");
    }
  };

  const addTable = async () => {
    try {
      const response = await axios.post(
        "/api/tables",
        JSON.stringify(newTableName),
      );
      if (response.status !== 200) {
        throw new Error();
      }
      toast.success("Table added successfully");
      getTables();
      setNewTableName("");
    } catch (error) {
      toast.error("Error adding table");
    }
  };

  const deleteRecord = async (recordIndex: number) => {
    try {
      const response = await axios.delete(
        `/api/records/${recordIndex}?tableName=${selectedTableName}`,
      );
      if (response.status !== 200) {
        throw new Error();
      }
      toast.success("Record deleted successfully");
      getTables();
    } catch (error) {
      toast.error("Error deleting record");
    }
  };

  const deleteTable = async () => {
    try {
      const response = await axios.delete(`/api/tables/${selectedTableName}`);
      if (response.status !== 200) {
        throw new Error();
      }
      toast.success("Table deleted successfully");
      getTables();
    } catch (error) {
      toast.error("Error deleting table");
    }
  };

  const startEditRecord = (index: number) => {
    setIsEditingRecordIndex(index);
    setEditRecordFields(
      selectedTable?.records[index].fields.map((field) => field.value) || [],
    );
  };

  const updateRecord = async (index: number) => {
    try {
      const response = await axios.put(`/api/records/${index}`, {
        tableName: selectedTableName,
        fields: editRecordFields,
      });
      if (response.status !== 200) {
        throw new Error();
      }
      toast.success("Record updated successfully");
      setIsEditingRecordIndex(null);
      getTables();
    } catch (error) {
      toast.error("Error updating record");
    }
  };

  const joinTables = async () => {
    if (!joinTable1 || !joinColumn1 || !joinTable2 || !joinColumn2) return;

    try {
      const response = await axios.post(
        "/api/tables/join",
        JSON.stringify({
          joinTable1,
          joinColumn1,
          joinTable2,
          joinColumn2,
        }),
      );

      if (response.status === 200) {
        toast.success("Tables joined successfully");
        getTables();
      } else {
        toast.error("Failed to join tables");
      }
    } catch (error) {
      toast.error("Error joining tables");
    }
  };

  return {
    tables,
    databaseName,
    newColumnName,
    newColumnType,
    selectedTableName,
    selectedTable,
    newRecordFields,
    newTableName,
    isEditingRecordIndex,
    editRecordFields,
    joinTable1,
    joinColumn1,
    joinTable2,
    joinColumn2,
    table1Columns,
    table2Columns,
    setDatabaseName,
    setNewColumnName,
    setNewColumnType,
    setSelectedTableName,
    setNewRecordFields,
    setNewTableName,
    setIsEditingRecordIndex,
    setEditRecordFields,
    setJoinTable1,
    setJoinColumn1,
    setJoinTable2,
    setJoinColumn2,
    createDatabase,
    getTables,
    getTable,
    addColumn,
    addRecord,
    addTable,
    deleteRecord,
    deleteTable,
    startEditRecord,
    updateRecord,
    joinTables,
  };
};

export default useDatabase;
