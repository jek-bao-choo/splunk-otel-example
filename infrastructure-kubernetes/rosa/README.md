1. Ensure that Red Hat OpenShift Service on AWS (ROSA) is enabled through AWS console

2. Sign in to https://www.redhat.com

3. Follow the instructions such as

4. Install ROSA cli
`brew install rosa-cli`

5. Manage ROSA credential and privileges
`rosa login`
```bash
rosa login

# or login directly with token
#The token is from Red Hat account after signing in to redhat.com
rosa login --token="<redacted>"

rosa whoami

rosa verify quota
```

6. Use ROSA for creating Openshift cluster
https://www.rosaworkshop.io/rosa/2-deploy/#automatic-mode
```bash
# Create account roles
rosa create account-roles --mode auto --yes

# Create cluster with a cluster name no more than 15 characters
rosa create cluster --interactive --sts

# Follow instructions to complete installation with 
rosa create operator-roles --cluster <cluster name>
rosa create oidc-provider --cluster <cluster name>

# See all available clusters
rosa list clusters

# Describe cluster
rosa describe cluster --cluster <cluster-name>

# Wait for console URL and get the console URL
rosa describe cluster -c <cluster-name> | grep Console
```
Note: It takes about 30 to 40 minutes to create cluster as stated here https://docs.openshift.com/rosa/rosa_getting_started/rosa-quickstart.html 

7. Install Openshift CLI
`brew install openshift-cli`

8. Path 1 Create quick login using admin
https://www.rosaworkshop.io/rosa/3-create_initial_admin/
`rosa create admin --cluster=<cluster name>`

8. or Path 2 Setup an IDP, Granting Admin Right, and Accessing the cluster
https://www.rosaworkshop.io/rosa/4-setup_idp/
https://www.rosaworkshop.io/rosa/5-grant_admin/
https://www.rosaworkshop.io/rosa/6-access_cluster/
Note: This setup is more cumbersome but more secure so it is recommended

9. Login using Openshift CLI (OC)
```bash
# Get API URL
rosa describe cluster -c <cluster name> | grep API

# Login using OC
oc login <API URL> --username cluster-admin --password <redacted>

# Verify login successful
oc whoami
```

10. Check that in default namespace
```bash
# See all projects
oc projects

# See in kubectl
kubectl get namespace
```


11. Use ROSA to delete Openshift cluster
https://www.rosaworkshop.io/rosa/12-delete_cluster/