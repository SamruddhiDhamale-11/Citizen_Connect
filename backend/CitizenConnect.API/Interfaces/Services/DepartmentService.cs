using CitizenConnect.API.DTOs.Department;
using CitizenConnect.API.Interfaces.Services;
using CitizenConnect.Domain.Entities;
using CitizenConnect.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly ApplicationDbContext _context;

        public DepartmentService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Create new department
        /// </summary>
        public async Task<DepartmentResponseDto>
            CreateDepartmentAsync(
                DepartmentRequestDto dto)
        {
            // Check if department already exists

            var existingDepartment =
                await _context.Departments
                    .FirstOrDefaultAsync(x =>
                        x.DepartmentName
                        .ToLower()
                        == dto.DepartmentName.ToLower());

            if (existingDepartment != null)
            {
                throw new Exception(
                    "Department already exists.");
            }

            // Create department entity

            var department = new Department
            {
                DepartmentName = dto.DepartmentName,
                Description = dto.Description
            };

            // Add into database

            _context.Departments.Add(department);

            await _context.SaveChangesAsync();

            // Return response

            return new DepartmentResponseDto
            {
                DepartmentId =
                    department.DepartmentId,

                DepartmentName =
                    department.DepartmentName,

                Description =
                    department.Description
            };
        }

        /// <summary>
        /// Get all departments
        /// </summary>
        public async Task<List<DepartmentResponseDto>>
            GetAllDepartmentsAsync()
        {
            var departments =
                await _context.Departments
                    .OrderBy(x => x.DepartmentName)
                    .Select(x =>
                        new DepartmentResponseDto
                        {
                            DepartmentId =
                                x.DepartmentId,

                            DepartmentName =
                                x.DepartmentName,

                            Description =
                                x.Description
                        })
                    .ToListAsync();

            return departments;
        }

        /// <summary>
        /// Get department by id
        /// </summary>
        public async Task<DepartmentResponseDto?>
            GetDepartmentByIdAsync(
                int departmentId)
        {
            var department =
                await _context.Departments
                    .Where(x =>
                        x.DepartmentId
                        == departmentId)
                    .Select(x =>
                        new DepartmentResponseDto
                        {
                            DepartmentId =
                                x.DepartmentId,

                            DepartmentName =
                                x.DepartmentName,

                            Description =
                                x.Description
                        })
                    .FirstOrDefaultAsync();

            return department;
        }

        /// <summary>
        /// Update department
        /// </summary>
        public async Task<bool>
            UpdateDepartmentAsync(
                int departmentId,
                DepartmentRequestDto dto)
        {
            var department =
                await _context.Departments
                    .FirstOrDefaultAsync(x =>
                        x.DepartmentId
                        == departmentId);

            if (department == null)
            {
                return false;
            }

            // Check duplicate department name

            var duplicateDepartment =
                await _context.Departments
                    .AnyAsync(x =>
                        x.DepartmentId != departmentId
                        &&
                        x.DepartmentName.ToLower()
                        == dto.DepartmentName.ToLower());

            if (duplicateDepartment)
            {
                throw new Exception(
                    "Department name already exists.");
            }

            // Update fields

            department.DepartmentName =
                dto.DepartmentName;

            department.Description =
                dto.Description;

            await _context.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// Delete department
        /// </summary>
        public async Task<bool>
            DeleteDepartmentAsync(
                int departmentId)
        {
            var department =
                await _context.Departments
                    .FirstOrDefaultAsync(x =>
                        x.DepartmentId
                        == departmentId);

            if (department == null)
            {
                return false;
            }

            // Check if department is used
            // in complaint categories

            var isUsed =
                await _context.ComplaintCategories
                    .AnyAsync(x =>
                        x.DepartmentId
                        == departmentId);

            if (isUsed)
            {
                throw new Exception(
                    "Department cannot be deleted because it is assigned to complaint categories.");
            }

            _context.Departments.Remove(department);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}