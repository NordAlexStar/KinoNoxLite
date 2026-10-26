#!/usr/bin/env python3
"""KinoNox Lite — servera režīms mācību videi (0.7.6).

Neliels lokāls serveris: atdod statiskos failus un glabā kopīgu stāvokli vienā JSON failā.
Tā «servera imitācija» kļūst īsta: konts, kas izveidots vienā pārlūkā, ir pieejams citā, un
biļeti var atvērt/atcelt no jebkura pārlūka tajā pašā datorā (vai tajā pašā tīklā).

Palaišana (no repozitorija saknes):
    python3 server/kino-server.py            # http://127.0.0.1:8765
    python3 server/kino-server.py --port 9000 --host 0.0.0.0

Stāvoklis: server/data.json (izveidojas pirmajā saglabāšanā). Dzēšot failu, vide atgriežas sākumā.
Nav autentifikācijas un nav domāts izvietošanai internetā — tikai mācību datoram.
"""
import argparse
import json
import os
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "server", "data.json")
LOCK = threading.Lock()


def read_state():
    try:
        with open(DATA, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def write_state(payload):
    os.makedirs(os.path.dirname(DATA), exist_ok=True)
    tmp = DATA + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    os.replace(tmp, DATA)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, fmt, *args):  # īss žurnāls, bez trokšņa
        print("%s - %s" % (self.address_string(), fmt % args))

    def _json(self, code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):  # noqa: N802
        if self.path.split("?")[0] == "/api/state":
            with LOCK:
                return self._json(200, read_state())
        return super().do_GET()

    def do_POST(self):  # noqa: N802
        if self.path.split("?")[0] != "/api/state":
            return self._json(404, {"ok": False, "error": "Nav šādas adreses"})
        try:
            length = int(self.headers.get("Content-Length") or 0)
            payload = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
            if not isinstance(payload, dict):
                raise ValueError("gaidīts objekts")
        except (ValueError, UnicodeDecodeError) as exc:
            return self._json(400, {"ok": False, "error": str(exc)})
        with LOCK:
            write_state(payload)
        return self._json(200, {"ok": True})


def main():
    ap = argparse.ArgumentParser(description="KinoNox Lite servera režīms (mācību vide)")
    ap.add_argument("--host", default="127.0.0.1", help="127.0.0.1 (tikai šis dators) vai 0.0.0.0 (tīkls)")
    ap.add_argument("--port", type=int, default=8765)
    args = ap.parse_args()
    srv = ThreadingHTTPServer((args.host, args.port), Handler)
    print("KinoNox Lite servera režīms: http://%s:%d" % (args.host, args.port))
    print("Stāvoklis: %s" % DATA)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nApturēts.")


if __name__ == "__main__":
    main()
