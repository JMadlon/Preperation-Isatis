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
const BACKEND_URL = 'http://localhost:5174';

// Fetch projects from the backend
const fetchProjects = async () => {
  const response = await fetch(`${BACKEND_URL}/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
};

// Update projects in the backend
const updateProjects = async (projects) => {
  const response = await fetch(`${BACKEND_URL}/projects`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projects),
  });

  if (!response.ok) {
    throw new Error('Failed to update projects');
  }

  // Check if the response has content
  if (response.status === 204) {
    return; // No content, nothing to parse
  }

  return response.json(); // Parse JSON if content exists
};


// Delete a project in the backend
const deleteProject = async (id) => {
  const response = await fetch(`${BACKEND_URL}/projects/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
  return id;
};

export default function Projects() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Use React Query for fetching projects
  const {
    data: rows = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  // Use Mutation for updating projects
  const updateMutation = useMutation({
    mutationFn: updateProjects,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']); // Refetch projects after update
      setIsEditing(false); // Exit edit mode on successful save
    },
  });

  // Use Mutation for deleting projects
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']); // Refetch projects after delete
    },
  });

  // Add a new project (local only until saved)
  const addNewProject = () => {
    queryClient.setQueryData(['projects'], (old) => [
      ...(old || []),
      { id: `temp-${Date.now()}-${Math.random()}`, name: '', description: '' }, // Temporary ID for new projects
    ]);
  };

  // Save changes
  const saveChanges = async () => {
    try {
      const projectsToSave = rows.map(({ id, ...rest }) =>
        id && id.toString().startsWith('temp-') ? { ...rest } : { id, ...rest }
      );

      await updateMutation.mutateAsync(projectsToSave);
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  // Delete a project
  const handleDelete = (index) => {
    const projectToDelete = rows[index];

    // If the project hasn't been saved to the database, remove locally
    if (projectToDelete.id && projectToDelete.id.toString().startsWith('temp-')) {
      queryClient.setQueryData(['projects'], (old) =>
        old.filter((_, idx) => idx !== index)
      );
      return; // Exit without making a backend request
    }

    // Otherwise, delete from the backend
    deleteMutation.mutate(projectToDelete.id);
  };

  // Handle cell edits
  const handleChange = (index, field, value) => {
    queryClient.setQueryData(['projects'], (old) =>
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
    return <Box sx={{ textAlign: 'center', mt: 4 }}>Failed to load projects.</Box>;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: '0 auto', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              {isEditing && <TableCell><strong>Actions</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((project, idx) => (
              <TableRow key={project.id || `new-${idx}`}>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={project.name}
                      onChange={(e) => handleChange(idx, 'name', e.target.value)}
                    />
                  ) : (
                    project.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={project.description}
                      onChange={(e) => handleChange(idx, 'description', e.target.value)}
                    />
                  ) : (
                    project.description
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
          {isEditing ? 'Save' : 'Edit'}
        </Button>

        {isEditing && (
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={addNewProject}
          >
            Create New Project
          </Button>
        )}
      </Box>
    </>
  );
}
