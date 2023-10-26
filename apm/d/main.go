package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
)

func handlePost(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusInternalServerError)
			return
		}
		fmt.Fprintf(w, "Received POST request with data: %s\n", body)
		log.Printf("Received POST request with data: %s\n", body)
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/d", handlePost)

	log.Println("Listening on :3004... /d")
	http.ListenAndServe(":3004", nil)
}
