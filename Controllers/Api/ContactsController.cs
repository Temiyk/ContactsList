using ContactsList.Data;
using ContactsList.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace ContactsList.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ContactsDbContext _context;

        public ContactsController(ContactsDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetContacts()
        {
            return Ok(await _context.Contacts.OrderBy(c => c.Name).ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> CreateContact([FromBody] Contact contact)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();
            return Ok(contact);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContact(int id, [FromBody] Contact contact)
        {
            if (id != contact.Id) return BadRequest();

            _context.Entry(contact).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
