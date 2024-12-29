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
  Box
} from '@mui/material';

export default function Planning() {
  const [weekNumber, setWeekNumber] = useState(1);

  const rows = [
    { projectName: 'Project Alpha', employeeName: 'Alice',   assignedHours: 10 },
    { projectName: 'Project Alpha', employeeName: 'Bob',     assignedHours: 12 },
    { projectName: 'Project Beta',  employeeName: 'Charlie', assignedHours:  8 },
    { projectName: 'Project Beta',  employeeName: 'Diana',   assignedHours: 20 },
    { projectName: 'Project Gamma', employeeName: 'Eve',     assignedHours: 16 },
  ];

  const groupByProject = rows.reduce((acc, row) => {
    if (!acc[row.projectName]) {
      acc[row.projectName] = [];
    }
    acc[row.projectName].push(row);
    return acc;
  }, {});

  const tableRows = Object.entries(groupByProject).map(([projectName, projectItems]) =>
    projectItems.map((item, index) => {
      if (index === 0) {
        return (
          <TableRow key={`${projectName}-${index}`}>
            <TableCell rowSpan={projectItems.length}>
              {projectName}
            </TableCell>
            <TableCell>{item.employeeName}</TableCell>
            <TableCell>{item.assignedHours}</TableCell>
          </TableRow>
        );
      } else {
        return (
          <TableRow key={`${projectName}-${index}`}>
            <TableCell>{item.employeeName}</TableCell>
            <TableCell>{item.assignedHours}</TableCell>
          </TableRow>
        );
      }
    })
  );

  const handlePrevWeek = () => {
    setWeekNumber((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleNextWeek = () => {
    setWeekNumber((prev) => prev + 1);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 , pt: 4}}>
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
            </TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
