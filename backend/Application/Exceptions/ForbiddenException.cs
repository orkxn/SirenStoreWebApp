namespace SirenStore.Application.Exceptions
{
    /// <summary>
    /// API katmanında 403 Forbidden dönmek için kullanılır
    /// </summary>
    public class ForbiddenException : Exception
    {
        public ForbiddenException(string message) : base(message) { }
    }
}
