from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser

PORT = 6769
webbrowser.open(f'http://localhost:{PORT}/')
HTTPServer(('localhost', PORT), SimpleHTTPRequestHandler).serve_forever()