import { hashElement } from 'folder-hash'
import { Buffer } from 'node:buffer'
import { join } from 'node:path';

const options = {
   folders: { include: ['**/*', '.*'] }, 
   files: { include: ['**/*', '.*'] }
};

export async function getContentHash() {
    const hash = await hashElement(join(__dirname, '..'), options);
    return Buffer.from(hash.hash, 'base64').toString('hex')
}