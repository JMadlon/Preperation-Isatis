using AutoMapper;
using stagevoorbereiding_API.DAL;
using stagevoorbereiding_API.Entities;

namespace stagevoorbereiding_API.services
{
    public class PlanningService
    {
        private readonly PlanningDAO _planningDAO;
        private readonly IMapper _mapper;

        public PlanningService(PlanningDAO planningDAO, IMapper mapper)
        {
            _planningDAO = planningDAO;
            _mapper = mapper;
        }

        public List<PlanningDTO> GetPlanningForWeek(int weekNumber)
        {
            return _planningDAO.GetPlanningForWeek(weekNumber);
        }

        public void SavePlanning(List<PlanningDTO> planningDtos)
        {
            foreach (var dto in planningDtos)
            {
                if (dto.Id == 0)
                {
                    var newEntity = _mapper.Map<PlanningEntity>(planningDtos);

                    _planningDAO.AddPlanning(newEntity, dto.Employee.Id, dto.Project.Id);
                }
                else
                {
                    var updatedEntity = _mapper.Map<PlanningEntity>(dto);

                    _planningDAO.UpdatePlanning(updatedEntity, dto.Employee.Id, dto.Project.Id);
                }
            }
        }

    }
}
