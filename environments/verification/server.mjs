import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { contained } from '../../runner/common.mjs';

const TYPES = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webm':'video/webm','.wav':'audio/wav','.ogg':'audio/ogg','.mp3':'audio/mpeg','.woff2':'font/woff2'};
export async function serve(root, port = 0) {
  root = await fs.realpath(root);
  const server = http.createServer(async (req, res) => {
    try {
      if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
      const requestPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const parts = requestPath.replaceAll('\\','/').split('/').filter(Boolean);
      if (parts.some(p => p.startsWith('.'))) { res.writeHead(403).end(); return; }
      let file = path.resolve(root, '.' + requestPath);
      if (!contained(root,file)) { res.writeHead(403).end(); return; }
      if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
      file = await fs.realpath(file);
      if (!contained(root,file)) { res.writeHead(403).end(); return; }
      const body = await fs.readFile(file);
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'"
      });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch { res.writeHead(404).end('Not found'); }
  });
  await new Promise((resolve,reject) => { server.once('error',reject); server.listen(port,'127.0.0.1',resolve); });
  return { url:'http://127.0.0.1:' + server.address().port + '/', close:() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }) };
}
