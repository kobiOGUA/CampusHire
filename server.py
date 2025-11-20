#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 5000
DIRECTORY = "."

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    
    with ReusableTCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
        print(f"✅ CampusHire server running on http://0.0.0.0:{PORT}")
        print(f"📂 Serving files from: {os.getcwd()}")
        print(f"🚀 Open your browser to view the application")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n⛔ Server stopped")
