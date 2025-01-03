using stagevoorbereiding_API.DAL;

namespace stagevoorbereiding_API.services
{
    public class ProjectsService
    {
        private readonly ProjectsDAO _projectsDAO;

        public ProjectsService(ProjectsDAO projectsDAO)
        {
            _projectsDAO = projectsDAO;
        }

        public List<ProjectDTO> GetAllProjects()
        {
            return _projectsDAO.GetAllProjects();
        }

        public bool UpdateProject(ProjectDTO project)
        {
            return _projectsDAO.UpdateProject(project);
        }

        public ProjectDTO AddProject(ProjectDTO project)
        {
            if (project == null || string.IsNullOrWhiteSpace(project.Name))
            {
                throw new ArgumentException("Invalid project data.");
            }

            return _projectsDAO.AddProject(project);
        }

        public bool DeleteProject(int id)
        {
            return _projectsDAO.DeleteProject(id);
        }
    }
}