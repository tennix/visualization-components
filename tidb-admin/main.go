package main

import (
	"flag"
	"log"
	"math/rand"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	_ "github.com/pingcap/visualization-components/tidb-admin/statik"
	"github.com/rakyll/statik/fs"
)

var (
	pdEndpoints   string
	promEndpoint  string
	tidbEndpoints string
)

func init() {
	flag.StringVar(&pdEndpoints, "pd-endpoints", "http://localhost:2379", "pd endpoints")
	flag.StringVar(&promEndpoint, "prometheus-endpoint", "http://localhost:9090", "prometheus endpoint")
	flag.StringVar(&tidbEndpoints, "tidb-endpoints", "http://localhost:10080", "tidb endpoints")
	flag.Parse()
}

type Proxy struct {
	backends []*httputil.ReverseProxy
}

func NewProxy(targets string) *Proxy {
	backends := []*httputil.ReverseProxy{}
	for _, target := range strings.Split(targets, ",") {
		u, err := url.Parse(target)
		if err != nil {
			continue
		}
		backend := httputil.NewSingleHostReverseProxy(u)
		backends = append(backends, backend)
	}
	return &Proxy{backends: backends}
}

func (p *Proxy) Handle(w http.ResponseWriter, r *http.Request) {
	// random proxy to one backend
	backend := p.backends[rand.Intn(len(p.backends))]
	backend.ServeHTTP(w, r)
}

func main() {
	statikFS, err := fs.New()
	if err != nil {
		log.Fatal(err)
	}
	go func() {
		proxy := NewProxy(pdEndpoints)
		mux := http.NewServeMux()
		mux.HandleFunc("/", proxy.Handle)
		log.Fatal(http.ListenAndServe("localhost:2379", mux))
	}()
	go func() {
		proxy := NewProxy(promEndpoint)
		mux := http.NewServeMux()
		mux.HandleFunc("/", proxy.Handle)
		log.Fatal(http.ListenAndServe("localhost:9090", mux))
	}()
	go func() {
		proxy := NewProxy(tidbEndpoints)
		mux := http.NewServeMux()
		mux.HandleFunc("/", proxy.Handle)
		log.Fatal(http.ListenAndServe("localhost:10080", mux))
	}()
	http.Handle(
		"/", http.StripPrefix("/", http.FileServer(statikFS)),
	)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
