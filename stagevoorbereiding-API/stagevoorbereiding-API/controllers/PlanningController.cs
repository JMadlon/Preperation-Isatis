using Microsoft.AspNetCore.Mvc;
using stagevoorbereiding_API.DAL;
using stagevoorbereiding_API.services;

namespace stagevoorbereiding_API.controllers
{
    [ApiController]
    [Route("/planning")]
    public class PlanningController : ControllerBase
    {
                private readonly PlanningService _PlanningService;

        public PlanningController(PlanningService planningService)
        {
            _PlanningService = planningService;
        }

        [HttpGet]
        [Route("/{weekNumber}")]
        public ActionResult<IEnumerable<PlanningDTO>> GetPlanningForWeek([FromQuery] int weekNumber)
        {
            if (weekNumber < 1 || weekNumber > 52)
            {
                return BadRequest("Invalid week number. Please provide a value between 1 and 52.");
            }

           PlanningDTO planningForWeek = _PlanningService.GetPlanningForWeek(weekNumber);

            if (planningForWeek == null)
            {
                return NotFound($"No planning data found for week {weekNumber}.");
            }

            return Ok(planningForWeek);
        }


        [HttpPut]
        public IActionResult UpdatePlanning(PlanningDTO planning)
        {
            if (planning == null || planning.Id <= 0)
            {
                return BadRequest("Invalid planning data.");
            }

            if(_PlanningService.UpdatePlanning(planning))
            {
                return NotFound($"Planning with ID: {planning.Id} not found.");
            }

            return NoContent();
        }
    }
}