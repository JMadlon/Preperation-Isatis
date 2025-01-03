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
            var entity = _context.Projects.FirstOrDefault(p => p.Id == project.Id);
            if (entity == null)
            {
                return false;
            }

            _mapper.Map(project, entity);
            _context.SaveChanges();
            return true;
        }

        public ProjectDTO AddProject(ProjectDTO project)
        {
            var projectEntity = _mapper.Map<ProjectEntity>(project);

            _context.Projects.Add(projectEntity);
            _context.SaveChanges();

            return _mapper.Map<ProjectDTO>(projectEntity);
        }

        public bool DeleteProject(int id)
        {
            var project = _context.Projects.FirstOrDefault(p => p.Id == id);
            if (project == null)
            {
                return false;
            }

            _context.Projects.Remove(project);
            _context.SaveChanges();
            return true;
        }

    }
}