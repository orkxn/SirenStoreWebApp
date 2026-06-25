using System.Linq.Expressions;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using SirenStore.Application.Interfaces;
using SirenStore.Infrastructure.Context;

namespace SirenStore.Infrastructure.Repositories
{
    /// <summary>
    /// BaseModel'den türeyen tüm entity'ler için generic repository implementasyonu.
    /// CRUD işlemleri, soft delete ve otomatik tarih atamaları bu sınıf üzerinden yapılır.
    /// </summary>
    public class Repository<T>(ApplicationDbContext context) : IRepository<T> where T : BaseModel
    {
        protected readonly ApplicationDbContext _context = context;
        private readonly DbSet<T> _dbSet = context.Set<T>();

        public IQueryable<T> AsQueryable()
        {
            return _context.Set<T>().AsNoTracking();
        }
        public async Task<T?> GetByIdAsync(long id) =>
            await _dbSet.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

        public async Task<IEnumerable<T>> GetAllAsync() =>
            await _dbSet.Where(x => !x.IsDeleted).ToListAsync();

        public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> predicate) =>
            await _dbSet.Where(x => !x.IsDeleted).Where(predicate).ToListAsync();

        public async Task AddAsync(T entity)
        {
            entity.CreationDate = DateTime.UtcNow;
            await _dbSet.AddAsync(entity);
        }

        public void Update(T entity)
        {
            entity.UpdatedDate = DateTime.UtcNow;
            _dbSet.Update(entity);
        }

        public void Remove(T entity)
        {
            // Soft delete: Kayıt silinmez, sadece IsDeleted flag'i true yapılır
            entity.IsDeleted = true;
            entity.UpdatedDate = DateTime.UtcNow;
            _dbSet.Update(entity);
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate) =>
            await _dbSet.Where(x => !x.IsDeleted).AnyAsync(predicate);

        public async Task<T?> GetAsync(Expression<Func<T, bool>> predicate) =>
            await _dbSet.Where(x => !x.IsDeleted).FirstOrDefaultAsync(predicate);

        public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}