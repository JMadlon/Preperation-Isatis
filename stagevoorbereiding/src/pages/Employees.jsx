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
  Box,
  CircularProgress,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Backend base URL
const BACKEND_URL = 'http://localhost:5173'; // Replace with your backend URL if different

// Fetch employees from the backend
const fetchEmployees = async () => {
  const response = await fetch(`${BACKEND_URL}/employees`);
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return response.json();
};

// Update employees in the backend
const updateEmployees = async (employees) => {
  const response = await fetch(`${BACKEND_URL}/employees`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employees),
  });
  if (!response.ok) {
    throw new Error('Failed to update employees');
  }
  return response.json();
};

// Delete an employee in the backend
const deleteEmployee = async (id) => {
  const response = await fetch(`${BACKEND_URL}/employees/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }
  return id;
};

export default function Employees() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Use React Query for fetching employees
  const {
    data: rows = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  // Use Mutation for updating employees
  const updateMutation = useMutation({
    mutationFn: updateEmployees,
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']); // Refetch employees after update
      setIsEditing(false);
    },
  });

  // Use Mutation for deleting employees
  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']); // Refetch employees after delete
    },
  });

  // Add a new employee (local only until saved)
  const addNewEmployee = () => {
    queryClient.setQueryData(['employees'], (old) => [
      ...(old || []),
      { id: null, name: '', contractHours: 0 },
    ]);
  };

  // Save changes
  const saveChanges = () => {
    updateMutation.mutate(rows);
  };

  // Delete an employee
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  // Handle cell edits
  const handleChange = (index, field, value) => {
    queryClient.setQueryData(['employees'], (old) =>
      old.map((row, idx) =>
        idx === index
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Box sx={{ textAlign: 'center', mt: 4 }}>Failed to load employees.</Box>;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: '0 auto', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Contract Hours</strong></TableCell>
              {isEditing && <TableCell><strong>Actions</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((employee, idx) => (
              <TableRow key={employee.id || idx}>
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
                      onChange={(e) => handleChange(idx, 'contractHours', parseInt(e.target.value, 10))}
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
                      onClick={() => handleDelete(employee.id)}
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
          onClick={isEditing ? saveChanges : () => setIsEditing(true)}
          disabled={updateMutation.isLoading}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>

        {isEditing && (
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={addNewEmployee}
          >
            Add New Employee
          </Button>
        )}
      </Box>
    </>
  );
}
