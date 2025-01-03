using Microsoft.AspNetCore.Mvc;
using stagevoorbereiding_API.services;

namespace stagevoorbereiding_API.controllers
{
    [ApiController]
    [Route("/employees")]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeesService _employeesService;

        public EmployeesController(EmployeesService employeesService)
        {
            _employeesService = employeesService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<EmployeeDTO>> GetEmployees()
        {
            return Ok(_employeesService.GetAllEmployees());
        }

        [HttpPut]
        public IActionResult UpdateEmployees(List<EmployeeDTO> employees)
        {
            if (employees == null || !employees.Any())
            {
                return BadRequest("No employee data provided.");
            }

            foreach (var employee in employees)
            {
                if (string.IsNullOrEmpty(employee.Name) || employee.ContractHours <= 0)
                {
                    return BadRequest($"Invalid data for employee: {employee.Name ?? "Unnamed"}");
                }

                if (employee.Id == 0)
                {
                    _employeesService.AddEmployee(employee);
                }
                else
                {
                    var updateResult = _employeesService.UpdateEmployee(employee);

                    if (!updateResult)
                    {
                        return NotFound($"Employee with ID: {employee.Id} not found.");
                    }
                }
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid employee ID.");
            }

            bool isDeleted = _employeesService.DeleteEmployee(id);

            if (!isDeleted)
            {
                return NotFound($"Employee with ID {id} not found.");
            }

            return NoContent();
        }
        
    }
}
