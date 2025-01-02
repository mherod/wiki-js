import { z } from 'zod';

// Client Configuration Schema
export const WikimediaClientConfigSchema = z.object({
  baseURL: z.string().optional(),
  userAgent: z.string().optional(),
});

// Base Schemas
export const PageInfoSchema = z.object({
  pageid: z.number(),
  ns: z.number(),
  title: z.string(),
  contentmodel: z.string(),
  pagelanguage: z.string(),
  pagelanguagehtmlcode: z.string().optional(),
  pagelanguagedir: z.string().optional(),
  touched: z.string(),
  lastrevid: z.number(),
  length: z.number(),
  fullurl: z.string().optional(),
  editurl: z.string().optional(),
  canonicalurl: z.string().optional(),
  displaytitle: z.string().optional(),
});

export const CategorySchema = z.object({
  ns: z.number(),
  title: z.string(),
  sortkey: z.string().optional(),
  sortkeyprefix: z.string().optional(),
  timestamp: z.string().optional(),
  hidden: z.string().optional(),
});

export const LinkSchema = z.object({
  ns: z.number(),
  title: z.string(),
  exists: z.string().optional(),
  pageid: z.number().optional(),
});

export const PageSchema = z.object({
  ns: z.number().optional(),
  title: z.string().optional(),
  pageid: z.number().optional(),
});

export const SearchResultSchema = z.object({
  ns: z.number(),
  title: z.string(),
  pageid: z.number(),
  size: z.number(),
  wordcount: z.number(),
  snippet: z.string(),
  timestamp: z.string(),
});

export const ImageInfoSchema = z.object({
  timestamp: z.string(),
  user: z.string(),
  userid: z.number().optional(),
  size: z.number(),
  width: z.number(),
  height: z.number(),
  url: z.string(),
  descriptionurl: z.string(),
  descriptionshorturl: z.string().optional(),
  mime: z.string(),
  mediatype: z.string(),
  bitdepth: z.number(),
  metadata: z.array(z.any()).optional(),
  commonmetadata: z.array(z.any()).optional(),
  extmetadata: z.record(z.any()).optional(),
  sha1: z.string().optional(),
  canonicaltitle: z.string().optional(),
  comment: z.string().optional(),
  parsedcomment: z.string().optional(),
  html: z.string().optional(),
});

export const PageImageSchema = z.object({
  ns: z.number(),
  title: z.string(),
  imagerepository: z.string().optional(),
  imageinfo: z.array(ImageInfoSchema).optional(),
});

export const FileUsageSchema = z.object({
  ns: z.number(),
  title: z.string(),
  pageid: z.number(),
});

export const GlobalUsageSchema = z.object({
  title: z.string(),
  wiki: z.string(),
  url: z.string(),
});

// Enums
export const ImageSortType = z.enum(['name', 'timestamp']);
export const SortDirection = z.enum(['ascending', 'descending', 'newer', 'older']);
export const BotFilter = z.enum(['all', 'bots', 'nobots']);
export const LinkDirection = z.enum(['ascending', 'descending']);
export const AllLinksPropertySchema = z.enum(['ids', 'title']);
export const RedirectFilter = z.enum(['all', 'nonredirects', 'redirects']);
export const LangLinksFilter = z.enum(['all', 'withlanglinks', 'withoutlanglinks']);
export const ProtectionType = z.enum(['edit', 'move', 'upload']);
export const ProtectionLevel = z.enum(['autoconfirmed', 'sysop']);
export const CascadeFilter = z.enum(['all', 'cascading', 'noncascading']);
export const ProtectionExpiry = z.enum(['all', 'definite', 'indefinite']);
export const ExtractFormatType = z.enum(['plain', 'wiki']);

// Option Schemas
export const ImageSearchOptionsSchema = z.object({
  sort: ImageSortType.optional(),
  direction: SortDirection.optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  minSize: z.number().int().positive().optional(),
  maxSize: z.number().int().positive().optional(),
  user: z.string().optional(),
  filterBots: BotFilter.optional(),
  sha1: z.string().optional(),
  properties: z
    .array(
      z.enum([
        'timestamp',
        'user',
        'userid',
        'comment',
        'parsedcomment',
        'canonicaltitle',
        'url',
        'size',
        'dimensions',
        'sha1',
        'mime',
        'mediatype',
        'metadata',
        'commonmetadata',
        'extmetadata',
        'bitdepth',
        'badfile',
      ]),
    )
    .optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

export const AllLinksOptionsSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  prefix: z.string().optional(),
  unique: z.boolean().optional(),
  properties: z.array(AllLinksPropertySchema).optional(),
  namespace: z.number().int().min(-2).max(5501).optional(),
  limit: z.number().int().min(1).max(500).optional(),
  direction: LinkDirection.optional(),
});

