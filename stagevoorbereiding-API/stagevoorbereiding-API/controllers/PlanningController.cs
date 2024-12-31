using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stagevoorbereiding_API.DAL;

namespace stagevoorbereiding_API.controllers
{
    [ApiController]
    [Route("/planning")]
    public class PlanningController : ControllerBase
    {
        private readonly DataBaseContext _context;

        public PlanningController(DataBaseContext context)
        {
            _context = context;
        }
    }
}