- Send custom event
```curl
curl -i  --header "Content-Type: application/json" --header "X-SF-TOKEN: <YOUR ACCESS TOKEN HERE>"   -X POST  -d  '[{ "category": "USER_DEFINED", "eventType": "xxx_deployment",  "dimensions": { "service_type": "Production"} }]' https://ingest.<YOUR REALM>.signalfx.com/v2/event
```
