import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import { useDatabase } from "./hooks/use-database";
import { Datatype } from "./consts/datatype.enum";

const App = () => {
  const {
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
    setEditRecordFields,
    setJoinTable1,
    setJoinColumn1,
    setJoinTable2,
    setJoinColumn2,
    createDatabase,
    addColumn,
    addRecord,
    addTable,
    deleteRecord,
    deleteTable,
    startEditRecord,
    updateRecord,
    joinTables,
  } = useDatabase();

  return (
    <Container sx={{ minWidth: "1200px" }}>
      <Typography variant="h4" gutterBottom>
        Database Frontend
      </Typography>

      <Box mb={4}>
        <Typography variant="h6">Create new database</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Database Name"
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" fullWidth onClick={createDatabase}>
              Create Database
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box mb={4}>
        <Typography variant="h6">Create new table</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="New Table Name"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" fullWidth onClick={addTable}>
              Add Table
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box mb={4}>
        <Typography variant="h6">Select Table:</Typography>
        <FormControl fullWidth>
          <InputLabel>Select Table</InputLabel>
          <Select
            value={selectedTableName}
            onChange={(e) => setSelectedTableName(e.target.value)}
          >
            {tables &&
              tables.map((table) => (
                <MenuItem key={table.name} value={table.name}>
                  {table.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Button onClick={deleteTable}>Delete Current Table</Button>
      </Box>

      {selectedTable && (
        <Box>
          <Box mb={4}>
            <Typography variant="h6">Columns in {selectedTableName}</Typography>
            <Grid container spacing={2}>
              {selectedTable.columns.map((column) => (
                <Grid item xs={12} key={column.name}>
                  <Paper elevation={1} sx={{ padding: "8px" }}>
                    Name: {column.name}, Type: {column.dataType}
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2} mt={2} alignItems="center">
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Column Name"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                />
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel>Column Type</InputLabel>
                  <Select
                    value={newColumnType}
                    onChange={(e) => setNewColumnType(e.target.value)}
                  >
                    {Object.values(Datatype).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" fullWidth onClick={addColumn}>
                  Add Column
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box mb={4}>
            <Typography variant="h6">Records in {selectedTableName}</Typography>
            <Grid container spacing={2}>
              {selectedTable.records.map((record, index) => (
                <Grid item xs={12} key={index}>
                  <Paper elevation={2} sx={{ padding: "8px" }}>
                    {isEditingRecordIndex === index ? (
                      <Grid container spacing={2}>
                        {selectedTable.columns.map((col, idx) => (
                          <Grid item xs={3} key={idx}>
                            <TextField
                              fullWidth
                              value={editRecordFields[idx] || ""}
                              onChange={(e) => {
                                const updatedFields = [...editRecordFields];
                                updatedFields[idx] = e.target.value;
                                setEditRecordFields(updatedFields);
                              }}
                              label={`Value for ${col.name}`}
                            />
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            onClick={() => updateRecord(index)}
                          >
                            Update
                          </Button>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid container spacing={2} alignItems="center">
                        {record.fields.map((field, idx) => (
                          <Grid item xs={3} key={idx}>
                            {field.value}
                          </Grid>
                        ))}
                        <Grid item xs={2}>
                          <Button
                            variant="outlined"
                            onClick={() => startEditRecord(index)}
                          >
                            Update Record
                          </Button>
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => deleteRecord(index)}
                          >
                            Delete Record
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2} mt={2}>
              {selectedTable.columns.map((col, index) => (
                <Grid item xs={3} key={index}>
                  <TextField
                    fullWidth
                    placeholder={`Value for ${col.name}`}
                    onChange={(e) => {
                      const newFields = [...newRecordFields];
                      newFields[index] = e.target.value;
                      setNewRecordFields(newFields);
                    }}
                  />
                </Grid>
              ))}
              <Grid item xs={2}>
                <Button variant="contained" onClick={addRecord}>
                  Add Record
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box mb={4}>
            <Typography variant="h6">Join Tables</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Join Table 1</InputLabel>
                  <Select
                    value={joinTable1}
                    onChange={(e) => setJoinTable1(e.target.value)}
                  >
                    {tables.map((table) => (
                      <MenuItem key={table.name} value={table.name}>
                        {table.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {joinTable1 && (
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>{`Select Column from ${joinTable1}`}</InputLabel>
                    <Select
                      value={joinColumn1}
                      onChange={(e) => setJoinColumn1(e.target.value)}
                    >
                      {table1Columns.map((column) => (
                        <MenuItem key={column} value={column}>
                          {column}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Join Table 2</InputLabel>
                  <Select
                    value={joinTable2}
                    onChange={(e) => setJoinTable2(e.target.value)}
                  >
                    {tables.map((table) => (
                      <MenuItem key={table.name} value={table.name}>
                        {table.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {joinTable2 && (
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>{`Select Column from ${joinTable2}`}</InputLabel>
                    <Select
                      value={joinColumn2}
                      onChange={(e) => setJoinColumn2(e.target.value)}
                    >
                      {table2Columns.map((column) => (
                        <MenuItem key={column} value={column}>
                          {column}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={joinTables}
              disabled={
                !joinTable1 || !joinColumn1 || !joinTable2 || !joinColumn2
              }
            >
              Join Tables
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default App;
