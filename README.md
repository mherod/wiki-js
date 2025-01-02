# wiki-js

A modern JavaScript/TypeScript library for interacting with the Wikimedia API. This library provides a type-safe way to fetch and interact with Wikipedia pages, categories, and media.

## Installation

```bash
# Using pnpm (recommended)
pnpm add wiki-js

# Using npm
npm install wiki-js

# Using yarn
yarn add wiki-js
```

## Usage

### ESM
```typescript
import { WikimediaClient } from 'wiki-js';

const client = new WikimediaClient({
  userAgent: 'MyApp/1.0', // It's good practice to set a user agent
});

// Get page information
const pageInfo = await client.getPageInfo('JavaScript');

// Search for pages
const searchResults = await client.search('JavaScript programming');

// Get page categories
const categories = await client.getCategories('JavaScript');
```

### CommonJS
```javascript
const { WikimediaClient } = require('wiki-js');

const client = new WikimediaClient({
  baseURL: 'https://en.wikipedia.org/w/api.php', // Optional: specify a different wiki
});

async function getPageInfo() {
  const pageInfo = await client.getPageInfo('JavaScript');
  console.log(pageInfo);
}
```

## Features

- **Type Safety**: Built with TypeScript for excellent IDE support and type checking
- **Modern Architecture**: 
  - Promise-based API
  - ESM and CommonJS support
  - Tree-shakeable exports
- **Comprehensive API Coverage**:
  - Page information and content
  - Category management
  - Search functionality
  - Link management (forward and backward links)
  - Image and file handling
- **Configurable**: Custom base URLs, user agents, and other options
- **Error Handling**: Proper error handling and typing

## API Examples

```typescript
const client = new WikimediaClient();

// Get page information
const pageInfo = await client.getPageInfo('JavaScript');

// Search for pages
const searchResults = await client.search('JavaScript programming');

// Get page categories
const categories = await client.getCategories('JavaScript');

// Get page links
const links = await client.getLinks('JavaScript');

// Get images used on a page
const images = await client.getImages('JavaScript');
```

## Development

```bash
# Install dependencies
pnpm install

# Start development with watch mode
pnpm dev

# Run tests
pnpm test

# Build the project
pnpm build

# Lint the code
pnpm lint

# Format the code
pnpm format

# Fetch test data
pnpm fetch-test-data
```

## Requirements

- Node.js >= 14.0.0
- TypeScript for development

## License

MIT © Matthew Herod

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 