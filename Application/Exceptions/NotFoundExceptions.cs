namespace SirenStore.Application.Exceptions
{
    /// <summary>
    /// Aranan kayıt veritabanında bulunamadığında fırlatılır.
    /// API katmanında 404 Not Found dönmek için kullanılabilir.
    /// </summary>
    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message) { }

        public NotFoundException(string entityName, long id)
            : base($"{entityName} bulunamadı. (Id: {id})") { }
    }
}
