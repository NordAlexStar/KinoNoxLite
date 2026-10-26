// KinoNox Lite — servera režīms mācību videi (0.7.8).
//
// Viens fails, bez atkarībām: atdod statiskos failus un glabā kopīgu stāvokli JSON failā.
// Tā «servera imitācija» ir īsta: konts, kas izveidots vienā pārlūkā, strādā citā, un biļeti
// var atvērt/atcelt no jebkura pārlūka tajā pašā datorā.
//
// Palaišana: dubliklikšķis uz kino-server.exe (Windows) — pārlūks atveras pats.
// Vai no konsoles:  kino-server.exe --port 8765 --host 127.0.0.1
//
// Stāvoklis: data.json blakus programmai (izveidojas pirmajā saglabāšanā).
// Nav autentifikācijas un nav domāts izvietošanai internetā — tikai mācību datoram.
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
)

var (
	mu       sync.Mutex
	rootDir  string
	dataFile string
)

func main() {
	port := flag.Int("port", 8765, "ports")
	host := flag.String("host", "127.0.0.1", "127.0.0.1 (tikai šis dators) vai 0.0.0.0 (tīkls)")
	noBrowser := flag.Bool("no-browser", false, "neatvērt pārlūku")
	flag.Parse()

	exe, err := os.Executable()
	if err != nil {
		log.Fatalf("nevar noteikt programmas ceļu: %v", err)
	}
	exeDir := filepath.Dir(exe)
	// Statika parasti ir repozitorija saknē, bet programma — mapē server/.
	rootDir = exeDir
	if _, err := os.Stat(filepath.Join(exeDir, "index.html")); err != nil {
		if _, err := os.Stat(filepath.Join(filepath.Dir(exeDir), "index.html")); err == nil {
			rootDir = filepath.Dir(exeDir)
		}
	}
	dataFile = filepath.Join(exeDir, "data.json")

	addr := fmt.Sprintf("%s:%d", *host, *port)
	url := fmt.Sprintf("http://127.0.0.1:%d/", *port)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/state", handleState)
	mux.Handle("/", http.FileServer(http.Dir(rootDir)))

	log.Printf("KinoNox Lite servera režīms: %s", url)
	log.Printf("Statika: %s", rootDir)
	log.Printf("Stāvoklis: %s", dataFile)

	if !*noBrowser {
		go openBrowser(url)
	}
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("serveris nepalaižas: %v (aizņemts ports? pamēģini --port 8766)", err)
	}
}

func handleState(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-store")
	switch r.Method {
	case http.MethodGet:
		mu.Lock()
		defer mu.Unlock()
		body, err := os.ReadFile(dataFile)
		if err != nil || len(strings.TrimSpace(string(body))) == 0 {
			body = []byte("{}")
		}
		writeJSON(w, http.StatusOK, body)
	case http.MethodPost:
		raw, err := io.ReadAll(io.LimitReader(r.Body, 8<<20))
		if err != nil {
			writeJSON(w, http.StatusBadRequest, []byte(`{"ok":false,"error":"lasīšana neizdevās"}`))
			return
		}
		var probe map[string]any
		if err := json.Unmarshal(raw, &probe); err != nil {
			writeJSON(w, http.StatusBadRequest, []byte(`{"ok":false,"error":"gaidīts JSON objekts"}`))
			return
		}
		mu.Lock()
		defer mu.Unlock()
		tmp := dataFile + ".tmp"
		if err := os.WriteFile(tmp, raw, 0o644); err != nil {
			writeJSON(w, http.StatusInternalServerError, []byte(`{"ok":false,"error":"rakstīt neizdevās"}`))
			return
		}
		if err := os.Rename(tmp, dataFile); err != nil {
			writeJSON(w, http.StatusInternalServerError, []byte(`{"ok":false,"error":"pārvietot neizdevās"}`))
			return
		}
		writeJSON(w, http.StatusOK, []byte(`{"ok":true}`))
	default:
		writeJSON(w, http.StatusMethodNotAllowed, []byte(`{"ok":false,"error":"metode nav atļauta"}`))
	}
}

func writeJSON(w http.ResponseWriter, code int, body []byte) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	_, _ = w.Write(body)
}

func openBrowser(url string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default:
		cmd = exec.Command("xdg-open", url)
	}
	if err := cmd.Start(); err != nil {
		log.Printf("pārlūku nevarēja atvērt automātiski — atver %s", url)
	}
}
