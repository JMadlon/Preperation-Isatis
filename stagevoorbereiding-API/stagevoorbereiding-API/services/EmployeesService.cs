using AutoMapper;
using stagevoorbereiding_API.DAL;

namespace stagevoorbereiding_API.services
{
    public class EmployeesService
    {
        private readonly EmployeesDAO _employeesDAO;
        private readonly IMapper _mapper;

        public EmployeesService(EmployeesDAO employeesDAO, IMapper mapper){
            _employeesDAO = employeesDAO;
            _mapper = mapper;
        }

        public List<EmployeeDTO> GetAllEmployees()
        {
            return _employeesDAO.GetAllEmployees();
        }

        public bool UpdateEmployee(EmployeeDTO employee)
        {
            return _employeesDAO.UpdateEmployee(employee);
        }

        public bool DeleteEmployee(int id)
        {
            return _employeesDAO.DeleteEmployee(id);
        }

        public bool AddEmployee(EmployeeDTO employee)
        {
            return _employeesDAO.AddEmployee(employee);
        }


    }
}
