
namespace stagevoorbereiding_API.DAL
{
    public class EmployeesDAO
    {
        private DataBaseContext context;

        public EmployeesDAO(DataBaseContext context)
        {
            this.context = context;
        }

        internal List<EmployeeDTO> GetAllEmployees()
        {
            List<EmployeeDTO> employees = new List<EmployeeDTO>
            {
                new EmployeeDTO {Id = 1, Name = "Alice", ContractHours = 40 },
                new EmployeeDTO {Id = 2, Name = "Bob", ContractHours = 32 },
                new EmployeeDTO {Id = 3, Name = "Charlie", ContractHours = 20 }
            };

            return employees;
        }
    }
}