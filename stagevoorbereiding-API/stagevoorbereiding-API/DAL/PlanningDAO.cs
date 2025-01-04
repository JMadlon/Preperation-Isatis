using AutoMapper;
using Microsoft.EntityFrameworkCore;
using stagevoorbereiding_API.Entities;

namespace stagevoorbereiding_API.DAL
{
    public class PlanningDAO
    {
        private readonly DataBaseContext _context;
        private readonly IMapper _mapper;

        public PlanningDAO(DataBaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<PlanningDTO> GetPlanningForWeek(int weekNumber)
        {
            var planningData = _context.Planning
                .Include(p => p.Employee)
                .Include(p => p.Project)
                .Where(p => p.Week == weekNumber)
                .ToList();

            return _mapper.Map<List<PlanningDTO>>(planningData);
        }

        public void AddPlanning(PlanningEntity newEntity, int employeeId, int projectId)
        {
            newEntity.Employee = _context.Employees.FirstOrDefault(e => e.Id == employeeId);
            newEntity.Project = _context.Projects.FirstOrDefault(p => p.Id == projectId);

            if (newEntity.Employee == null || newEntity.Project == null)
            {
                throw new ArgumentException("Invalid Employee or Project Id");
            }

            _context.Planning.Add(newEntity);
            _context.SaveChanges();
        }

        public void UpdatePlanning(PlanningEntity updatedEntity, int employeeId, int projectId)
        {
            PlanningEntity? existingEntity = _context.Planning
                .Include(p => p.Employee)
                .Include(p => p.Project)
                .FirstOrDefault(p => p.Id == updatedEntity.Id);

            if (existingEntity == null)
            {
                throw new KeyNotFoundException($"Planning entry with Id {updatedEntity.Id} not found.");
            }

            existingEntity.Hours = updatedEntity.Hours;
            existingEntity.Week = updatedEntity.Week;

            existingEntity.Employee = _context.Employees.FirstOrDefault(e => e.Id == employeeId);
            existingEntity.Project = _context.Projects.FirstOrDefault(p => p.Id == projectId);

            if (existingEntity.Employee == null || existingEntity.Project == null)
            {
                throw new ArgumentException("Invalid Employee or Project Id");
            }

            _context.SaveChanges();
        }

         public bool DeletePlanning(int id)
        {
            PlanningEntity? planning = _context.Planning
                .Include(p => p.Employee)
                .Include(p => p.Project)
                .FirstOrDefault(p => p.Id == id);

            if (planning == null)
            {
                return false;
            }

            _context.Planning.Remove(planning);

            _context.SaveChanges();

            return true;
        }
    }
}
