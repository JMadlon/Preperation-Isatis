import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

export default function Employees() {
    const rows = [
        { name: 'Alice', contractHours: 40 },
        { name: 'Bob', contractHours: 32 },
    ];
      

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: '0 auto', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Contract Hours</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((employee, idx) => (
              <TableRow key={idx}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.contractHours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
