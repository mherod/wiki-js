import axios, { AxiosInstance } from 'axios';

export interface WikimediaClientConfig {
  baseURL?: string;
  userAgent?: string;
}

export interface WikimediaResponse<T = any> {
  query: T;
  continue?: Record<string, any>;
}

export interface PageInfo {
  pageid: number;
  ns: number;
  title: string;
  contentmodel: string;
  pagelanguage: string;
  length: number;
  touched: string;
  lastrevid: number;
}

export interface Category {
  ns: number;
  title: string;
  sortkey: string;
  timestamp: string;
}

export interface Link {
  ns: number;
  title: string;
}

export interface SearchResult {
  ns: number;
  title: string;
  pageid: number;
  size: number;
  wordcount: number;
  snippet: string;
  timestamp: string;
}

export interface ImageInfo {
  timestamp: string;
  user: string;
  size: number;
  width: number;
  height: number;
  url: string;
  descriptionurl: string;
  mime: string;
  mediatype: string;
  bitdepth: number;
}

export interface PageImage {
  ns: number;
  title: string;
  imageinfo?: ImageInfo[];
}

export interface FileUsage {
  ns: number;
  title: string;
  pageid: number;
}

export class WikimediaClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(config: WikimediaClientConfig = {}) {
    this.baseURL = config.baseURL || 'https://en.wikipedia.org/w/api.php';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'User-Agent': config.userAgent || 'WikimediaJS/0.1.0',
        'Accept': 'application/json',
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
        format: 'json',
        titles: title,
        prop: 'extracts',
        explaintext: true,
      },
    });

    return response.data;
  }

  /**
   * Search for pages
   */
  async search(query: string, limit: number = 10): Promise<WikimediaResponse<{ search: SearchResult[] }>> {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: query,
        srlimit: limit,
      },
    });

    return response.data;
  }

  /**
   * Get page information
   */
  async getPageInfo(title: string): Promise<WikimediaResponse<{ pages: Record<string, PageInfo> }>> {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        format: 'json',
        titles: title,
        prop: 'info',
        inprop: 'url|displaytitle|contentmodel|length|touched|lastrevid',
      },
    });

    return response.data;
  }

  /**
   * Get categories for a page
   */
  async getCategories(title: string): Promise<WikimediaResponse<{ pages: Record<string, { categories: Category[] }> }>> {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        format: 'json',
        titles: title,
        prop: 'categories',
        cllimit: 'max',
      },
    });

    return response.data;
  }

  /**
   * Get links from a page
   */
  async getLinks(title: string): Promise<WikimediaResponse<{ pages: Record<string, { links: Link[] }> }>> {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        format: 'json',
        titles: title,
        prop: 'links',
        pllimit: 'max',
      },
    });

    return response.data;
  }

  /**
   * Get pages that link to a page
   */
  async getBacklinks(title: string, limit: number = 10): Promise<WikimediaResponse<{ backlinks: Link[] }>> {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        format: 'json',
        list: 'backlinks',
        bltitle: title,
        bllimit: limit,
      },
    });

    return response.data;
  }

  /**
   * Get all images used on a page
   */
  async getPageImages(title: string): Promise<WikimediaResponse<{ pages: Record<string, { images: PageImage[] }> }>> {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        format: 'json',
        titles: title,
        prop: 'images',
        imlimit: 'max',
      },
    });

    return response.data;
  }

  /**
   * Get detailed information about specific images
   */
  async getImageInfo(titles: string | string[]): Promise<WikimediaResponse<{ pages: Record<string, ImageInfo> }>> {
    const imagesTitles = Array.isArray(titles) ? titles.join('|') : titles;
    
    const response = await this.client.get('', {
      params: {
        action: 'query',
        format: 'json',
        titles: imagesTitles,
        prop: 'imageinfo',
        iiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
      },
    });

    return response.data;
  }

  /**
   * Search for files/images
   */
  async searchImages(query: string, limit: number = 10): Promise<WikimediaResponse<{ allimages: PageImage[] }>> {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        format: 'json',
        list: 'allimages',
        aisearch: query,
        ailimit: limit,
        aiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
      },
    });

    return response.data;
  }

  /**
   * Find all pages that use a specific file
   */
  async getFileUsage(filename: string): Promise<WikimediaResponse<{ pages: Record<string, { fileusage: FileUsage[] }> }>> {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        format: 'json',
        titles: `File:${filename}`,
        prop: 'fileusage',
        fulimit: 'max',
      },
    });

    return response.data;
  }

  /**
   * Get global usage information for an image across all Wikimedia projects
   */
  async getGlobalUsage(filename: string): Promise<WikimediaResponse<{ pages: Record<string, { globalusage: FileUsage[] }> }>> {
    const response = await this.client.get('', {
      params: {
        action: 'query',
        format: 'json',
        titles: `File:${filename}`,
        prop: 'globalusage',
        gulimit: 'max',
      },
    });

    return response.data;
  }
} 