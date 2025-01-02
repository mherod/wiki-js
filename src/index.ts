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
} from './schemas';

export * from './schemas';

export class WikimediaClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(config: WikimediaClientConfig = {}) {
    const validatedConfig = WikimediaClientConfigSchema.parse(config);
    this.baseURL = validatedConfig.baseURL ?? 'https://en.wikipedia.org/w/api.php';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'User-Agent': validatedConfig.userAgent ?? 'WikimediaJS/1.0',
      },
    });
  }

  /**
   * Get page content by title
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
   * Search for pages
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
      ...(validatedOptions.from && (!validatedOptions.sort || validatedOptions.sort === 'name') && { aifrom: validatedOptions.from }),
      ...(validatedOptions.to && (!validatedOptions.sort || validatedOptions.sort === 'name') && { aito: validatedOptions.to }),
      ...(validatedOptions.start && validatedOptions.sort === 'timestamp' && { aistart: validatedOptions.start }),
      ...(validatedOptions.end && validatedOptions.sort === 'timestamp' && { aiend: validatedOptions.end }),
      ...(validatedOptions.minSize && { aiminsize: validatedOptions.minSize }),
      ...(validatedOptions.maxSize && { aimaxsize: validatedOptions.maxSize }),
      ...(validatedOptions.user && validatedOptions.sort === 'timestamp' && { aiuser: validatedOptions.user }),
      ...(validatedOptions.filterBots && validatedOptions.sort === 'timestamp' && { aifilterbots: validatedOptions.filterBots }),
      ...(validatedOptions.sha1 && { aisha1: validatedOptions.sha1 }),
      aiprop: validatedOptions.properties?.join('|') ?? 'timestamp|user|size|url|mime|mediatype|bitdepth',
      ...(validatedOptions.limit && { ailimit: validatedOptions.limit }),
    });

    const response = await this.client.get('', { params });
    return createSearchImagesResponseSchema().parse(response.data);
  }

  /**
   * Find all pages that use a specific file
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
      ...(validatedOptions.filterLangLinks && { apfilterlanglinks: validatedOptions.filterLangLinks }),
      ...(validatedOptions.minSize && { apminsize: validatedOptions.minSize }),
      ...(validatedOptions.maxSize && { apmaxsize: validatedOptions.maxSize }),
      ...(validatedOptions.protectionType && { apprtype: validatedOptions.protectionType.join('|') }),
      ...(validatedOptions.protectionLevel && { apprlevel: validatedOptions.protectionLevel.join('|') }),
      ...(validatedOptions.protectionCascade && { apprfiltercascade: validatedOptions.protectionCascade }),
      ...(validatedOptions.protectionExpiry && { apprexpiry: validatedOptions.protectionExpiry }),
      ...(validatedOptions.limit && { aplimit: validatedOptions.limit }),
      ...(validatedOptions.direction && { apdir: validatedOptions.direction }),
    });

    const response = await this.client.get('', { params });
    return createAllPagesResponseSchema().parse(response.data);
  }

  /**
   * Get plain-text or limited HTML extracts of pages
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
} 