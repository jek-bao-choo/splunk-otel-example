#!/bin/bash

# Set your project ID
PROJECT_ID="<YOUR_PROJECT_ID>"
gcloud config set project $PROJECT_ID

# Set service account details
SA_NAME="jek-sa-TODAY-DATE"
SA_DISPLAY_NAME="Jek Integration Service Account"

# Create the service account
gcloud iam service-accounts create $SA_NAME --display-name="$SA_DISPLAY_NAME"

# Get the full service account email
SA_EMAIL=$(gcloud iam service-accounts list --filter="displayName:$SA_DISPLAY_NAME" --format='value(email)')

# Assign the Editor role to the service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/editor"

# Create a custom role with the additional permissions
CUSTOM_ROLE_NAME="JekCustomRoleForMonitoring"
CUSTOM_ROLE_DESCRIPTION="Jek custom role for monitoring and resource listing"

gcloud iam roles create $CUSTOM_ROLE_NAME --project=$PROJECT_ID \
    --title="Jek Monitoring Role" \
    --description="$CUSTOM_ROLE_DESCRIPTION" \
    --permissions=monitoring.metricDescriptors.list,monitoring.metricDescriptors.get,monitoring.timeSeries.list,resourcemanager.projects.get,container.clusters.list,container.nodes.list,container.pods.list,spanner.instances.list,storage.buckets.list,compute.instances.list,compute.machineTypes.list,serviceusage.services.use \
    --stage=ALPHA

# Assign the custom role to the service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="projects/$PROJECT_ID/roles/$CUSTOM_ROLE_NAME"

# Create and download the service account key
gcloud iam service-accounts keys create ${SA_NAME}-key.json \
    --iam-account=$SA_EMAIL

echo "Service account created and key downloaded as ${SA_NAME}-key.json"
echo "Service account email: $SA_EMAIL"