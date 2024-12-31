using stagevoorbereiding_API.DAL;

namespace stagevoorbereiding_API.services
{
    public class EmployeesService
    {
        private readonly DataBaseContext _context;

        public EmployeesService(DataBaseContext context)
        {
            _context = context;
        }

        public List<EmployeeDTO> GetAllEmployees()
        {
            EmployeesDAO employeesDAO = new EmployeesDAO(_context);
            return employeesDAO.GetAllEmployees();
        }
    }
}