using System.ComponentModel.DataAnnotations;

namespace ContactsList.Models
{
    public class Contact
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public string? MobilePhone { get; set; }

        public string? JobTitle { get; set; }

        public DateTime BirthDate { get; set; }
    }
}