export const AllPagesOptionsSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  prefix: z.string().optional(),
  namespace: z.number().int().min(0).max(5501).optional(),
  filterRedirects: RedirectFilter.optional(),
  filterLangLinks: LangLinksFilter.optional(),
  minSize: z.number().int().positive().optional(),
  maxSize: z.number().int().positive().optional(),
  protectionType: z.array(ProtectionType).optional(),
  protectionLevel: z.array(ProtectionLevel).optional(),
  protectionCascade: CascadeFilter.optional(),
  protectionExpiry: ProtectionExpiry.optional(),
  limit: z.number().int().min(1).max(500).optional(),
  direction: LinkDirection.optional(),
});

export const ExtractOptionsSchema = z.object({
  plainText: z.boolean().optional(),
  sectionFormat: ExtractFormatType.optional(),
  sentences: z.number().int().min(1).max(10).optional(),
  chars: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(20).optional(),
  introOnly: z.boolean().optional(),
  singleSection: z.boolean().optional(),
});

export const ExtractSchema = z.object({
  extract: z.string(),
  extractHtml: z.string().optional(),
});

// Response Schema Creators
export const createWikimediaResponseSchema = <T extends z.ZodTypeAny>(querySchema: T) =>
  z.object({
    batchcomplete: z.string().optional(),
    continue: z.record(z.any()).optional(),
    limits: z.record(z.any()).optional(),
    warnings: z.record(z.any()).optional(),
    query: querySchema,
  });

export const createSearchResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      search: z.array(SearchResultSchema),
      searchinfo: z
        .object({
          totalhits: z.number(),
          suggestion: z.string().optional(),
          rewrittenquery: z.string().optional(),
        })
        .optional(),
    }),
  );

export const createPageInfoResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(PageInfoSchema),
      normalized: z
        .array(
          z.object({
            from: z.string(),
            to: z.string(),
          }),
        )
        .optional(),
    }),
  );

export const createCategoriesResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(
        z.object({
          categories: z.array(CategorySchema).optional(),
          missing: z.string().optional(),
          ns: z.number().optional(),
          pageid: z.number().optional(),
          title: z.string().optional(),
        }),
      ),
    }),
  );

export const createLinksResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(
        z.object({
          links: z.array(LinkSchema).optional(),
          ...PageSchema.shape,
        }),
      ),
    }),
  );

export const createBacklinksResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      backlinks: z.array(LinkSchema),
    }),
  );

export const createPageImagesResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(
        z.object({
          images: z.array(PageImageSchema).optional(),
          ...PageSchema.shape,
        }),
      ),
    }),
  );

export const createImageInfoResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(
        z.object({
          imageinfo: z.array(ImageInfoSchema).optional(),
          imagerepository: z.string().optional(),
          missing: z.string().optional(),
          ...PageSchema.shape,
        }),
      ),
      normalized: z
        .array(
          z.object({
            from: z.string(),
            to: z.string(),
          }),
        )
        .optional(),
    }),
  );

export const createSearchImagesResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      allimages: z.array(
        z.object({
          ...ImageInfoSchema.shape,
          ns: z.number(),
          title: z.string(),
          name: z.string().optional(),
        }),
      ),
    }),
  );

export const createFileUsageResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(
        z.object({
          fileusage: z.array(FileUsageSchema).optional(),
          missing: z.string().optional(),
          known: z.string().optional(),
          ...PageSchema.shape,
        }),
      ),
      normalized: z
        .array(
          z.object({
            from: z.string(),
            to: z.string(),
          }),
        )
        .optional(),
    }),
  );

export const createGlobalUsageResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(
        z.object({
          globalusage: z.array(GlobalUsageSchema).optional(),
          missing: z.string().optional(),
          known: z.string().optional(),
          ...PageSchema.shape,
        }),
      ),
      normalized: z
        .array(
          z.object({
            from: z.string(),
            to: z.string(),
          }),
        )
        .optional(),
    }),
  );

export const createAllLinksResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      alllinks: z.array(
        z.object({
          title: z.string(),
          pageid: z.number().optional(),
        }),
      ),
    }),
  );

export const createAllPagesResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      allpages: z.array(
        z.object({
          pageid: z.number(),
          ns: z.number(),
          title: z.string(),
        }),
      ),
    }),
  );

