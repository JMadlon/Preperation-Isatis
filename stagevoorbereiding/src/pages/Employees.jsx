import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box
} from '@mui/material';

export default function Employees() {
  const [rows, setRows] = useState([
    { name: 'Alice', contractHours: 40 },
    { name: 'Bob', contractHours: 32 },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (index, field, newValue) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = {
        ...updatedRows[index],
        [field]: newValue,
      };
      return updatedRows;
    });
  };

  const handleDeleteRow = (index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleAddNewEmployee = () => {
    setRows((prevRows) => [
      ...prevRows,
      { name: '', contractHours: 0 },
    ]);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: '0 auto', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Contract Hours</strong></TableCell>
              {isEditing && (
                <TableCell><strong>Actions</strong></TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((employee, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={employee.name}
                      onChange={(e) => handleChange(idx, 'name', e.target.value)}
                    />
                  ) : (
                    employee.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={employee.contractHours}
                      onChange={(e) => handleChange(idx, 'contractHours', e.target.value)}
                      type="number"
                    />
                  ) : (
                    employee.contractHours
                  )}
                </TableCell>

                {isEditing && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteRow(idx)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          variant="contained"
          color={isEditing ? 'success' : 'primary'}
          onClick={handleToggleEdit}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>

        {isEditing && (
          <Button 
            variant="contained" 
            sx={{ ml: 2 }}
            onClick={handleAddNewEmployee}
          >
            Add New Employee
          </Button>
        )}
      </Box>
    </>
  );
}
