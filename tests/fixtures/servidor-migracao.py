from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import urllib.parse
raiz=Path(__file__).resolve().parents[2]/'dist'
legado="""self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open('ajoia-legado');await c.put('/A-Joia/',new Response('<!doctype html><meta charset="utf-8"><title>Legado</title><h1>Versão antiga em cache</h1><div class="cce-arena">Mini gol antigo</div>',{headers:{'Content-Type':'text/html;charset=utf-8'}}));await self.skipWaiting();})()));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{if(e.request.mode==='navigate')e.respondWith(caches.match('/A-Joia/'));});"""
class H(SimpleHTTPRequestHandler):
 novo=False
 def do_POST(self):
  H.novo=True;self.send_response(200);self.end_headers();self.wfile.write(b'ok')
 def do_GET(self):
  p=urllib.parse.urlsplit(self.path).path
  if p=='/__instalar':
   self.send_response(200);self.send_header('Content-Type','text/html');self.end_headers();self.wfile.write(b'<!doctype html><title>Instalar legado</title>');return
  if p=='/A-Joia/sw.js':
   data=(raiz/'sw.js').read_bytes() if H.novo else legado.encode();self.send_response(200);self.send_header('Content-Type','application/javascript');self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(data);return
  if p=='/__estado':
   self.send_response(200);self.end_headers();self.wfile.write(b'novo' if H.novo else b'legado');return
  return super().do_GET()
 def translate_path(self,path):
  p=urllib.parse.unquote(urllib.parse.urlsplit(path).path)
  if p.startswith('/A-Joia/'):p=p[len('/A-Joia/'):]
  else:p=p.lstrip('/')
  resolved=(raiz/p).resolve()
  if not resolved.is_relative_to(raiz):return str(raiz/'inexistente')
  return str(resolved)
 def log_message(self,*args):pass
ThreadingHTTPServer(('127.0.0.1',4174),H).serve_forever()
