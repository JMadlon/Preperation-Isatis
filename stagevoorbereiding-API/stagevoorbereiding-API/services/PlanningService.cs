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
            foreach (PlanningDTO dto in planningDtos)
            {
                if(!ValidateHours(dto)){
                    throw new ArgumentException($"Total planned hours for the week exceed the maximum contract hours of {dto.Employee.Name}.");
                }

                if (dto.Id == 0)
                {
                    PlanningEntity newEntity = _mapper.Map<PlanningEntity>(dto);

                    _planningDAO.AddPlanning(newEntity, dto.Employee.Id, dto.Project.Id);
                }
                else
                {
                    PlanningEntity updatedEntity = _mapper.Map<PlanningEntity>(dto);

                    _planningDAO.UpdatePlanning(updatedEntity, dto.Employee.Id, dto.Project.Id);
                }
            }
        }

        public bool DeletePlanning(int id)
        {
            return _planningDAO.DeletePlanning(id);
        }
        
        private bool ValidateHours(PlanningDTO dto)
        {
            List<PlanningDTO> weeklyPlanning = _planningDAO.GetPlanningForWeek(dto.Week);

            int totalPlannedHours = weeklyPlanning
                .Where(p => p.Employee.Id == dto.Employee.Id && p.Id != dto.Id)
                .Sum(p => p.Hours);

            totalPlannedHours += dto.Hours;

            return totalPlannedHours <= dto.Employee.ContractHours;
        }
    }
}
