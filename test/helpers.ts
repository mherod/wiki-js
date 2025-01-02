import fs from 'fs/promises';
import path from 'path';

export async function loadFixture(filename: string) {
  const filePath = path.join(process.cwd(), 'test', 'fixtures', filename);
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

export function getMockClient() {
  const mockGet = jest.fn();
  const client = {
    get: mockGet,
  };

  return {
    client,
    mockGet,
  };
} 