export const createExtractsResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(
        z.object({
          ...ExtractSchema.shape,
          ...PageSchema.shape,
        }),
      ),
    }),
  );

// API Parameter Schemas
export const BaseApiParamsSchema = z.object({
  action: z.string(),
  format: z.literal('json'),
});

export const SearchImagesParamsSchema = BaseApiParamsSchema.extend({
  list: z.literal('allimages'),
  aisearch: z.string().optional(),
  aisort: z.string().optional(),
  aidir: z.string().optional(),
  aifrom: z.string().optional(),
  aito: z.string().optional(),
  aistart: z.string().optional(),
  aiend: z.string().optional(),
  aiminsize: z.number().optional(),
  aimaxsize: z.number().optional(),
  aiuser: z.string().optional(),
  aifilterbots: z.string().optional(),
  aisha1: z.string().optional(),
  aiprop: z.string().optional(),
  ailimit: z.number().optional(),
});

export const AllLinksParamsSchema = BaseApiParamsSchema.extend({
  list: z.literal('alllinks'),
  alfrom: z.string().optional(),
  alto: z.string().optional(),
  alprefix: z.string().optional(),
  alunique: z.literal('').optional(),
  alprop: z.string().optional(),
  alnamespace: z.number().optional(),
  allimit: z.number().optional(),
  aldir: z.string().optional(),
});

export const AllPagesParamsSchema = BaseApiParamsSchema.extend({
  list: z.literal('allpages'),
  apfrom: z.string().optional(),
  apto: z.string().optional(),
  apprefix: z.string().optional(),
  apnamespace: z.number().optional(),
  apfilterredir: z.string().optional(),
  apfilterlanglinks: z.string().optional(),
  apminsize: z.number().optional(),
  apmaxsize: z.number().optional(),
  apprtype: z.string().optional(),
  apprlevel: z.string().optional(),
  apprfiltercascade: z.string().optional(),
  apprexpiry: z.string().optional(),
  aplimit: z.number().optional(),
  apdir: z.string().optional(),
});

export const ExtractsParamsSchema = BaseApiParamsSchema.extend({
  prop: z.literal('extracts'),
  titles: z.string(),
  explaintext: z.literal('').optional(),
  exintro: z.literal('').optional(),
  exlimit: z.number().optional(),
  excharacters: z.number().optional(),
  exchars: z.number().optional(),
  exsectionformat: z.string().optional(),
  exsentences: z.number().optional(),
});

/**
 * Schema for page views statistics options
 */
export const PageViewsOptionsSchema = z
  .object({
    start: z.string().optional(), // Start date in YYYYMMDD format
    end: z.string().optional(), // End date in YYYYMMDD format
    granularity: z.enum(['daily', 'monthly']).default('daily'),
    access: z.enum(['all-access', 'desktop', 'mobile-app', 'mobile-web']).default('all-access'),
    agent: z.enum(['all-agents', 'user', 'spider', 'bot']).default('all-agents'),
  })
  .partial();

/**
 * Schema for page views statistics response
 */
export const PageViewsResponseSchema = z.object({
  items: z.array(
    z.object({
      project: z.string(),
      article: z.string(),
      granularity: z.string(),
      timestamp: z.string(),
      access: z.string(),
      agent: z.string(),
      views: z.number(),
    }),
  ),
});

/**
 * Type definition for page views options
 */
export type PageViewsOptions = z.infer<typeof PageViewsOptionsSchema>;

/**
 * Type definition for page views response
 */
export type PageViewsResponse = z.infer<typeof PageViewsResponseSchema>;

/**
 * Schema for revision options
 */
export const RevisionOptionsSchema = z
  .object({
    limit: z.number().int().min(1).max(500).optional(),
    start: z.string().optional(), // Timestamp to start listing from
    end: z.string().optional(), // Timestamp to stop listing at
    direction: z.enum(['newer', 'older']).optional(),
    user: z.string().optional(), // Only list revisions by this user
    excludeUser: z.string().optional(), // Exclude revisions by this user
    tag: z.string().optional(), // Only list revisions with this tag
    properties: z
      .array(
        z.enum([
          'ids',
          'timestamp',
          'flags',
          'comment',
          'parsedcomment',
          'size',
          'sha1',
          'roles',
          'tags',
          'user',
          'userid',
          'content',
        ]),
      )
      .optional(),
  })
  .strict();

/**
 * Schema for a single revision
 */
