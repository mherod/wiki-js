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
  properties: z.array(z.enum([
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
    'badfile'
  ])).optional(),
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
      searchinfo: z.object({
        totalhits: z.number(),
        suggestion: z.string().optional(),
        rewrittenquery: z.string().optional(),
      }).optional(),
    })
  );

export const createPageInfoResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(PageInfoSchema),
      normalized: z.array(
        z.object({
          from: z.string(),
          to: z.string(),
        })
      ).optional(),
    })
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
        })
      ),
    })
  );

export const createLinksResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(
        z.object({
          links: z.array(LinkSchema).optional(),
          ...PageSchema.shape,
        })
      ),
    })
  );

export const createBacklinksResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      backlinks: z.array(LinkSchema),
    })
  );

export const createPageImagesResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(
        z.object({
          images: z.array(PageImageSchema).optional(),
          ...PageSchema.shape,
        })
      ),
    })
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
        })
      ),
      normalized: z.array(
        z.object({
          from: z.string(),
          to: z.string(),
        })
      ).optional(),
    })
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
        })
      ),
    })
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
        })
      ),
      normalized: z.array(
        z.object({
          from: z.string(),
          to: z.string(),
        })
      ).optional(),
    })
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
        })
      ),
      normalized: z.array(
        z.object({
          from: z.string(),
          to: z.string(),
        })
      ).optional(),
    })
  );

export const createAllLinksResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      alllinks: z.array(
        z.object({
          title: z.string(),
          pageid: z.number().optional(),
        })
      ),
    })
  );

export const createAllPagesResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      allpages: z.array(
        z.object({
          pageid: z.number(),
          ns: z.number(),
          title: z.string(),
        })
      ),
    })
  );

export const createExtractsResponseSchema = () =>
  createWikimediaResponseSchema(
    z.object({
      pages: z.record(
        z.object({
          ...ExtractSchema.shape,
          ...PageSchema.shape,
        })
      ),
    })
  );

// Type exports
export type WikimediaClientConfig = z.infer<typeof WikimediaClientConfigSchema>;
export type PageInfo = z.infer<typeof PageInfoSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Link = z.infer<typeof LinkSchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type ImageInfo = z.infer<typeof ImageInfoSchema>;
export type PageImage = z.infer<typeof PageImageSchema>;
export type FileUsage = z.infer<typeof FileUsageSchema>;
export type WikimediaResponse<T> = z.infer<ReturnType<typeof createWikimediaResponseSchema<z.ZodType<T>>>>;
export type ImageSortType = z.infer<typeof ImageSortType>;
export type SortDirection = z.infer<typeof SortDirection>;
export type BotFilter = z.infer<typeof BotFilter>;
export type ImageSearchOptions = z.infer<typeof ImageSearchOptionsSchema>;
export type LinkDirection = z.infer<typeof LinkDirection>;
export type AllLinksProperty = z.infer<typeof AllLinksPropertySchema>;
export type AllLinksOptions = z.infer<typeof AllLinksOptionsSchema>;
export type RedirectFilter = z.infer<typeof RedirectFilter>;
export type LangLinksFilter = z.infer<typeof LangLinksFilter>;
export type ProtectionType = z.infer<typeof ProtectionType>;
export type ProtectionLevel = z.infer<typeof ProtectionLevel>;
export type CascadeFilter = z.infer<typeof CascadeFilter>;
export type ProtectionExpiry = z.infer<typeof ProtectionExpiry>;
export type AllPagesOptions = z.infer<typeof AllPagesOptionsSchema>;
export type ExtractFormatType = z.infer<typeof ExtractFormatType>;
export type ExtractOptions = z.infer<typeof ExtractOptionsSchema>;
export type Extract = z.infer<typeof ExtractSchema>; 