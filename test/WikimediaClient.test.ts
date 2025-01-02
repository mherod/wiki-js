import { WikimediaClient } from '../src/index.js';
import { loadFixture } from './helpers.js';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WikimediaClient', () => {
  let client: WikimediaClient;
  let mockAxiosInstance: jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
    } as any;
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    client = new WikimediaClient();
  });

  afterEach(() => {
    jest.resetAllMocks();
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
          titles: 'JavaScript',
          prop: 'extracts',
          explaintext: true,
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
      const mockResponse = await loadFixture('page-info-nodejs.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getPageInfo('Node.js');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          titles: 'Node.js',
          prop: 'info',
          inprop: 'url|displaytitle|contentmodel|length|touched|lastrevid',
        },
      });
    });
  });

  describe('getCategories', () => {
    it('should fetch categories successfully', async () => {
      const mockResponse = await loadFixture('categories-python.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getCategories('Python (programming language)');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          titles: 'Python (programming language)',
          prop: 'categories',
          cllimit: 'max',
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
          titles: 'React (software)',
          prop: 'links',
          pllimit: 'max',
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
          titles: 'DNA',
          prop: 'images',
          imlimit: 'max',
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
          titles: 'File:DNA Structure+Key+Labelled.pn NoBB.png',
          prop: 'imageinfo',
          iiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
        },
      });
    });

    it('should handle multiple image titles', async () => {
      const mockResponse = await loadFixture('image-info-dna-structure.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const titles = [
        'File:DNA Structure+Key+Labelled.pn NoBB.png',
        'File:Another_image.jpg',
      ];
      
      await client.getImageInfo(titles);
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          titles: titles.join('|'),
          prop: 'imageinfo',
          iiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
        },
      });
    });
  });

  describe('searchImages', () => {
    it('should search images successfully', async () => {
      const mockResponse = await loadFixture('search-images-neural-network.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.searchImages('neural network diagram', 5);
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          list: 'allimages',
          aisearch: 'neural network diagram',
          ailimit: 5,
          aiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
        },
      });
    });
  });

  describe('getFileUsage', () => {
    it('should fetch file usage successfully', async () => {
      const mockResponse = await loadFixture('file-usage-neural-network.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getFileUsage('Artificial_neural_network.svg');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          titles: 'File:Artificial_neural_network.svg',
          prop: 'fileusage',
          fulimit: 'max',
        },
      });
    });
  });

  describe('getGlobalUsage', () => {
    it('should fetch global usage successfully', async () => {
      const mockResponse = await loadFixture('global-usage-neural-network.json');
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getGlobalUsage('Artificial_neural_network.svg');
      
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', {
        params: {
          action: 'query',
          format: 'json',
          titles: 'File:Artificial_neural_network.svg',
          prop: 'globalusage',
          gulimit: 'max',
        },
      });
    });
  });

  describe('configuration', () => {
    it('should use custom baseURL when provided', () => {
      const customBaseURL = 'https://custom.wiki.org/w/api.php';
      const clientWithCustomURL = new WikimediaClient({ baseURL: customBaseURL });
      
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: customBaseURL,
        })
      );
    });

    it('should use custom userAgent when provided', () => {
      const customUserAgent = 'CustomApp/1.0.0';
      const clientWithCustomAgent = new WikimediaClient({ userAgent: customUserAgent });
      
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': customUserAgent,
          }),
        })
      );
    });
  });
}); 