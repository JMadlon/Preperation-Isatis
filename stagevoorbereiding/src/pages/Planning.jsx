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
  MenuItem,
  Select,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Backend base URL
const BACKEND_URL = 'http://localhost:5174';

// Fetch planning data for a given week
const fetchPlanning = async ({ queryKey }) => {
  const [, weekNumber] = queryKey;
  const response = await fetch(`${BACKEND_URL}/planning/${weekNumber}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch planning for week ${weekNumber}`);
  }
  return response.json();
};

// Fetch employees
const fetchEmployees = async () => {
  const response = await fetch(`${BACKEND_URL}/employees`);
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return response.json();
};

// Fetch projects
const fetchProjects = async () => {
  const response = await fetch(`${BACKEND_URL}/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
};

// Save planning data
const savePlanningData = async (planning) => {
  const response = await fetch(`${BACKEND_URL}/planning`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(planning),
  });
  if (!response.ok) {
    throw new Error('Failed to save planning data');
  }

  // Check if the response has a body before parsing
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};


export default function Planning() {
  const queryClient = useQueryClient();
  const [weekNumber, setWeekNumber] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Queries
  const { data: planning = [], isLoading: isLoadingPlanning, isError: isErrorPlanning } = useQuery({
    queryKey: ['planning', weekNumber],
    queryFn: fetchPlanning,
  });

  const { data: employees = [], isLoading: isLoadingEmployees, isError: isErrorEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const { data: projects = [], isLoading: isLoadingProjects, isError: isErrorProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  // Mutation
  const saveMutation = useMutation({
    mutationFn: savePlanningData,
    onSuccess: () => {
      queryClient.invalidateQueries(['planning', weekNumber]);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error saving planning:', error);
    },
  });

  // Handlers
  const handleSave = () => {
    const transformedPlanning = planning.map((item) => ({
      id: item.id.toString().startsWith('temp') ? 0 : item.id, // Set id to 0 for new rows
      week: weekNumber,
      hours: item.hours,
      employee: item.employee, // Full employee object
      project: item.project,   // Full project object
    }));
  
    console.log('Saving payload:', JSON.stringify(transformedPlanning));
  
    saveMutation.mutate(transformedPlanning, {
      onSuccess: (data) => {
        console.log('Save success:', data);
      },
      onError: (error) => {
        console.error('Error saving planning:', error);
      },
    });
  };
  

  const handleAddRow = () => {
    queryClient.setQueryData(['planning', weekNumber], (old) => [
      ...(old || []),
      {
        id: `temp-${Date.now()}`,
        week: weekNumber,
        hours: 0,
        employee: { id: '', name: '', contractHours: 0 },
        project: { id: '', name: '', description: '' },
      },
    ]);
  };

  const handleEditField = (index, field, value, subField = null) => {
    queryClient.setQueryData(['planning', weekNumber], (old) =>
      old.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]: subField
                ? { ...item[field], [subField]: value }
                : value,
            }
          : item
      )
    );
  };

  const goToPreviousWeek = () => !isEditing && setWeekNumber((prev) => Math.max(prev - 1, 1));
  const goToNextWeek = () => !isEditing && setWeekNumber((prev) => Math.min(prev + 1, 52));

  // Loading and Error States
  if (isLoadingPlanning || isLoadingEmployees || isLoadingProjects) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isErrorPlanning || isErrorEmployees || isErrorProjects) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        Failed to load data.
      </Box>
    );
  }

  // Rendering
  return (
    <>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button onClick={goToPreviousWeek} variant="contained" disabled={isEditing}>
          Previous Week
        </Button>
        <TextField
          variant="outlined"
          size="small"
          value={weekNumber}
          inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
          sx={{ mx: 2, width: 100 }}
        />
        <Button onClick={goToNextWeek} variant="contained" disabled={isEditing}>
          Next Week
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: '0 auto', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Project</strong></TableCell>
              <TableCell><strong>Employee</strong></TableCell>
              <TableCell><strong>Assigned Hours</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planning.map((entry, idx) => (
              <TableRow key={entry.id || `temp-${idx}`}>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={entry.project.id || ''}
                      onChange={(e) =>
                        handleEditField(idx, 'project', projects.find((p) => p.id === e.target.value))
                      }
                      displayEmpty
                    >
                      {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.name}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    entry.project.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={entry.employee.id || ''}
                      onChange={(e) =>
                        handleEditField(idx, 'employee', employees.find((emp) => emp.id === e.target.value))
                      }
                      displayEmpty
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    entry.employee.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={entry.hours}
                      onChange={(e) =>
                        handleEditField(idx, 'hours', parseInt(e.target.value, 10))
                      }
                      type="number"
                    />
                  ) : (
                    entry.hours
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          variant="contained"
          color={isEditing ? 'success' : 'primary'}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
        {isEditing && (
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleAddRow}>
            Add New Row
          </Button>
        )}
      </Box>
    </>
  );
}
