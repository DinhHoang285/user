export function getIpFromHeaders(req) {
  if (!req?.headers) return undefined;
  return req.headers['x-client-ip'] || req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
}
