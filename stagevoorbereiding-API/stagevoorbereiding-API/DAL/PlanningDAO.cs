
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using stagevoorbereiding_API.Entities;

namespace stagevoorbereiding_API.DAL
{
    public class PlanningDAO
    {
        private readonly DataBaseContext _context;
        private IMapper _mapper;

        public PlanningDAO(DataBaseContext context, IMapper mapper)
        {
            this._context = context;
            this._mapper = mapper;
        }

        public PlanningDTO GetPlanningForWeek(int weekNumber)
        {
            var planning = _context.Planning
                .Include(p => p.EmployeeProjectPlannings)
                    .ThenInclude(epp => epp.Employee)
                .Include(p => p.EmployeeProjectPlannings)
                    .ThenInclude(epp => epp.Project) 
                .FirstOrDefault(p => p.Week == weekNumber);

            if (planning == null)
            {
                throw new KeyNotFoundException($"No planning data found for week {weekNumber}.");
            }

            return _mapper.Map<PlanningDTO>(planning);
}



        public bool UpdatePlanning(PlanningDTO planning)
        {
            PlanningEntity? existingPlanning = _context.Planning.FirstOrDefault(p => p.Id == planning.Id);

            if (existingPlanning == null)
            {
                return false;
            }

            _mapper.Map(planning, existingPlanning);

            _context.SaveChanges();
            return true;
        }
    }
}