import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const API_ENDPOINT = 'https://en.wikipedia.org/w/api.php';

async function fetchAndSave(params: Record<string, string>, filename: string) {
  try {
    const response = await axios.get(API_ENDPOINT, {
      params: {
        ...params,
        format: 'json',
      },
    });

    const testDataDir = path.join(process.cwd(), 'test', 'fixtures');
    await fs.mkdir(testDataDir, { recursive: true });
    
    await fs.writeFile(
      path.join(testDataDir, filename),
      JSON.stringify(response.data, null, 2)
    );

    console.log(`✓ Saved ${filename}`);
  } catch (error) {
    console.error(`✗ Failed to fetch ${filename}:`, error);
  }
}

async function main() {
  // Fetch page content for 'JavaScript'
  await fetchAndSave(
    {
      action: 'query',
      titles: 'JavaScript',
      prop: 'extracts',
      explaintext: 'true',
    },
    'page-javascript.json'
  );

  // Fetch search results for 'TypeScript'
  await fetchAndSave(
    {
      action: 'query',
      list: 'search',
      srsearch: 'TypeScript',
      srlimit: '5',
    },
    'search-typescript.json'
  );

  // Fetch page info for 'Node.js'
  await fetchAndSave(
    {
      action: 'query',
      titles: 'Node.js',
      prop: 'info',
      inprop: 'url|displaytitle|contentmodel|length|touched|lastrevid',
    },
    'page-info-nodejs.json'
  );

  // Fetch categories for 'Python (programming language)'
  await fetchAndSave(
    {
      action: 'query',
      titles: 'Python (programming language)',
      prop: 'categories',
      cllimit: 'max',
    },
    'categories-python.json'
  );

  // Fetch links from 'React (software)'
  await fetchAndSave(
    {
      action: 'query',
      titles: 'React (software)',
      prop: 'links',
      pllimit: 'max',
    },
    'links-react.json'
  );

  // Fetch backlinks to 'TypeScript'
  await fetchAndSave(
    {
      action: 'query',
      list: 'backlinks',
      bltitle: 'TypeScript',
      bllimit: '10',
    },
    'backlinks-typescript.json'
  );

  // Fetch images from 'DNA'
  await fetchAndSave(
    {
      action: 'query',
      titles: 'DNA',
      prop: 'images',
      imlimit: 'max',
    },
    'images-dna.json'
  );

  // Fetch image info for a specific diagram
  await fetchAndSave(
    {
      action: 'query',
      titles: 'File:DNA Structure+Key+Labelled.pn NoBB.png',
      prop: 'imageinfo',
      iiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
    },
    'image-info-dna-structure.json'
  );

  // Search for images related to 'neural network'
  await fetchAndSave(
    {
      action: 'query',
      list: 'allimages',
      aisearch: 'neural network diagram',
      ailimit: '5',
      aiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
    },
    'search-images-neural-network.json'
  );

  // Get file usage for a popular diagram
  await fetchAndSave(
    {
      action: 'query',
      titles: 'File:Artificial_neural_network.svg',
      prop: 'fileusage',
      fulimit: 'max',
    },
    'file-usage-neural-network.json'
  );

  // Get global usage for a popular diagram
  await fetchAndSave(
    {
      action: 'query',
      titles: 'File:Artificial_neural_network.svg',
      prop: 'globalusage',
      gulimit: 'max',
    },
    'global-usage-neural-network.json'
  );
}

main().catch(console.error); 