import { processWisdom } from '../_shared/handler.ts';

export default async function handler(request: any, response: any) {
  return await processWisdom(request, response);
}
