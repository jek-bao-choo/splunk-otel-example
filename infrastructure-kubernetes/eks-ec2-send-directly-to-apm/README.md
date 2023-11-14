There are two files.

`deployment-before.yaml` --> This deployment doesn't have instrumentation attached.

`deployment-after.yaml` --> This deployment has instrumentation attached.

```
kubectl create ns test
```

```
kubectl apply -n test -f deployment-after.yaml 
```

```
kubectl port-forward -n test svc/microservice-a-service 8080:80
```

```
curl localhost:8080/a
```

```
kubectl logs deploy/microservice-d
```