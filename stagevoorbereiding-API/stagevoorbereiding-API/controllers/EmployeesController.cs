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
        public IActionResult UpdateEmployee(EmployeeDTO employee)
        {
            if (employee == null || employee.Id <= 0)
            {
                return BadRequest("Invalid employee data.");
            }

            if (_employeesService.UpdateEmployee(employee))
            {
                return NotFound($"Employee with ID: {employee.Id} not found.");
            }

            return NoContent();
        }
    }
}
