#!/usr/bin/env python3
"""
Run:   python devserver.py
Stop:  CTRL+C
Serves the current directory at http://localhost:9000
Adds headers that disable browser caching so every refresh
grabs the newest files (avoids clearing IndexedDB / SW cache).
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 9000

class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

if __name__ == "__main__":
    server = ThreadingHTTPServer(("localhost", PORT), NoCache)
    print(f"Serving on http://localhost:{PORT}  (Ctrl+C to quit)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down…")
        server.server_close()