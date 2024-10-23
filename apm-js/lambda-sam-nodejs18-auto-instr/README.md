# Step 1: Install Prerequisites
- Make sure to have the relevant IAM role before starting. If you have administrator role, then it is all good. Go ahead.
- You’ll need to install the following if you haven’t already:
- AWS CLI: Install from AWS CLI installation guide.
- AWS SAM CLI: Install from SAM CLI installation guide.

```bash
aws --version
sam --version
```

# Step 2: Initialize a SAM Project
- `sam init` ![](init.png)
- Change directory and build
```bash
cd <the folder name>

sam build

sam local invoke
``` 
![](build.png)

- Deploy using Serverless Application Model
```bash
sam deploy --stack-name jek-lambda-sam-nodejs18-<today date> --guided 
``` 
![](guided.png)

# Step 3: Modify the Lambda Function

In /hello-world/app.ts
```typescript
exports.lambdaHandler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World layer none',
        }),
    };
};
```

# Step 4: Build the Project

```bash
sam build
```

- Run `sam deploy` again without the --guided flag. ![](deploying.png)

- (Optionally) See other sam flags https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-deploy.html 

- Test the deployed lambda function ![](test.png)
- Curl the deployed lambda function `curl <the url from API Gateway>` 
![](api.png)


# Step 5: Add Splunk Lambda Layer for traces
- Follow the steps in Data Setup ![](lambda.png)
- Open template.yaml in the IDE and add lambda layer by going to template.yaml > Resources > Properties > Layers. Also add add environment variables by staying on template.yaml > Resources > Properties > Environment > Variables
```yml
      Layers:
      - arn:aws:lambda:ap-southeast-1:254067382080:layer:splunk-apm:107
      Environment:
        Variables:
          SPLUNK_ACCESS_TOKEN: <redacted for...>
          SPLUNK_REALM: <redacted for...>
          OTEL_SERVICE_NAME: jek-lambda-nodejs18-23oct2024
          OTEL_RESOURCE_ATTRIBUTES: deployment.environment=jek-sandbox
          AWS_LAMBDA_EXEC_WRAPPER: /opt/nodejs-otel-handler
```
![](templateyaml.png)
- Run `sam build`
- Run `sam deploy`
- Curl the deployed with instrumentation lambda function `curl <the url from API Gateway>` 
![](api.png)

# Step 6: Add trace_id and span_id to log lines (WIP)
- Setup AWS CloudWatch Logs integration
- Add trace_id and span_id to log line https://jek-bao-choo.medium.com/steps-to-instrument-splunk-observability-cloud-to-monitor-aws-sam-lambda-node-js-microservice-6500bba736cd  (WIP)
- Once this is done, I could do a similar one for Python referencing this https://github.com/smathur-splunk/lambda-apm-workshop#optional-add-custom-span-tags-for-additional-info (WIP)

# Step 7: Clean up
- `sam delete`
- `aws cloudformation delete-stack --stack-name jek-lambda-sam-nodejs18-<today date> --region ap-southeast-1`
    - We can see that the CloudFormation stack deleted as well as the Lambda function.
- Delete AWS logging, Xray, and application monitoring


# Proof
- ![](proof.png)
- Date: 23 Oct 2024