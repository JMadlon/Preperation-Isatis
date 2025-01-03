using Microsoft.AspNetCore.Mvc;
using stagevoorbereiding_API.services;

namespace stagevoorbereiding_API.Controllers
{
    [ApiController]
    [Route("/planning")]
    public class PlanningController : ControllerBase
    {
        private readonly PlanningService _planningService;

        public PlanningController(PlanningService planningService)
        {
            _planningService = planningService;
        }

        [HttpGet]
        [Route("{weekNumber}")]
        public ActionResult<IEnumerable<PlanningDTO>> GetPlanningForWeek(int weekNumber)
        {
            if (weekNumber < 1 || weekNumber > 52)
            {
                return BadRequest("Invalid week number. Please provide a value between 1 and 52.");
            }

            var planningRows = _planningService.GetPlanningForWeek(weekNumber);

            return Ok(planningRows);
        }

        [HttpPut]
        public IActionResult SavePlanning([FromBody] List<PlanningDTO> planningDtos)
        {
            try
            {
                _planningService.SavePlanning(planningDtos);
                return Ok(new { message = "Planning saved successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
