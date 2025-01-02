
using AutoMapper;
using stagevoorbereiding_API.DAL;

namespace stagevoorbereiding_API.services
{
    public class PlanningService
    {
         private readonly PlanningDAO _PlanningDAO;
        private readonly IMapper _mapper;

        public PlanningService(PlanningDAO planningDAO, IMapper mapper){
            _PlanningDAO = planningDAO;
            _mapper = mapper;
        }
        public PlanningDTO GetPlanningForWeek(int weekNumber)
        {
            return _PlanningDAO.GetPlanningForWeek(weekNumber);
        }

        public bool UpdatePlanning(PlanningDTO planning)
        {
            return _PlanningDAO.UpdatePlanning(planning);
        }
    }
}