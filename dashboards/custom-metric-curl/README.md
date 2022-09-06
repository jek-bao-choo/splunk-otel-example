- Send custom metric 
```curl
curl -i -X POST --header "Content-Type: application/json" --header "X-SF-TOKEN: <YOUR ACCESS TOKEN HERE>" -d '{ "gauge": [{"metric": "jek_numcalls","value": 2888}]}' https://ingest.<YOUR REALM>.signalfx.com/v2/datapoint
```

- Send custom metric with one dimension
```curl

curl -i -X POST --header "Content-Type: application/json" --header "X-SF-TOKEN: <YOUR ACCESS TOKEN HERE>" -d '{ "gauge": [{"metric": "jek_numcalls","value": 2888, "dimensions": {"jek_service_name": "jek_login"}}]}' https://ingest.<YOUR REALM>.signalfx.com/v2/datapoint
```

- Send custom metric with two dimensions 
```curl
curl -i -X POST --header "Content-Type: application/json" --header "X-SF-TOKEN: <YOUR ACCESS TOKEN HERE>" -d '{ "gauge": [{"metric": "jek_numcalls","value": 1888, "dimensions": {"jek_custom_name": "jek_monitor", "jek_service_name": "jek_login"}}]}' https://ingest.<YOUR REALM>.signalfx.com/v2/datapoint
```
