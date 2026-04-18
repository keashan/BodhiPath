import { processWisdom } from '../_shared/handler';

export default async function handler(request: any, response: any) {
  return await processWisdom(request, response);
}
