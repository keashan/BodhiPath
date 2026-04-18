import { processWisdom } from '../_shared/handler.js';

export default async function handler(request: any, response: any) {
  return await processWisdom(request, response);
}
