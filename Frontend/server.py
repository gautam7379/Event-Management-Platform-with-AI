"""Frontend static server + same-origin reverse proxy. No backend code changes required."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import os
BACKEND="http://backend:8000"
class Handler(SimpleHTTPRequestHandler):
    def _proxy(self):
        target=BACKEND+self.path[4:]
        body=None
        if self.command in ("POST","PUT","PATCH","DELETE"):
            n=int(self.headers.get("Content-Length",0)); body=self.rfile.read(n) if n else None
        headers={k:v for k,v in self.headers.items() if k.lower() in ("authorization","content-type","accept")}
        try:
            with urlopen(Request(target,data=body,headers=headers,method=self.command)) as r:
                data=r.read(); self.send_response(r.status); self.send_header("Content-Type",r.headers.get("Content-Type","application/json")); self.send_header("Content-Length",str(len(data))); self.end_headers(); self.wfile.write(data)
        except HTTPError as e:
            data=e.read(); self.send_response(e.code); self.send_header("Content-Type",e.headers.get("Content-Type","application/json")); self.send_header("Content-Length",str(len(data))); self.end_headers(); self.wfile.write(data)
    def do_GET(self): return self._proxy() if self.path.startswith('/api/') else super().do_GET()
    def do_POST(self): return self._proxy() if self.path.startswith('/api/') else self.send_error(405)
    def do_PUT(self): return self._proxy() if self.path.startswith('/api/') else self.send_error(405)
    def do_PATCH(self): return self._proxy() if self.path.startswith('/api/') else self.send_error(405)
    def do_DELETE(self): return self._proxy() if self.path.startswith('/api/') else self.send_error(405)
if __name__=='__main__':
    os.chdir(os.path.dirname(__file__))
    print('EventAI frontend: http://127.0.0.1:5500')
    ThreadingHTTPServer(('0.0.0.0',5500),Handler).serve_forever()
