//this code polls the sites listed here and calculates the response times for each site. 
//the response time for each site is sent into Splunk IM as a gauge
// comments in UPPERCASE indicate that you have to complete or add the appropriate statement

const http = require('http');

//INCLUDE THE SIGNALFX MODULE
const sfx = require('signalfx');
const SFX_TOKEN = 'YOUR-TOKEN-HERE';
const options = {
    'ingestEndpoint': 'https://ingest.YOUR-REALM-HERE.signalfx.com'
};

//CREATE DEFAULT INGEST CLIENT https://github.com/signalfx/signalfx-nodejs#create-client
const client = new sfx.Ingest(SFX_TOKEN, options);//COMPLETE THIS STATEMENT

const sites = ['google.com', 'duckduckgo.com', 'bing.com', 'weather.com', 'amazon.com', 'etrade.com', 'splunk.com'];

(function getLoop(i) {
    setTimeout(function () {
        for (let i = 0, len = sites.length; i < len; i++) {
            getRespTime(sites[i]);
        }

        function getRespTime(site) {
            let callBackString = {};
            let url = 'http://' + site;
            console.log(url);
            let start_geturl = Math.floor(Date.now());

            let request = http.get(url, response => {
                response.setEncoding("utf8");
                let body = "";
                response.on("data", data => {
                    body += data;
                });

                //number of milliseconds it took for the operation to complete
                let time_togetURL = Math.floor(Date.now()) - start_geturl;

                callBackString.timegeturl = time_togetURL;
                // DEFINE THE DATAPOINTS- METRIC TYPE = GAUGE; METRIC NAME = XXX_HTTP_RESPONSE_TIME;  VALUE= TIME TAKEN TO GET THE URL
                // DIMENSIONS: THE DIMENSION NAME = XXX_SITE; VALUE = VALUE OF THE SITE
                //REPLACE XXX WITH YOUR INITIALS TO MAKE NAMES UNIQUE
                let dp1 = {
                    gauges: [{
                        'metric': 'jek_http_response_timeNode',
                        'value': time_togetURL,
                        'dimensions': {
                            'jek_site': site,
                            'service_type': 'Production'
                        }
                    }]
                };
                //SEND DATAPOINT TO SIGNALFX (METRIC IS A GAUGE)
                client.send(dp1);
                console.log("datapoint sent");
            });
        }

        if (--i) getLoop(i);      //  decrement i and call myLoop again if i > 0
    }, 3000)
})(10);
  


