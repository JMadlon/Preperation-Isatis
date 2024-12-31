using Microsoft.AspNetCore.Mvc;
using stagevoorbereiding_API.DAL;

namespace stagevoorbereiding_API.controllers
{
    [ApiController]
    [Route("/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly DataBaseContext _context;

        public ProjectController(DataBaseContext context)
        {
            _context = context;
        }
    }
}