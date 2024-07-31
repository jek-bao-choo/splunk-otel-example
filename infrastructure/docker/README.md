Change the access token and realm

```yml
docker-compose up
```

After docker compose up run

```
docker run jchoo/jekspringwebapp:v4
```

Then test 

```
# Invoke success
curl http://localhost:3009/greeting

# 403
curl http://localhost:3009/jek-forbidden

# 404
curl http://localhost:3009/jek-error

# 500
curl http://localhost:3009/jek-server-error


```
