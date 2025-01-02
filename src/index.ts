import axios, { AxiosInstance } from 'axios';
import {
  WikimediaClientConfigSchema,
  createSearchResponseSchema,
  createPageInfoResponseSchema,
  createCategoriesResponseSchema,
  createLinksResponseSchema,
  createBacklinksResponseSchema,
  createPageImagesResponseSchema,
  createImageInfoResponseSchema,
  createSearchImagesResponseSchema,
  createFileUsageResponseSchema,
  createGlobalUsageResponseSchema,
  createAllLinksResponseSchema,
  createAllPagesResponseSchema,
  createExtractsResponseSchema,
  ImageSearchOptionsSchema,
  AllLinksOptionsSchema,
  AllPagesOptionsSchema,
  ExtractOptionsSchema,
  SearchImagesParamsSchema,
  AllLinksParamsSchema,
  AllPagesParamsSchema,
  ExtractsParamsSchema,
  type WikimediaClientConfig,
  type ImageSearchOptions,
  type AllLinksOptions,
  type AllPagesOptions,
  type ExtractOptions,
  PageViewsOptionsSchema,
  PageViewsResponseSchema,
  type PageViewsOptions,
} from './schemas';

export * from './schemas';

/**
 * Client for interacting with the Wikimedia API
 * Provides methods for fetching and searching Wikipedia content
 */
export class WikimediaClient {
  private client: AxiosInstance;
  private baseURL: string;
  private userAgent: string;

