namespace SirenStore.Application.Exceptions
{
    /// <summary>
    /// API katmanında 422 Unprocessable Entity veya 400 Bad Request dönmek için kullanılabilir.
    /// </summary>
    public class BusinessRuleException : Exception
    {
        public BusinessRuleException(string message) : base(message) { }
    }
}
