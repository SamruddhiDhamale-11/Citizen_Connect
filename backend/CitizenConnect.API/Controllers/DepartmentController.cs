using CitizenConnect.API.DTOs.Department;
using CitizenConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CitizenConnect.API.Controllers
{
    [ApiController]

    [Route("api/departments")]
    public class DepartmentController
        : ControllerBase
    {
        private readonly IDepartmentService
            _departmentService;

        public DepartmentController(
            IDepartmentService departmentService)
        {
            _departmentService =
                departmentService;
        }

        /// <summary>
        /// Create department
        /// </summary>
        [HttpPost]
        public async Task<IActionResult>
            CreateDepartment(
                DepartmentRequestDto dto)
        {
            var result =
                await _departmentService
                    .CreateDepartmentAsync(dto);

            return Ok(result);
        }

        /// <summary>
        /// Get all departments
        /// </summary>
        [HttpGet]
        public async Task<IActionResult>
            GetAllDepartments()
        {
            var result =
                await _departmentService
                    .GetAllDepartmentsAsync();

            return Ok(result);
        }

        /// <summary>
        /// Get department by id
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult>
            GetDepartmentById(int id)
        {
            var result =
                await _departmentService
                    .GetDepartmentByIdAsync(id);

            if (result == null)
            {
                return NotFound(
                    "Department not found.");
            }

            return Ok(result);
        }

        /// <summary>
        /// Update department
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult>
            UpdateDepartment(
                int id,
                DepartmentRequestDto dto)
        {
            var updated =
                await _departmentService
                    .UpdateDepartmentAsync(
                        id,
                        dto);

            if (!updated)
            {
                return NotFound(
                    "Department not found.");
            }

            return Ok(
                "Department updated successfully.");
        }

        /// <summary>
        /// Delete department
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult>
            DeleteDepartment(int id)
        {
            var deleted =
                await _departmentService
                    .DeleteDepartmentAsync(id);

            if (!deleted)
            {
                return NotFound(
                    "Department not found.");
            }

            return Ok(
                "Department deleted successfully.");
        }
    }
}