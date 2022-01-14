package main

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/signalfx/golib/datapoint"
	"github.com/signalfx/golib/sfxclient"
)

func main() {
	WebsitePingLoop()
}

func WebsitePingLoop() {

	websites := [7]string{"google.com", "duckduckgo.com", "bing.com", "weather.com", "amazon.com", "etrade.com","splunk.com"}
	index := 0

	for {
		if index > 5 {
			index = 0
		}
		url := "https://" + websites[index]
		TimeNow := time.Now()
		req, _ := http.NewRequest("GET", url, nil)
		res, _ := http.DefaultClient.Do(req)

		defer res.Body.Close()

		/* test results */
		//body, _ := ioutil.ReadAll(res.Body)

		EndTime := time.Now()
		elapsed := EndTime.Sub(TimeNow)
		dims := make(map[string]string)
		dims["xxx_site"] = url

		//SEND DATAPOINT TO SIGNALFX (METRIC IS A GAUGE)
		client := sfxclient.NewHTTPSink()
		client.AuthToken = "YOUR TOKEN"
		ctx := context.Background()
		client.AddDatapoints(ctx, []*datapoint.Datapoint{
			sfxclient.GaugeF("xxx_http_response_timeGO", dims, float64(elapsed)),
		})
		fmt.Println("datapoint sent")
		index += 1
		/* Interval time is controlled here */
		time.Sleep(300 * time.Millisecond)
	}

}
