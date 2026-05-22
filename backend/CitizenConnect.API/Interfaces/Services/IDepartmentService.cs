using CitizenConnect.API.DTOs.Department;

namespace CitizenConnect.API.Interfaces.Services
{
    public interface IDepartmentService
    {
        // Create Department

        Task<DepartmentResponseDto>
            CreateDepartmentAsync(
                DepartmentRequestDto dto);

        // Get All Departments

        Task<List<DepartmentResponseDto>>
            GetAllDepartmentsAsync();

        // Get Department By Id

        Task<DepartmentResponseDto?>
            GetDepartmentByIdAsync(
                int departmentId);

        // Update Department

        Task<bool>
            UpdateDepartmentAsync(
                int departmentId,
                DepartmentRequestDto dto);

        // Delete Department

        Task<bool>
            DeleteDepartmentAsync(
                int departmentId);
    }
}