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

export default function Projects() {
  const [rows, setRows] = useState([
    { name: 'Project Alpha', description: 'A quick example of an alpha project' },
    { name: 'Project Beta', description: 'This one handles the beta features' },
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

  const handleAddNewProject = () => {
    setRows((prevRows) => [
      ...prevRows,
      { name: '', description: '' },
    ]);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: '0 auto', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
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
                      value={row.name}
                      onChange={(e) => handleChange(idx, 'name', e.target.value)}
                    />
                  ) : (
                    row.name
                  )}
                </TableCell>

                <TableCell>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={row.description}
                      onChange={(e) => handleChange(idx, 'description', e.target.value)}
                    />
                  ) : (
                    row.description
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
            onClick={handleAddNewProject}
          >
            Create New Project
          </Button>
        )}
      </Box>
    </>
  );
}
