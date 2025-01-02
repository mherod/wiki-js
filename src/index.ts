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
    
    const params: Record<string, any> = {
      action: 'query',
      list: 'allimages',
      format: 'json',
    };

    if (query) {
      params.aisearch = query;
    }

    if (validatedOptions.sort) {
      params.aisort = validatedOptions.sort;
    }

    if (validatedOptions.direction) {
      params.aidir = validatedOptions.direction;
    }

    if (validatedOptions.from && (!validatedOptions.sort || validatedOptions.sort === 'name')) {
      params.aifrom = validatedOptions.from;
    }

    if (validatedOptions.to && (!validatedOptions.sort || validatedOptions.sort === 'name')) {
      params.aito = validatedOptions.to;
    }

    if (validatedOptions.start && validatedOptions.sort === 'timestamp') {
      params.aistart = validatedOptions.start;
    }

    if (validatedOptions.end && validatedOptions.sort === 'timestamp') {
      params.aiend = validatedOptions.end;
    }

    if (validatedOptions.minSize) {
      params.aiminsize = validatedOptions.minSize;
    }

    if (validatedOptions.maxSize) {
      params.aimaxsize = validatedOptions.maxSize;
    }

    if (validatedOptions.user && validatedOptions.sort === 'timestamp') {
      params.aiuser = validatedOptions.user;
    }

    if (validatedOptions.filterBots && validatedOptions.sort === 'timestamp') {
      params.aifilterbots = validatedOptions.filterBots;
    }

    if (validatedOptions.sha1) {
      params.aisha1 = validatedOptions.sha1;
    }

    if (validatedOptions.properties) {
      params.aiprop = validatedOptions.properties.join('|');
    } else {
      params.aiprop = 'timestamp|user|size|url|mime|mediatype|bitdepth';
    }

    if (validatedOptions.limit) {
      params.ailimit = validatedOptions.limit;
    }

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
    
    const params: Record<string, any> = {
      action: 'query',
      list: 'alllinks',
      format: 'json',
    };

    if (validatedOptions.from) {
      params.alfrom = validatedOptions.from;
    }

    if (validatedOptions.to) {
      params.alto = validatedOptions.to;
    }

    if (validatedOptions.prefix) {
      params.alprefix = validatedOptions.prefix;
    }

    if (validatedOptions.unique) {
      params.alunique = '';
    }

    if (validatedOptions.properties) {
      params.alprop = validatedOptions.properties.join('|');
    } else {
      params.alprop = 'title';
    }

    if (validatedOptions.namespace !== undefined) {
      params.alnamespace = validatedOptions.namespace;
    }

    if (validatedOptions.limit) {
      params.allimit = validatedOptions.limit;
    }

    if (validatedOptions.direction) {
      params.aldir = validatedOptions.direction;
    }

    const response = await this.client.get('', { params });
    return createAllLinksResponseSchema().parse(response.data);
  }

  /**
   * Enumerate all pages sequentially in a given namespace
   */
  async getAllPages(options: AllPagesOptions = {}) {
    const validatedOptions = AllPagesOptionsSchema.parse(options);
    
    const params: Record<string, any> = {
      action: 'query',
      list: 'allpages',
      format: 'json',
    };

    if (validatedOptions.from) {
      params.apfrom = validatedOptions.from;
    }

    if (validatedOptions.to) {
      params.apto = validatedOptions.to;
    }

    if (validatedOptions.prefix) {
      params.apprefix = validatedOptions.prefix;
    }

    if (validatedOptions.namespace !== undefined) {
      params.apnamespace = validatedOptions.namespace;
    }

    if (validatedOptions.filterRedirects) {
      params.apfilterredir = validatedOptions.filterRedirects;
    }

    if (validatedOptions.filterLangLinks) {
      params.apfilterlanglinks = validatedOptions.filterLangLinks;
    }

    if (validatedOptions.minSize) {
      params.apminsize = validatedOptions.minSize;
    }

    if (validatedOptions.maxSize) {
      params.apmaxsize = validatedOptions.maxSize;
    }

    if (validatedOptions.protectionType) {
      params.apprtype = validatedOptions.protectionType.join('|');
    }

    if (validatedOptions.protectionLevel) {
      params.apprlevel = validatedOptions.protectionLevel.join('|');
    }

    if (validatedOptions.protectionCascade) {
      params.apprfiltercascade = validatedOptions.protectionCascade;
    }

    if (validatedOptions.protectionExpiry) {
      params.apprexpiry = validatedOptions.protectionExpiry;
    }

    if (validatedOptions.limit) {
      params.aplimit = validatedOptions.limit;
    }

    if (validatedOptions.direction) {
      params.apdir = validatedOptions.direction;
    }

    const response = await this.client.get('', { params });
    return createAllPagesResponseSchema().parse(response.data);
  }

  /**
   * Get plain-text or limited HTML extracts of pages
   */
  async getExtracts(titles: string | string[], options: ExtractOptions = {}) {
    const validatedOptions = ExtractOptionsSchema.parse(options);
    
    const params: Record<string, any> = {
      action: 'query',
      prop: 'extracts',
      titles: Array.isArray(titles) ? titles.join('|') : titles,
      format: 'json',
    };

    if (validatedOptions.plainText) {
      params.explaintext = '';
    }

    if (validatedOptions.sectionFormat) {
      params.exsectionformat = validatedOptions.sectionFormat;
    }

    if (validatedOptions.sentences) {
      params.exsentences = validatedOptions.sentences;
    }

    if (validatedOptions.chars) {
      params.exchars = validatedOptions.chars;
    }

    if (validatedOptions.limit) {
      params.exlimit = validatedOptions.limit;
    }

    if (validatedOptions.introOnly) {
      params.exintro = '';
    }

    if (validatedOptions.singleSection) {
      params.exsectionformat = 'raw';
    }

    const response = await this.client.get('', { params });
    return createExtractsResponseSchema().parse(response.data);
  }
} 