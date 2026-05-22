import { createClient, type SanityClient } from 'next-sanity';
import { apiVersion, dataset, projectId, useCdn } from '../env';

export const hasSanityConfig = Boolean(projectId && dataset);

export const client: SanityClient | null = hasSanityConfig
  ? createClient({
      apiVersion,
      dataset,
      projectId,
      useCdn,
      perspective: 'published'
    })
  : null;
