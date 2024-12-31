using Microsoft.AspNetCore.Mvc;
using stagevoorbereiding_API.DAL;
using stagevoorbereiding_API.services;

namespace stagevoorbereiding_API.controllers
{
    [ApiController]
    [Route("/employees")]
    public class EmployeesController : ControllerBase
    {
        private readonly DataBaseContext _context;

        public EmployeesController(DataBaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<EmployeeDTO>> GetEmployees()
        {
            EmployeesService employeesService = new EmployeesService(_context);
            return Ok(employeesService.GetAllEmployees());
        }
    }
}
