using AutoMapper;
using stagevoorbereiding_API.Entities;

namespace stagevoorbereiding_API.DAL
{
    public class ProjectsDAO
    {
        private readonly DataBaseContext _context;
        private IMapper _mapper;

        public ProjectsDAO(DataBaseContext context, IMapper mapper)
        {
            this._context = context;
            this._mapper = mapper;
        }

        public List<ProjectDTO> GetAllProjects()
        {
            List<ProjectEntity> projects = _context.Projects.ToList();
            return _mapper.Map<List<ProjectDTO>>(projects);
        }

        public bool UpdateProject(ProjectDTO project)
        {
            ProjectEntity? existingProject = _context.Projects.FirstOrDefault(p => p.Id == project.Id);

            if (existingProject == null)
            {
                return false;
            }

            _mapper.Map(project, existingProject);

            _context.SaveChanges();
            return true;
        }
    }
}