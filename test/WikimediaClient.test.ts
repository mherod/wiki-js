import { WikimediaClient } from '../src';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockAxiosInstance = {
  get: jest.fn(),
};
mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

async function loadFixture(filename: string) {
  const fixturePath = path.join(process.cwd(), 'test', 'fixtures', filename);
  const content = await fs.readFile(fixturePath, 'utf-8');
  return JSON.parse(content);
}

describe('WikimediaClient', () => {
  let client: WikimediaClient;

  beforeEach(() => {
    client = new WikimediaClient();
    jest.clearAllMocks();
  });

  describe('getPage', () => {
    it('should fetch page content successfully', async () => {
      const mockResponse = await loadFixture('page-javascript.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getPage('JavaScript');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'revisions',
          titles: 'JavaScript',
          rvslots: '*',
          rvprop: 'content',
        },
      });
    });
  });

  describe('search', () => {
    it('should search pages successfully', async () => {
      const mockResponse = await loadFixture('search-typescript.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.search('TypeScript', 5);
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          list: 'search',
          srsearch: 'TypeScript',
          srlimit: 5,
        },
      });
    });
  });

  describe('getPageInfo', () => {
    it('should fetch page info successfully', async () => {
      const mockResponse = {
        query: {
          pages: {
            '26415635': {
              pageid: 26415635,
              ns: 0,
              title: 'Node.js',
              contentmodel: 'wikitext',
              pagelanguage: 'en',
              pagelanguagedir: 'ltr',
              pagelanguagehtmlcode: 'en',
              touched: '2024-12-28T16:39:01Z',
              lastrevid: 1265311049,
              length: 35534,
              fullurl: 'https://en.wikipedia.org/wiki/Node.js',
              editurl: 'https://en.wikipedia.org/w/index.php?title=Node.js&action=edit',
              canonicalurl: 'https://en.wikipedia.org/wiki/Node.js',
              displaytitle: 'Node.js',
            },
          },
        },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getPageInfo('Node.js');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'info',
          titles: 'Node.js',
        },
      });
    });
  });

  describe('getCategories', () => {
    it('should fetch categories successfully', async () => {
      const mockResponse = {
        query: {
          pages: {
            '23862': {
              pageid: 23862,
              ns: 0,
              title: 'Python (programming language)',
              categories: [
                {
                  ns: 14,
                  title: 'Category:Programming languages',
                  sortkey: 'Python',
                  sortkeyprefix: 'Python',
                },
              ],
            },
          },
        },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getCategories('Python (programming language)');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'categories',
          titles: 'Python (programming language)',
        },
      });
    });
  });

  describe('getLinks', () => {
    it('should fetch links successfully', async () => {
      const mockResponse = await loadFixture('links-react.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getLinks('React (software)');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'links',
          titles: 'React (software)',
        },
      });
    });
  });

  describe('getBacklinks', () => {
    it('should fetch backlinks successfully', async () => {
      const mockResponse = await loadFixture('backlinks-typescript.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getBacklinks('TypeScript', 10);
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          list: 'backlinks',
          bltitle: 'TypeScript',
          bllimit: 10,
        },
      });
    });
  });

  describe('getPageImages', () => {
    it('should fetch page images successfully', async () => {
      const mockResponse = await loadFixture('images-dna.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getPageImages('DNA');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'images',
          titles: 'DNA',
        },
      });
    });
  });

  describe('getImageInfo', () => {
    it('should fetch image info successfully', async () => {
      const mockResponse = await loadFixture('image-info-dna-structure.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getImageInfo('File:DNA Structure+Key+Labelled.pn NoBB.png');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'imageinfo',
          titles: 'File:DNA Structure+Key+Labelled.pn NoBB.png',
          iiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
        },
      });
    });

    it('should handle multiple image titles', async () => {
      const mockResponse = await loadFixture('image-info-dna-structure.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await client.getImageInfo(['File:Image1.jpg', 'File:Image2.jpg']);
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'imageinfo',
          titles: 'File:Image1.jpg|File:Image2.jpg',
          iiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
        },
      });
    });
  });

  describe('searchImages', () => {
    const mockImageInfo = {
      ns: 6,
      title: 'File:Neural Network.png',
      timestamp: '2024-01-01T00:00:00Z',
      user: 'TestUser',
      size: 1000,
      width: 800,
      height: 600,
      url: 'https://example.com/image.png',
      descriptionurl: 'https://example.com/description',
      mime: 'image/png',
      mediatype: 'BITMAP',
      bitdepth: 24,
    };

    it('should search images with default options', async () => {
      const mockResponse = {
        query: {
          allimages: [mockImageInfo],
        },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.searchImages('neural network');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          action: 'query',
          list: 'allimages',
          format: 'json',
          aisearch: 'neural network',
          aiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
        }),
      });
    });

    it('should search images with custom options', async () => {
      const mockResponse = {
        query: {
          allimages: [mockImageInfo],
        },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.searchImages('neural network', {
        sort: 'timestamp',
        direction: 'descending',
        limit: 10,
        properties: ['timestamp', 'user'],
      });
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          aisort: 'timestamp',
          aidir: 'descending',
          ailimit: 10,
          aiprop: 'timestamp|user',
        }),
      });
    });

    it('should handle name-based sorting options', async () => {
      const mockResponse = {
        query: {
          allimages: [mockImageInfo],
        },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await client.searchImages('test', {
        sort: 'name',
        from: 'A',
        to: 'B',
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          aisort: 'name',
          aifrom: 'A',
          aito: 'B',
        }),
      });
    });

    it('should handle timestamp-based sorting options', async () => {
      const mockResponse = {
        query: {
          allimages: [mockImageInfo],
        },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await client.searchImages('test', {
        sort: 'timestamp',
        start: '2024-01-01',
        end: '2024-01-31',
        user: 'TestUser',
        filterBots: 'nobots',
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          aisort: 'timestamp',
          aistart: '2024-01-01',
          aiend: '2024-01-31',
          aiuser: 'TestUser',
          aifilterbots: 'nobots',
        }),
      });
    });

    it('should handle size and sha1 options', async () => {
      const mockResponse = {
        query: {
          allimages: [mockImageInfo],
        },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await client.searchImages('test', {
        minSize: 1000,
        maxSize: 5000,
        sha1: 'abc123',
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          aiminsize: 1000,
          aimaxsize: 5000,
          aisha1: 'abc123',
        }),
      });
    });

    it('should validate options', async () => {
      await expect(client.searchImages('test', {
        sort: 'invalid' as any,
      })).rejects.toThrow();
    });
  });

  describe('getFileUsage', () => {
    it('should fetch file usage successfully', async () => {
      const mockResponse = await loadFixture('file-usage-neural-network.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getFileUsage('File:Artificial_neural_network.svg');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'fileusage',
          titles: 'File:Artificial_neural_network.svg',
        },
      });
    });
  });

  describe('getGlobalUsage', () => {
    it('should fetch global usage successfully', async () => {
      const mockResponse = await loadFixture('global-usage-neural-network.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getGlobalUsage('File:Artificial_neural_network.svg');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'globalusage',
          titles: 'File:Artificial_neural_network.svg',
        },
      });
    });
  });

  describe('getAllLinks', () => {
    it('should fetch all links with default options', async () => {
      const mockResponse = {
        query: {
          alllinks: [
            {
              title: 'Example Link',
              pageid: 12345,
            },
          ],
        },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getAllLinks();
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          action: 'query',
          list: 'alllinks',
          format: 'json',
          alprop: 'title',
        }),
      });
    });

    it('should fetch all links with custom options', async () => {
      const mockResponse = { query: { alllinks: [] } };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await client.getAllLinks({
        from: 'A',
        to: 'B',
        prefix: 'Test',
        unique: true,
        properties: ['ids', 'title'],
        namespace: 0,
        limit: 100,
        direction: 'descending',
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          alfrom: 'A',
          alto: 'B',
          alprefix: 'Test',
          alunique: '',
          alprop: 'ids|title',
          alnamespace: 0,
          allimit: 100,
          aldir: 'descending',
        }),
      });
    });

    it('should validate options', async () => {
      await expect(client.getAllLinks({
        namespace: -3,
      })).rejects.toThrow();
    });
  });

  describe('getAllPages', () => {
    it('should fetch all pages with default options', async () => {
      const mockResponse = {
        query: {
          allpages: [
            {
              pageid: 12345,
              ns: 0,
              title: 'Example Page',
            },
          ],
        },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getAllPages();
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          action: 'query',
          list: 'allpages',
          format: 'json',
        }),
      });
    });

    it('should fetch all pages with custom options', async () => {
      const mockResponse = { query: { allpages: [] } };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await client.getAllPages({
        from: 'A',
        to: 'B',
        prefix: 'Test',
        namespace: 0,
        filterRedirects: 'redirects',
        filterLangLinks: 'withlanglinks',
        minSize: 1000,
        maxSize: 5000,
        protectionType: ['edit', 'move'],
        protectionLevel: ['sysop'],
        protectionCascade: 'cascading',
        protectionExpiry: 'indefinite',
        limit: 100,
        direction: 'descending',
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          apfrom: 'A',
          apto: 'B',
          apprefix: 'Test',
          apnamespace: 0,
          apfilterredir: 'redirects',
          apfilterlanglinks: 'withlanglinks',
          apminsize: 1000,
          apmaxsize: 5000,
          apprtype: 'edit|move',
          apprlevel: 'sysop',
          apprfiltercascade: 'cascading',
          apprexpiry: 'indefinite',
          aplimit: 100,
          apdir: 'descending',
        }),
      });
    });

    it('should validate options', async () => {
      await expect(client.getAllPages({
        namespace: -1,
      })).rejects.toThrow();
    });
  });

  describe('getExtracts', () => {
    it('should fetch extracts with default options', async () => {
      const mockResponse = await loadFixture('extracts-programming.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getExtracts('JavaScript');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'extracts',
          titles: 'JavaScript',
        },
      });
    });

    it('should fetch extracts with custom options', async () => {
      const mockResponse = await loadFixture('extracts-programming.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await client.getExtracts(['JavaScript', 'TypeScript'], {
        plainText: true,
        sectionFormat: 'wiki',
        sentences: 5,
        chars: 1000,
        limit: 10,
        introOnly: true,
        singleSection: true,
      });
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'extracts',
          titles: 'JavaScript|TypeScript',
          explaintext: '',
          exsentences: 5,
          exchars: 1000,
          exlimit: 10,
          exintro: '',
          exsectionformat: 'raw',
        },
      });
    });

    it('should validate options', async () => {
      await expect(client.getExtracts('JavaScript', {
        sentences: 11,
      })).rejects.toThrow();

      await expect(client.getExtracts('JavaScript', {
        sentences: 0,
      })).rejects.toThrow();

      await expect(client.getExtracts('JavaScript', {
        chars: -1,
      })).rejects.toThrow();

      await expect(client.getExtracts('JavaScript', {
        limit: 21,
      })).rejects.toThrow();

      await expect(client.getExtracts('JavaScript', {
        sectionFormat: 'invalid' as any,
      })).rejects.toThrow();
    });
  });

  describe('configuration', () => {
    it('should use custom baseURL when provided', () => {
      const customBaseURL = 'https://custom.wiki.api';
      const client = new WikimediaClient({ baseURL: customBaseURL });
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: customBaseURL,
        })
      );
    });

    it('should use custom userAgent when provided', () => {
      const customUserAgent = 'CustomBot/1.0';
      const client = new WikimediaClient({ userAgent: customUserAgent });
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': customUserAgent,
          }),
        })
      );
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const errorResponse = {
        error: {
          code: 'invalid_parameter',
          info: 'Invalid parameter',
        },
      };
      mockAxiosInstance.get.mockRejectedValue(new Error('Invalid parameter'));

      await expect(client.getPage('Invalid Page')).rejects.toThrow('Invalid parameter');
    });

    it('should handle network errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network Error'));

      await expect(client.getPage('Any Page')).rejects.toThrow('Network Error');
    });
  });

  describe('searchImages edge cases', () => {
    const mockImageInfo = {
      ns: 6,
      title: 'File:Neural Network.png',
      timestamp: '2024-01-01T00:00:00Z',
      user: 'TestUser',
      size: 1000,
      width: 800,
      height: 600,
      url: 'https://example.com/image.png',
      descriptionurl: 'https://example.com/description',
      mime: 'image/png',
      mediatype: 'BITMAP',
      bitdepth: 24,
    };

    it('should handle empty query string', async () => {
      const mockResponse = {
        query: {
          allimages: [mockImageInfo],
        },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await client.searchImages('');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.not.objectContaining({
          aisearch: expect.anything(),
        }),
      });
    });

    it('should handle mixed sorting options', async () => {
      const mockResponse = {
        query: {
          allimages: [mockImageInfo],
        },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      // Test with timestamp sort but name-based parameters
      await client.searchImages('test', {
        sort: 'timestamp',
        from: 'A', // Should be ignored for timestamp sort
        to: 'B',   // Should be ignored for timestamp sort
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.not.objectContaining({
          aifrom: expect.anything(),
          aito: expect.anything(),
        }),
      });

      // Test with name sort but timestamp-based parameters
      await client.searchImages('test', {
        sort: 'name',
        start: '2024-01-01', // Should be ignored for name sort
        end: '2024-01-31',   // Should be ignored for name sort
        user: 'TestUser',    // Should be ignored for name sort
        filterBots: 'nobots', // Should be ignored for name sort
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.not.objectContaining({
          aistart: expect.anything(),
          aiend: expect.anything(),
          aiuser: expect.anything(),
          aifilterbots: expect.anything(),
        }),
      });
    });
  });

  describe('getAllLinks edge cases', () => {
    it('should handle empty properties array', async () => {
      const mockResponse = { query: { alllinks: [] } };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await client.getAllLinks({
        properties: [],
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          action: 'query',
          format: 'json',
          list: 'alllinks',
          alprop: '',
        }),
      });
    });
  });

  describe('getAllPages edge cases', () => {
    it('should handle empty protection arrays', async () => {
      const mockResponse = { query: { allpages: [] } };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await client.getAllPages({
        protectionType: [],
        protectionLevel: [],
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          action: 'query',
          format: 'json',
          list: 'allpages',
        }),
      });
    });
  });

  describe('getExtracts edge cases', () => {
    it('should handle empty titles array', async () => {
      await expect(client.getExtracts([])).rejects.toThrow();
    });

    it('should handle singleSection without sectionFormat', async () => {
      const mockResponse = { query: { pages: {} } };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      await client.getExtracts('Test', {
        singleSection: true,
        // sectionFormat not provided
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: expect.objectContaining({
          exsectionformat: 'raw',
        }),
      });
    });
  });
}); 