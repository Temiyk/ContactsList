using System;
using System.Collections.Generic;
using ContactsList.Models;
using Microsoft.EntityFrameworkCore;

namespace ContactsList.Data
{
    public class ContactsDbContext : DbContext
    {
        public ContactsDbContext(DbContextOptions<ContactsDbContext> options) : base(options) { }
        public DbSet<Contact> Contacts { get; set; }
    }
}
