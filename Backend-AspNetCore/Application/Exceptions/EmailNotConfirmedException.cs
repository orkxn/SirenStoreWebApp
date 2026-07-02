namespace SirenStore.Application.Exceptions
{
    public class EmailNotConfirmedException : Exception
    {
        public string Email { get; }

        public EmailNotConfirmedException(string email, string message) : base(message)
        {
            Email = email;
        }
    }
}
