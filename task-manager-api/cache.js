import NodeCache from 'node-cache';

/**
 * Practical 9: In-Memory Caching and Query Optimization
 * Cache instance with 60-second standard TTL and 120-second automatic sweep checkperiod.
 */
export const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120,
  useClones: true,
});

// Cache performance metrics tracking (hit/miss counter)
export const cacheMetrics = {
  hits: 0,
  misses: 0,
  sets: 0,
  invalidations: 0,
  lastInvalidationTime: null,
};

/**
 * Helper to retrieve from cache or return null while recording hits/misses
 */
export const getFromCache = (key) => {
  const value = cache.get(key);
  if (value !== undefined) {
    cacheMetrics.hits += 1;
    return value;
  }
  cacheMetrics.misses += 1;
  return null;
};

/**
 * Helper to set a key-value pair in cache
 */
export const setToCache = (key, value, ttl = 60) => {
  cacheMetrics.sets += 1;
  return cache.set(key, value, ttl);
};

/**
 * Invalidate task cache (e.g., after POST, PUT, DELETE write operations)
 * Clears 'all_tasks' as well as specific task keys
 */
export const invalidateTaskCache = (taskId = null) => {
  cacheMetrics.invalidations += 1;
  cacheMetrics.lastInvalidationTime = new Date().toISOString();
  cache.del('all_tasks');
  if (taskId) {
    cache.del(`task_${taskId}`);
  }
};

/**
 * Retrieve comprehensive cache diagnostics for debug endpoint
 */
export const getCacheDiagnostics = () => {
  const nodeStats = cache.getStats();
  const keys = cache.keys();
  const totalRequests = cacheMetrics.hits + cacheMetrics.misses;
  const hitRatio = totalRequests > 0 ? ((cacheMetrics.hits / totalRequests) * 100).toFixed(2) + '%' : '0.00%';

  return {
    success: true,
    status: 'Active',
    stdTTL: 60,
    keysCount: keys.length,
    activeKeys: keys,
    metrics: {
      hits: cacheMetrics.hits,
      misses: cacheMetrics.misses,
      totalLookups: totalRequests,
      hitRatio,
      sets: cacheMetrics.sets,
      invalidations: cacheMetrics.invalidations,
      lastInvalidatedAt: cacheMetrics.lastInvalidationTime,
    },
    nodeCacheRawStats: nodeStats,
  };
};

export default cache;
