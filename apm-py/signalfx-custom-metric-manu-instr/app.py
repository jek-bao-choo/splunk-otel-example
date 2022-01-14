# NOTE THAT YOU HAVE TO MANUALLY STOP THIS PROGRAM USING CTRL+C
import time
import requests
# ADD NECESSARY IMPORTS FOR SENDING DATA TO SIGNALFX
import signalfx

# ADD THE ACCESS TOKEN FOR YOUR ORG HERE
# YOU CAN GET THE TOKEN BY GOING TO THE ORGANIZATION PAGE IN THE SIGNALFX APP >> ACCESS TOKENS
SFX_TOKEN = 'YOUR-ACCESS-TOKEN-HERE'
# INSTANTIATE THE SIGNALFX OBJECT
sfx1 = signalfx.SignalFx(ingest_endpoint='https://ingest.YOUR-REALM-HERE.signalfx.com')  # ACCESS THE INGEST API
sfx = sfx1.ingest(SFX_TOKEN)


class resptime:

    def getResponseTime(self, url):
        begin_url_time = time.time()
        time_toget_url = (time.time() - begin_url_time) * 1000  # Time is milliseconds
        tstamp = time.time() * 1000
        return time_toget_url, tstamp


def main():
    try:
        while True:
            now = int(time.time())
            if now % 10 == 0:  # Sending datapoints every 10 seconds
                # Enter sites of your choice from the following categories: search engines, finance site,
                # retail site, corporate, etc.
                sites = ['google.com', 'duckduckgo.com', 'bing.com', 'weather.com', 'amazon.com', 'etrade.com',
                         'splunk.com']
                for site in sites:
                    starturl = 'http://%s'
                    url = starturl % site
                    print(url)
                    r = resptime()
                    resp = r.getResponseTime(url)
                    rtime = resp[0]
                    timestamp = resp[1]
                    # DEFINE DATAPOINT  (replace xxx below with your initials to make it unique)
                    # METRIC NAME: xxx_https_response_time
                    # VALUE: TIME TAKEN TO RETURN URL
                    # DIMENSION NAME: xxx_  DIMENSION VALUE:
                    dp1 = {'metric': 'jek_http_response_time', 'value': rtime,
                           'dimensions': {'jek_site': site, 'service_type': 'Production'}, 'timestamp': timestamp}
                    # SEND DATAPOINT TO SIGNALFX (METRIC IS A GAUGE)
                    sfx.send(gauges=[dp1], counters=[], cumulative_counters=[])
                    print('site: ', site, ' http_response_time: ', rtime, timestamp)
                time.sleep(1)
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
