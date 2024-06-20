package main

import (
	"context" // Add for OTel Go
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/signalfx/splunk-otel-go/distro"                                    // Add for OTel Go
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin" // Added for OTel Go Gin
)

// album represents data about a record album.
type album struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Artist string  `json:"artist"`
	Price  float64 `json:"price"`
}

// albums slice to seed record album data.
var albums = []album{
	{ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
	{ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
	{ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

func main() {

	// Optional setenv here. Can do it at OS e.g. export OTEL_RESOURCE_ATTRIBUTES="service.name=my-app,service.version=1.2.3,deployment.environment=production"
	// os.Setenv("OTEL_RESOURCE_ATTRIBUTES", "service.name=my-app,service.version=1.2.3,deployment.environment=development")

	// Start of OTel Go telemetry portion necessary
	sdk, err := distro.Run()
	if err != nil {
		panic(err)
		log.Fatal(err)
	}
	// Ensure all spans are flushed before the application exits.
	defer func() {
		if err := sdk.Shutdown(context.Background()); err != nil {
			panic(err)
			log.Printf("Error shutting down tracer provider: %v", err)
		}
	}()
	// End of OTel Go telemetry portion necessary

	router := gin.Default()

	router.Use(otelgin.Middleware("jek-otelgin-server")) // Add this for OTel Go Gin

	router.GET("/albums", getAlbums)
	router.GET("/albums/:id", getAlbumByID)
	router.POST("/albums", postAlbums)

	router.Run("localhost:8080")
}

// getAlbums responds with the list of all albums as JSON.
func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, albums)
}

// getAlbumByID locates the album whose ID value matches the id
// parameter sent by the client, then returns that album as a response.
func getAlbumByID(c *gin.Context) {
	id := c.Param("id")

	// Loop over the list of albums, looking for
	// an album whose ID value matches the parameter.
	for _, a := range albums {
		if a.ID == id {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
}

// postAlbums adds an album from JSON received in the request body.
func postAlbums(c *gin.Context) {
	var newAlbum album

	// Call BindJSON to bind the received JSON to
	// newAlbum.
	if err := c.BindJSON(&newAlbum); err != nil {
		return
	}

	// Add the new album to the slice.
	albums = append(albums, newAlbum)
	c.IndentedJSON(http.StatusCreated, newAlbum)
}