  /**
   * Creates a new WikimediaClient instance
   *
   * @param config - Configuration options for the client
   */
  constructor(config: WikimediaClientConfig = {}) {
    const validatedConfig = WikimediaClientConfigSchema.parse(config);
    this.baseURL = validatedConfig.baseURL ?? 'https://en.wikipedia.org/w/api.php';
    this.userAgent = validatedConfig.userAgent ?? 'WikimediaJS/1.0';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'User-Agent': this.userAgent,
      },
    });
  }

  /**
   * Get page content by title
   *
   * @param title - The title of the page to fetch
   * @returns The raw page content response
   */
  async getPage(title: string) {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        prop: 'revisions',
        titles: title,
        rvslots: '*',
        rvprop: 'content',
        format: 'json',
      },
    });
    return response.data;
  }

  /**
   * Search for pages matching a query
   *
   * @param query - The search query
   * @param limit - Maximum number of results to return (default: 10)
   * @returns Search results matching the query
   */
  async search(query: string, limit: number = 10) {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        srlimit: limit,
        format: 'json',
      },
    });
    return createSearchResponseSchema().parse(response.data);
  }

  /**
   * Get page information
   *
   * @param title - The title of the page
   * @returns Information about the page
   */
  async getPageInfo(title: string) {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        prop: 'info',
        titles: title,
        format: 'json',
      },
    });
    return createPageInfoResponseSchema().parse(response.data);
  }

  /**
   * Get categories for a page
   *
   * @param title - The title of the page
   * @returns Categories the page belongs to
   */
  async getCategories(title: string) {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        prop: 'categories',
        titles: title,
        format: 'json',
      },
    });
    return createCategoriesResponseSchema().parse(response.data);
  }

  /**
   * Get links from a page
   *
   * @param title - The title of the page
   * @returns Links found on the page
   */
  async getLinks(title: string) {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        prop: 'links',
        titles: title,
        format: 'json',
      },
    });
    return createLinksResponseSchema().parse(response.data);
  }

  /**
   * Get pages that link to a page
   *
   * @param title - The title of the page
   * @param limit - Maximum number of backlinks to return (default: 10)
   * @returns Pages that link to the specified page
   */
  async getBacklinks(title: string, limit: number = 10) {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        list: 'backlinks',
        bltitle: title,
        bllimit: limit,
        format: 'json',
      },
    });
    return createBacklinksResponseSchema().parse(response.data);
  }

  /**
   * Get all images used on a page
   *
   * @param title - The title of the page
   * @returns Images used on the page
   */
  async getPageImages(title: string) {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        prop: 'images',
        titles: title,
        format: 'json',
      },
    });
    return createPageImagesResponseSchema().parse(response.data);
  }

  /**
   * Get detailed information about specific images
   *
   * @param titles - Title or titles of the images
   * @returns Detailed information about the specified images
   */
  async getImageInfo(titles: string | string[]) {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        prop: 'imageinfo',
        titles: Array.isArray(titles) ? titles.join('|') : titles,
        iiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
        format: 'json',
      },
    });
    return createImageInfoResponseSchema().parse(response.data);
  }

  /**
   * Search for files/images with advanced options
   *
   * @param query - The search query
   * @param options - Advanced search options
   * @returns Search results matching the query and options
   */
  async searchImages(query: string, options: ImageSearchOptions = {}) {
    const validatedOptions = ImageSearchOptionsSchema.parse(options);

    const params = SearchImagesParamsSchema.parse({
      action: 'query',
      list: 'allimages',
      format: 'json',
      ...(query && { aisearch: query }),
      ...(validatedOptions.sort && { aisort: validatedOptions.sort }),
      ...(validatedOptions.direction && { aidir: validatedOptions.direction }),
      ...(validatedOptions.from &&
        (!validatedOptions.sort || validatedOptions.sort === 'name') && {
          aifrom: validatedOptions.from,
        }),
      ...(validatedOptions.to &&
        (!validatedOptions.sort || validatedOptions.sort === 'name') && {
          aito: validatedOptions.to,
        }),
      ...(validatedOptions.start &&
        validatedOptions.sort === 'timestamp' && { aistart: validatedOptions.start }),
      ...(validatedOptions.end &&
        validatedOptions.sort === 'timestamp' && { aiend: validatedOptions.end }),
      ...(validatedOptions.minSize && { aiminsize: validatedOptions.minSize }),
      ...(validatedOptions.maxSize && { aimaxsize: validatedOptions.maxSize }),
      ...(validatedOptions.user &&
        validatedOptions.sort === 'timestamp' && { aiuser: validatedOptions.user }),
      ...(validatedOptions.filterBots &&
        validatedOptions.sort === 'timestamp' && { aifilterbots: validatedOptions.filterBots }),
      ...(validatedOptions.sha1 && { aisha1: validatedOptions.sha1 }),
      aiprop:
        validatedOptions.properties?.join('|') ?? 'timestamp|user|size|url|mime|mediatype|bitdepth',
      ...(validatedOptions.limit && { ailimit: validatedOptions.limit }),
    });

    const response = await this.client.get('', { params });
    return createSearchImagesResponseSchema().parse(response.data);
  }

  /**
   * Find all pages that use a specific file
   *
   * @param filename - The name of the file
   * @returns Pages that use the specified file
   */
  async getFileUsage(filename: string) {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        prop: 'fileusage',
        titles: filename,
        format: 'json',
      },
    });
    return createFileUsageResponseSchema().parse(response.data);
  }

  /**
   * Get global usage information for an image across all Wikimedia projects
   *
   * @param filename - The name of the file
   * @returns Global usage information for the image
   */
  async getGlobalUsage(filename: string) {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        prop: 'globalusage',
        titles: filename,
        format: 'json',
      },
    });
    return createGlobalUsageResponseSchema().parse(response.data);
  }

  /**
   * Enumerate all links that point to a given namespace
   *
   * @param options - Options for filtering and limiting the results
   * @returns Links matching the specified criteria
   */
  async getAllLinks(options: AllLinksOptions = {}) {
    const validatedOptions = AllLinksOptionsSchema.parse(options);

    const params = AllLinksParamsSchema.parse({
      action: 'query',
      list: 'alllinks',
      format: 'json',
      ...(validatedOptions.from && { alfrom: validatedOptions.from }),
      ...(validatedOptions.to && { alto: validatedOptions.to }),
      ...(validatedOptions.prefix && { alprefix: validatedOptions.prefix }),
      ...(validatedOptions.unique && { alunique: '' }),
      alprop: validatedOptions.properties?.join('|') ?? 'title',
      ...(validatedOptions.namespace !== undefined && { alnamespace: validatedOptions.namespace }),
      ...(validatedOptions.limit && { allimit: validatedOptions.limit }),
      ...(validatedOptions.direction && { aldir: validatedOptions.direction }),
    });

    const response = await this.client.get('', { params });
    return createAllLinksResponseSchema().parse(response.data);
  }

  /**
   * Enumerate all pages sequentially in a given namespace
   *
   * @param options - Options for filtering and limiting the results
   * @returns Pages matching the specified criteria
   */
  async getAllPages(options: AllPagesOptions = {}) {
    const validatedOptions = AllPagesOptionsSchema.parse(options);

    const params = AllPagesParamsSchema.parse({
      action: 'query',
      list: 'allpages',
      format: 'json',
      ...(validatedOptions.from && { apfrom: validatedOptions.from }),
      ...(validatedOptions.to && { apto: validatedOptions.to }),
      ...(validatedOptions.prefix && { apprefix: validatedOptions.prefix }),
      ...(validatedOptions.namespace !== undefined && { apnamespace: validatedOptions.namespace }),
      ...(validatedOptions.filterRedirects && { apfilterredir: validatedOptions.filterRedirects }),
      ...(validatedOptions.filterLangLinks && {
        apfilterlanglinks: validatedOptions.filterLangLinks,
      }),
      ...(validatedOptions.minSize && { apminsize: validatedOptions.minSize }),
      ...(validatedOptions.maxSize && { apmaxsize: validatedOptions.maxSize }),
      ...(validatedOptions.protectionType && {
        apprtype: validatedOptions.protectionType.join('|'),
      }),
      ...(validatedOptions.protectionLevel && {
        apprlevel: validatedOptions.protectionLevel.join('|'),
      }),
      ...(validatedOptions.protectionCascade && {
        apprfiltercascade: validatedOptions.protectionCascade,
      }),
      ...(validatedOptions.protectionExpiry && { apprexpiry: validatedOptions.protectionExpiry }),
      ...(validatedOptions.limit && { aplimit: validatedOptions.limit }),
      ...(validatedOptions.direction && { apdir: validatedOptions.direction }),
    });

    const response = await this.client.get('', { params });
    return createAllPagesResponseSchema().parse(response.data);
  }

  /**
   * Get plain-text or limited HTML extracts of pages
   *
   * @param titles - Title or titles of the pages
   * @param options - Options for customizing the extract
   * @returns Extracts from the specified pages
   */
  async getExtracts(titles: string | string[], options: ExtractOptions = {}) {
    const validatedOptions = ExtractOptionsSchema.parse(options);

    const params = ExtractsParamsSchema.parse({
      action: 'query',
      prop: 'extracts',
      titles: Array.isArray(titles) ? titles.join('|') : titles,
      format: 'json',
      ...(validatedOptions.plainText && { explaintext: '' }),
      ...(validatedOptions.sectionFormat && { exsectionformat: validatedOptions.sectionFormat }),
      ...(validatedOptions.sentences && { exsentences: validatedOptions.sentences }),
      ...(validatedOptions.chars && { exchars: validatedOptions.chars }),
      ...(validatedOptions.limit && { exlimit: validatedOptions.limit }),
      ...(validatedOptions.introOnly && { exintro: '' }),
      ...(validatedOptions.singleSection && { exsectionformat: 'raw' }),
    });

    const response = await this.client.get('', { params });
    return createExtractsResponseSchema().parse(response.data);
  }

  /**
   * Get page views statistics for a given article
   * 
   * @param title - The title of the article
   * @param options - Options for filtering page views data
   * @returns Page views statistics
   */
  async getPageViews(title: string, options: PageViewsOptions = {}) {
    const validatedOptions = PageViewsOptionsSchema.parse(options);
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const start = validatedOptions.start ?? 
      thirtyDaysAgo.toISOString().slice(0, 10).replace(/-/g, '');
    const end = validatedOptions.end ?? 
      today.toISOString().slice(0, 10).replace(/-/g, '');

    const encodedTitle = encodeURIComponent(title).replace(/[!'()*]/g, c => 
      '%' + c.charCodeAt(0).toString(16).toUpperCase()
    );

    const response = await this.client.get(
      `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/` +
      `${validatedOptions.access ?? 'all-access'}/` +
      `${validatedOptions.agent ?? 'all-agents'}/` +
      `${encodedTitle}/` +
      `${validatedOptions.granularity ?? 'daily'}/` +
      `${start}/${end}`,
      {
        baseURL: '', // Override baseURL for this request
      }
    );

    return PageViewsResponseSchema.parse(response.data);
  }
}
