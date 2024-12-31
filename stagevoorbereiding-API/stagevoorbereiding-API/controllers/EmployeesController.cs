using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stagevoorbereiding_API.DAL;

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
    }
}
