```
sam build
sam local invoke
sam deploy
```


``` 
# Test root endpoint
curl https://your-api-id.execute-api.region.amazonaws.com/Prod/

# Test hello endpoint
curl https://your-api-id.execute-api.region.amazonaws.com/Prod/hello

# Test static endpoint
curl https://your-api-id.execute-api.region.amazonaws.com/Prod/static/test

```
