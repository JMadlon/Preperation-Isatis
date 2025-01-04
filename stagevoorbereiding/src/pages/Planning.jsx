import React, { useState } from "react";
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
  Select,
  MenuItem,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Backend base URL
const BACKEND_URL = "http://localhost:5174";

// Fetch planning data for a given week
const fetchPlanning = async (weekNumber) => {
  const response = await fetch(`${BACKEND_URL}/planning/${weekNumber}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch planning for week ${weekNumber}`);
  }
  return response.json();
};

// Fetch employees and projects
const fetchEmployees = async () => {
  const response = await fetch(`${BACKEND_URL}/employees`);
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  return response.json();
};

const fetchProjects = async () => {
  const response = await fetch(`${BACKEND_URL}/projects`);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
};

// Update planning data
const updatePlanning = async (planning) => {
  const response = await fetch(`${BACKEND_URL}/planning`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(planning),
  });
  if (!response.ok) {
    throw new Error("Failed to update planning");
  }
  return response.json();
};

// Delete a planning row
const deletePlanning = async (id) => {
  const response = await fetch(`${BACKEND_URL}/planning/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete planning with id ${id}`);
  }
  return id;
};

export default function Planning() {
  const queryClient = useQueryClient();
  const [weekNumber, setWeekNumber] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch planning, employees, and projects
  const { data: rows = [], isLoading, isError } = useQuery({
    queryKey: ["planning", weekNumber],
    queryFn: () => fetchPlanning(weekNumber),
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const updateMutation = useMutation({
    mutationFn: updatePlanning,
    onSuccess: () => {
      queryClient.invalidateQueries(["planning", weekNumber]);
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlanning,
    onSuccess: () => {
      queryClient.invalidateQueries(["planning", weekNumber]);
    },
  });

  const saveChanges = async () => {
    try {
      await updateMutation.mutateAsync(rows);
    } catch (error) {
      console.error("Error saving planning:", error);
    }
  };

  const handleDelete = (id, index) => {
    if (String(id).startsWith("0")) {
      queryClient.setQueryData(["planning", weekNumber], (old) =>
        old.filter((_, idx) => idx !== index)
      );
    } else {
      deleteMutation.mutate(id);
    }
  };

  const handleChange = (index, field, value) => {
    queryClient.setQueryData(["planning", weekNumber], (old) =>
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

  const addNewRow = () => {
    queryClient.setQueryData(["planning", weekNumber], (old) => [
      ...(old || []),
      {
        id: 0,
        week: weekNumber,
        hours: 0,
        employee: { id: null, name: "" },
        project: { id: null, name: "" },
      },
    ]);
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        Failed to load planning data for week {weekNumber}.
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button
          onClick={() => setWeekNumber((prev) => Math.max(prev - 1, 1))}
          variant="contained"
          disabled={isEditing}
        >
          Previous Week
        </Button>
        <TextField
          variant="outlined"
          size="small"
          value={weekNumber}
          inputProps={{ readOnly: true, style: { textAlign: "center" } }}
          sx={{ mx: 2, width: 100 }}
        />
        <Button
          onClick={() => setWeekNumber((prev) => Math.min(prev + 1, 52))}
          variant="contained"
          disabled={isEditing}
        >
          Next Week
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "0 auto", mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Project</strong></TableCell>
              <TableCell><strong>Employee</strong></TableCell>
              <TableCell><strong>Hours</strong></TableCell>
              {isEditing && <TableCell><strong>Actions</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((entry, idx) => (
              <TableRow key={entry.id || `temp-${idx}`}>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={entry.project?.id || ""}
                      onChange={(e) =>
                        handleChange(idx, "project", projects.find((p) => p.id === parseInt(e.target.value, 10)))
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
                    entry.project?.name || "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={entry.employee?.id || ""}
                      onChange={(e) => {
                        const selectedEmployee = employees.find((emp) => emp.id === parseInt(e.target.value, 10));
                        if (selectedEmployee) {
                          handleChange(idx, "employee", selectedEmployee);
                        }
                      }}
                      displayEmpty
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    entry.employee?.name || "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={entry.hours}
                      onChange={(e) =>
                        handleChange(idx, "hours", parseInt(e.target.value, 10))
                      }
                      type="number"
                    />
                  ) : (
                    entry.hours
                  )}
                </TableCell>
                {isEditing && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(entry.id, idx)}
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

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button
          variant="contained"
          color={isEditing ? "success" : "primary"}
          onClick={isEditing ? saveChanges : () => setIsEditing(true)}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
        {isEditing && (
          <Button variant="contained" sx={{ ml: 2 }} onClick={addNewRow}>
            Add New Row
          </Button>
        )}
      </Box>
    </>
  );
}
