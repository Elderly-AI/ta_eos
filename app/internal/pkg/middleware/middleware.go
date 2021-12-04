package middleware

import (
	"github.com/golang/glog"
	"github.com/jmoiron/sqlx"
	"net/http"
	"strings"
	"time"
)

func AllowCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			if r.Method == "OPTIONS" && r.Header.Get("Access-Control-Request-Method") != "" {
				preflightHandler(w, r)
				return
			}
		}
		h.ServeHTTP(w, r)
	})
}

// preflightHandler adds the necessary headers in order to serve
// CORS from any origin using the methods "GET", "HEAD", "POST", "PUT", "DELETE"
// We insist, don't do this without consideration in production systems.
func preflightHandler(w http.ResponseWriter, r *http.Request) {
	headers := []string{"Content-Type", "Accept", "Authorization"}
	w.Header().Set("Access-Control-Allow-Headers", strings.Join(headers, ","))
	methods := []string{"GET", "HEAD", "POST", "PUT", "DELETE"}
	w.Header().Set("Access-Control-Allow-Methods", strings.Join(methods, ","))
	glog.Infof("preflight request for %s", r.URL.Path)
}

type PostgresMiddleware struct {
	conn *sqlx.DB
}

func NewPostgresMiddleware(conn *sqlx.DB) PostgresMiddleware {
	return PostgresMiddleware{conn}
}

func (p *PostgresMiddleware) MetricsMiddleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		name := r.RequestURI
		date := time.Now()
		query := "INSERT INTO metrics (method_name,date) VALUES ($1,$2)"
		_, err := p.conn.Exec(query, name, date)
		if err != nil {
			glog.Error(err)
		}
		h.ServeHTTP(w, r)
	})
}