export const RevisionSchema = z.object({
  revid: z.number(),
  parentid: z.number(),
  minor: z.boolean().optional(),
  user: z.string(),
  userid: z.number().optional(),
  timestamp: z.string(),
  size: z.number(),
  sha1: z.string().optional(),
  roles: z.array(z.string()).optional(),
  comment: z.string().optional(),
  parsedcomment: z.string().optional(),
  tags: z.array(z.string()).optional(),
  content: z.string().optional(),
  anon: z.boolean().optional(),
});

/**
 * Schema for revisions response
 * @returns A schema for the revisions response
 */
export const createRevisionsResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(
        z.object({
          pageid: z.number(),
          ns: z.number(),
          title: z.string(),
          revisions: z.array(RevisionSchema).optional(),
        }),
      ),
    }),
  );

/**
 * Type definition for revision options
 */
export type RevisionOptions = z.infer<typeof RevisionOptionsSchema>;

/**
 * Type definition for a single revision
 */
export type Revision = z.infer<typeof RevisionSchema>;

/**
 * Type definition for revisions response
 */
export type RevisionsResponse = z.infer<ReturnType<typeof createRevisionsResponseSchema>>;

// Type exports
/** Configuration options for the WikimediaClient */
export type WikimediaClientConfig = z.infer<typeof WikimediaClientConfigSchema>;

/** Information about a Wikipedia page */
export type PageInfo = z.infer<typeof PageInfoSchema>;

/** Category information for a Wikipedia page */
export type Category = z.infer<typeof CategorySchema>;

/** Link information from a Wikipedia page */
export type Link = z.infer<typeof LinkSchema>;

/** Search result from a Wikipedia search */
export type SearchResult = z.infer<typeof SearchResultSchema>;

/** Detailed information about an image */
export type ImageInfo = z.infer<typeof ImageInfoSchema>;

/** Image information from a Wikipedia page */
export type PageImage = z.infer<typeof PageImageSchema>;

/** Information about file usage on Wikipedia */
export type FileUsage = z.infer<typeof FileUsageSchema>;

/** Generic response type for Wikimedia API responses */
export type WikimediaResponse<T> = z.infer<
  ReturnType<typeof createWikimediaResponseSchema<z.ZodType<T>>>
>;

/** Sort type for image search results */
export type ImageSortType = z.infer<typeof ImageSortType>;

/** Direction for sorting results */
export type SortDirection = z.infer<typeof SortDirection>;

/** Filter type for bot-created content */
export type BotFilter = z.infer<typeof BotFilter>;

/** Options for searching images */
export type ImageSearchOptions = z.infer<typeof ImageSearchOptionsSchema>;

/** Direction for link enumeration */
export type LinkDirection = z.infer<typeof LinkDirection>;

/** Property type for link enumeration */
export type AllLinksProperty = z.infer<typeof AllLinksPropertySchema>;

/** Options for enumerating links */
export type AllLinksOptions = z.infer<typeof AllLinksOptionsSchema>;

/** Filter type for redirects */
export type RedirectFilter = z.infer<typeof RedirectFilter>;

/** Filter type for language links */
export type LangLinksFilter = z.infer<typeof LangLinksFilter>;

/** Type of page protection */
export type ProtectionType = z.infer<typeof ProtectionType>;

/** Level of page protection */
export type ProtectionLevel = z.infer<typeof ProtectionLevel>;

/** Filter type for cascading protection */
export type CascadeFilter = z.infer<typeof CascadeFilter>;

/** Filter type for protection expiry */
export type ProtectionExpiry = z.infer<typeof ProtectionExpiry>;

/** Options for enumerating pages */
export type AllPagesOptions = z.infer<typeof AllPagesOptionsSchema>;

/** Format type for page extracts */
export type ExtractFormatType = z.infer<typeof ExtractFormatType>;

/** Options for getting page extracts */
export type ExtractOptions = z.infer<typeof ExtractOptionsSchema>;

/** Extract content from a page */
export type Extract = z.infer<typeof ExtractSchema>;

/** Base parameters for API requests */
export type BaseApiParams = z.infer<typeof BaseApiParamsSchema>;

/** Parameters for searching images */
export type SearchImagesParams = z.infer<typeof SearchImagesParamsSchema>;

/** Parameters for enumerating links */
export type AllLinksParams = z.infer<typeof AllLinksParamsSchema>;

/** Parameters for enumerating pages */
export type AllPagesParams = z.infer<typeof AllPagesParamsSchema>;

/** Parameters for getting page extracts */
export type ExtractsParams = z.infer<typeof ExtractsParamsSchema>;
