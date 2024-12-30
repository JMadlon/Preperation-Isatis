import React, { useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
} from '@mui/material';

export default function Planning() {
  const [weekNumber, setWeekNumber] = useState(1);

  const [rows, setRows] = useState([
    { projectName: 'Project Alpha', employeeName: 'Alice', assignedHours: 10 },
    { projectName: 'Project Alpha', employeeName: 'Bob', assignedHours: 12 },
    { projectName: 'Project Beta', employeeName: 'Charlie', assignedHours: 8 },
    { projectName: 'Project Beta', employeeName: 'Diana', assignedHours: 20 },
    { projectName: 'Project Gamma', employeeName: 'Eve', assignedHours: 16 },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const handlePrevWeek = () => {
    setWeekNumber((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleNextWeek = () => {
    setWeekNumber((prev) => prev + 1);
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (index, field, value) => {
    setRows((prevRows) => {
      const updated = [...prevRows];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleDeleteRow = (index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleAddNewEntry = () => {
    setRows((prevRows) => [
      ...prevRows,
      { projectName: '', employeeName: '', assignedHours: 0 },
    ]);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, pt: 4 }}>
        <Button variant="contained" onClick={handlePrevWeek}>
          Prev
        </Button>
        
        <Typography variant="h6" sx={{ minWidth: '80px', textAlign: 'center' }}>
          Week {weekNumber}
        </Typography>
        
        <Button variant="contained" onClick={handleNextWeek}>
          Next
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: '0 auto', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Project Name</strong></TableCell>
              <TableCell><strong>Employee Name</strong></TableCell>
              <TableCell><strong>Assigned Hours</strong></TableCell>
              {isEditing && (
                <TableCell><strong>Actions</strong></TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={row.projectName}
                      onChange={(e) => handleChange(idx, 'projectName', e.target.value)}
                    />
                  ) : (
                    row.projectName
                  )}
                </TableCell>

                <TableCell>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={row.employeeName}
                      onChange={(e) => handleChange(idx, 'employeeName', e.target.value)}
                    />
                  ) : (
                    row.employeeName
                  )}
                </TableCell>

                <TableCell>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      value={row.assignedHours}
                      onChange={(e) => handleChange(idx, 'assignedHours', e.target.value)}
                    />
                  ) : (
                    row.assignedHours
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
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleAddNewEntry}>
            Create New Entry
          </Button>
        )}
      </Box>
    </>
  );
}
