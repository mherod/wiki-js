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
  // Basic page content and extracts
  await fetchAndSave(
    {
      action: 'query',
      titles: 'JavaScript',
      prop: 'extracts',
      explaintext: 'true',
      exintro: 'true',
      exsentences: '3',
    },
    'page-javascript.json'
  );

  // Search functionality
  await fetchAndSave(
    {
      action: 'query',
      list: 'search',
      srsearch: 'TypeScript',
      srlimit: '5',
      srinfo: 'totalhits|suggestion|rewrittenquery',
    },
    'search-typescript.json'
  );

  // Page info with all properties
  await fetchAndSave(
    {
      action: 'query',
      titles: 'Node.js',
      prop: 'info',
      inprop: 'url|displaytitle|contentmodel|length|touched|lastrevid|preload|displaytitle',
    },
    'page-info-nodejs.json'
  );

  // Categories with sorting and timestamps
  await fetchAndSave(
    {
      action: 'query',
      titles: 'Python (programming language)',
      prop: 'categories',
      cllimit: 'max',
      clshow: 'hidden|!hidden',
      clprop: 'sortkey|timestamp|hidden',
    },
    'categories-python.json'
  );

  // Links with namespaces and IDs
  await fetchAndSave(
    {
      action: 'query',
      titles: 'React (software)',
      prop: 'links',
      pllimit: 'max',
      plnamespace: '0',
      plshow: 'redirect|!redirect',
    },
    'links-react.json'
  );

  // Backlinks with filtering
  await fetchAndSave(
    {
      action: 'query',
      list: 'backlinks',
      bltitle: 'TypeScript',
      bllimit: '10',
      blnamespace: '0',
      blfilterredir: 'nonredirects',
    },
    'backlinks-typescript.json'
  );

  // Images with detailed properties
  await fetchAndSave(
    {
      action: 'query',
      titles: 'DNA',
      prop: 'images',
      imlimit: 'max',
      imnamespace: '6',
    },
    'images-dna.json'
  );

  // Image info with all metadata
  await fetchAndSave(
    {
      action: 'query',
      titles: 'File:DNA Structure+Key+Labelled.pn NoBB.png',
      prop: 'imageinfo',
      iiprop: 'timestamp|user|userid|comment|parsedcomment|canonicaltitle|url|size|dimensions|sha1|mime|mediatype|metadata|commonmetadata|extmetadata|bitdepth|duration|uploadwarning',
    },
    'image-info-dna-structure.json'
  );

  // Image search with various filters
  await fetchAndSave(
    {
      action: 'query',
      list: 'allimages',
      aisearch: 'neural network diagram',
      ailimit: '5',
      aiprop: 'timestamp|user|size|url|mime|mediatype|bitdepth',
      aiminsize: '1000',
      aimaxsize: '5000000',
      aifilterbots: 'nobots',
    },
    'search-images-neural-network.json'
  );

  // File usage across wiki
  await fetchAndSave(
    {
      action: 'query',
      titles: 'File:Artificial_neural_network.svg',
      prop: 'fileusage',
      fulimit: 'max',
      funamespace: '0',
      furedirect: 'true',
    },
    'file-usage-neural-network.json'
  );

  // Global usage across projects
  await fetchAndSave(
    {
      action: 'query',
      titles: 'File:Artificial_neural_network.svg',
      prop: 'globalusage',
      gulimit: 'max',
      gufilterlocal: 'true',
    },
    'global-usage-neural-network.json'
  );

  // All links enumeration
  await fetchAndSave(
    {
      action: 'query',
      list: 'alllinks',
      alnamespace: '0',
      allimit: '10',
      alprop: 'ids|title',
      alunique: '',
      alfrom: 'JavaScript',
      alto: 'Python',
    },
    'all-links.json'
  );

  // All pages enumeration with filters
  await fetchAndSave(
    {
      action: 'query',
      list: 'allpages',
      apnamespace: '0',
      aplimit: '10',
      apfilterredir: 'nonredirects',
      apfilterlanglinks: 'withlanglinks',
      apminsize: '1000',
      apmaxsize: '100000',
      apprtype: 'edit|move',
      apprlevel: 'sysop',
      apprfiltercascade: 'cascading',
      apfrom: 'JavaScript',
      apto: 'Python',
    },
    'all-pages.json'
  );

  // Extracts with various formatting options
  await fetchAndSave(
    {
      action: 'query',
      titles: 'JavaScript|TypeScript',
      prop: 'extracts',
      exintro: 'true',
      exsentences: '5',
      explaintext: 'true',
      exsectionformat: 'wiki',
    },
    'extracts-programming.json'
  );
}

main().catch(console.error).then(() => {
  console.log('✓ All test data fetched and saved');
  process.exit(0);
}, () => {
  process.exit(1);
});
