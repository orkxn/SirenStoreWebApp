namespace SirenStore.Application.Exceptions
{
    public class BusinessRuleException : Exception
    {
        public BusinessRuleException(string message) : base(message) { }
    }

    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message) { }
        public NotFoundException(string entityName, long id) : base($"{entityName} bulunamadı. (Id: {id})") { }
    }

    public class ForbiddenException : Exception
    {
        public ForbiddenException(string message) : base(message) { }
    }

    public class EmailNotConfirmedException : Exception
    {
        public string Email { get; }
        public EmailNotConfirmedException(string email, string message) : base(message) => Email = email;
    }
}
