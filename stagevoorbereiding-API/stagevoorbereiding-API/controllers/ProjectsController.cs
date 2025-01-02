using Microsoft.AspNetCore.Mvc;
using stagevoorbereiding_API.DAL;

namespace stagevoorbereiding_API.controllers
{
    [ApiController]
    [Route("/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly ProjectsDAO _projectsDAO;

        public ProjectController(ProjectsDAO projectsDAO)
        {
            _projectsDAO = projectsDAO;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ProjectDTO>> GetProjects()
        {
            return Ok(_projectsDAO.GetAllProjects());
        }

        [HttpPut]
        public IActionResult UpdateProject(ProjectDTO project)
        {
            if (project == null || project.Id <= 0)
            {
                return BadRequest("Invalid project data.");
            }

            if (_projectsDAO.UpdateProject(project))
            {
                return NotFound($"Project with ID: {project.Id} not found.");
            }

            return NoContent();
        }
    }
}