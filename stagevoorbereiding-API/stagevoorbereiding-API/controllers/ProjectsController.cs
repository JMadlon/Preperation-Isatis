using Microsoft.AspNetCore.Mvc;
using stagevoorbereiding_API.DAL;
using stagevoorbereiding_API.services;

namespace stagevoorbereiding_API.controllers
{
    [ApiController]
    [Route("/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly ProjectsService _projectsService;

        public ProjectController(ProjectsService projectsService)
        {
            _projectsService = projectsService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ProjectDTO>> GetProjects()
        {
            return Ok(_projectsService.GetAllProjects());
        }

        [HttpPut]
        public IActionResult UpdateProjects(List<ProjectDTO> projects)
        {
            if (projects == null || !projects.Any())
            {
                return BadRequest("No project data provided.");
            }

            foreach (var project in projects)
            {
                if (string.IsNullOrEmpty(project.Name) || project.Id < 0)
                {
                    return BadRequest($"Invalid data for project with ID: {project.Id}");
                }

                if (project.Id == 0)
                {
                    _projectsService.AddProject(project);
                }
                else
                {
                    var updateResult = _projectsService.UpdateProject(project);
                    if (!updateResult)
                    {
                        return NotFound($"Project with ID: {project.Id} not found.");
                    }
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProject(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid project ID.");
            }

            var deleteResult = _projectsService.DeleteProject(id);

            if (!deleteResult)
            {
                return NotFound($"Project with ID: {id} not found.");
            }

            return NoContent(); // Successfully deleted
        }


    }
}