using stagevoorbereiding_API.DAL;

namespace stagevoorbereiding_API.services
{
    public class EmployeesService
    {
        private readonly EmployeesDAO _employeesDAO;

        public EmployeesService(EmployeesDAO employeesDAO){
            _employeesDAO = employeesDAO;
        }

        public List<EmployeeDTO> GetAllEmployees()
        {
            return _employeesDAO.GetAllEmployees();
        }
    }
}
