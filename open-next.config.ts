// OpenNext Cloudflare adapter configuration
// See https://opennext.js.org/cloudflare
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
// import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';

export default defineCloudflareConfig({
  // For ISR / incremental caching backed by R2, create an R2 bucket and enable r2IncrementalCache:
  // See https://opennext.js.org/cloudflare/caching
  // incrementalCache: r2IncrementalCache,
});
