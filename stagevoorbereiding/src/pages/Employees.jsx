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
const BACKEND_URL = 'http://localhost:5173';

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

  // Check if the response has a body (e.g., 204 No Content will not have one)
  if (response.status === 204) {
    return; // No content, so nothing to parse
  }

  return response.json(); // Parse JSON only if the response body exists
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
      setIsEditing(false); // Exit edit mode on successful save
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
      {
        id: `temp-${Date.now()}-${Math.random()}`, // Unique temporary ID
        name: '',
        contractHours: 0,
      },
    ]);
  };  

  // Save changes
  const saveChanges = async () => {
    try {
      const employeesToSave = rows.map(({ id, ...rest }) =>
        id && id > 0 ? { id, ...rest } : { ...rest }
      );

      await updateMutation.mutateAsync(employeesToSave); // Wait for save to complete
    } catch (error) {
      console.error('Error saving employees:', error);
    }
  };

  // Delete an employee
  const handleDelete = (index) => {
    const employeeToDelete = rows[index];
  
    // Check if the ID is a temporary ID
    if (employeeToDelete.id && String(employeeToDelete.id).startsWith('temp-')) {
      queryClient.setQueryData(['employees'], (old) =>
        old.filter((_, idx) => idx !== index)
      );
      return; // Exit without making a backend request
    }
  
    // If it's a valid database ID, send a DELETE request to the backend
    deleteMutation.mutate(employeeToDelete.id);
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
              <TableRow key={employee.id || `new-${idx}-${Date.now()}`}>
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
                      onClick={() => handleDelete(idx)}
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
          {isEditing ? (updateMutation.isLoading ? <CircularProgress size={20} /> : 'Save') : 'Edit'}
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
