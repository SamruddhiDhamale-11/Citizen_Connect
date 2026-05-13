using CitizenConnect.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CitizenConnect.API.Controllers
{
    [ApiController]
    [Route("api/master")]
    public class MasterController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MasterController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==============================
        // GET /api/master/wards
        // Returns WardId + WardName for dropdowns
        // ==============================
        [HttpGet("wards")]
        public async Task<IActionResult> GetWards()
        {
            var wards = await _context.Wards
                .OrderBy(w => w.WardName)
                .Select(w => new
                {
                    w.WardId,
                    w.WardName,
                    w.WardNumber
                })
                .ToListAsync();

            return Ok(wards);
        }

        // ==============================
        // GET /api/master/residence-types
        // Returns ResidenceTypeId + ResidenceTypeName for dropdowns
        // ==============================
        [HttpGet("residence-types")]
        public async Task<IActionResult> GetResidenceTypes()
        {
            var types = await _context.ResidenceTypes
                .OrderBy(r => r.ResidenceTypeName)
                .Select(r => new
                {
                    r.ResidenceTypeId,
                    r.ResidenceTypeName
                })
                .ToListAsync();

            return Ok(types);
        }

        // ==============================
        // GET /api/master/jurisdiction-types
        // Returns JurisdictionTypeId + JurisdictionTypeName for dropdowns
        // ==============================
        [HttpGet("jurisdiction-types")]
        public async Task<IActionResult> GetJurisdictionTypes()
        {
            var types = await _context.JurisdictionTypes
                .OrderBy(j => j.JurisdictionTypeName)
                .Select(j => new
                {
                    j.JurisdictionTypeId,
                    j.JurisdictionTypeName
                })
                .ToListAsync();

            return Ok(types);
        }
    }
}
