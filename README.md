**Cloud-Enabled Attendance System**

This is a fully serverless web application for marking student attendance. The project features a modern, responsive frontend and a robust backend built entirely on AWS services. It's designed to be a practical demonstration of skills in cloud computing, serverless architecture, and frontend development.

View Live Demo
http://attendance-system-ui.s3-website-us-east-1.amazonaws.com

**Architecture Diagram**

The application follows a simple, scalable serverless architecture:

[User's Browser] ---> [AWS S3 (Static Website)] ---> [AWS API Gateway (REST API)] ---> [AWS Lambda (Node.js)] ---> [AWS DynamoDB (Database)]

**Features**

1. Mark Attendance: Users can submit their student ID and name to mark their attendance.

2. Real-time Feedback: The UI provides instant success or error messages after submission.

3. Modern UI: A clean, visually appealing, and responsive user interface.

4. Serverless Backend: No servers to manage, ensuring scalability and cost-efficiency.



**Tech Stack**

Frontend:

HTML5,
 CSS3 (with Google Fonts for typography),
 JavaScript (ES6+)

Cloud & Backend (AWS):

1. AWS S3: For hosting the static frontend files.

2. AWS API Gateway: To create and manage the REST API endpoint.

3. AWS Lambda: For the serverless backend logic (Node.js 22.x).

4. AWS DynamoDB: As the NoSQL database for storing attendance records.

5. AWS IAM: For managing permissions between services.



**Prerequisites**

Before you begin, ensure you have the following:
1. An AWS Account (Free Tier is sufficient).

2. AWS CLI configured on your local machine (optional, but recommended).

3. The project files (index.html, styles.css, app.js).


 
**Setup and Deployment Guide**

Follow these steps to deploy the application on your own AWS account.



Step 1: Set Up the DynamoDB Table

This will be our database to store attendance records.

Navigate to the DynamoDB console in AWS.

Click Create table.

Configure the table with these settings:

Table name: AttendanceRecords

Partition key: PK (Type: String)

Sort key: SK (Type: String)

Click Create table.



Step 2: Create the Lambda Function
This function will contain our backend logic to process attendance submissions.

Navigate to the IAM console to create a role for our function.

Click Roles -> Create role.

Trusted entity type: AWS service.

Use case: Lambda.

Attach the following permissions policies: AWSLambdaBasicExecutionRole and AmazonDynamoDBFullAccess.

Name the role (e.g., AttendanceLambdaRole) and create it.

Navigate to the Lambda console.

Click Create function.

Select Author from scratch.

Function name: mark_attendance

Runtime: Node.js 22.x

Architecture: x86_64

Permissions: Choose "Use an existing role" and select the AttendanceLambdaRole you just created.

Click Create function.

In the Code source editor, paste the following code into index.mjs:

<details> <summary>Click to view Lambda function code</summary>
javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = "AttendanceRecords";

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
  };

  // Handle preflight OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight check successful" })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { studentId, studentName, action } = body;

    const timestamp = new Date().toISOString();
    const date = timestamp.slice(0, 10); // Extracts "YYYY-MM-DD"

    const item = {
      PK: `DATE#${date}`, // Partition Key e.g., "DATE#2025-08-03"
      SK: `TIMESTAMP#${timestamp}`, // Sort Key e.g., "TIMESTAMP#2025-08-03T14:00:00.000Z"
      studentId,
      studentName,
      action
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Attendance marked successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: error.message || "Internal Server Error" }),
    };
  }
};
</details>
Click Deploy to save your changes.

Step 3: Set Up API Gateway
This will be the public URL that our frontend connects to.

Navigate to the API Gateway console.

Click Create API and choose REST API -> Build.

Configure the API:

Protocol: REST

Create new API: New API

API name: AttendanceAPI

Click Create API.

In the Actions dropdown, select Create Resource.

Resource Name: attendance

Check the box for Enable API Gateway CORS.

Click Create Resource.

With the /attendance resource selected, click Actions -> Create Method.

Select POST from the dropdown and click the checkmark.

Integration type: Lambda Function

Check the box for Use Lambda Proxy integration.

Lambda Function: mark_attendance

Click Save and grant permission when prompted.

Finally, deploy the API. Click Actions -> Deploy API.

Deployment stage: [New Stage]

Stage name: prod

Click Deploy.

Copy the Invoke URL. It will look like https://<api-id>.execute-api.<region>.amazonaws.com/prod.

Step 4: Configure and Host the Frontend on S3
In the app.js file, replace the placeholder URL with your API Gateway Invoke URL from the previous step.

javascript
const API_ENDPOINT = 'YOUR_API_GATEWAY_INVOKE_URL/attendance';
Navigate to the S3 console and Create bucket.

Bucket name: Choose a globally unique name (e.g., my-cloud-attendance-app-2025).

Uncheck "Block all public access" and acknowledge the warning. This is required for a public website.

Click Create bucket.

Go into your new bucket and upload the index.html, styles.css, and app.js files.

Go to the Properties tab of your bucket.

Scroll down to Static website hosting and click Edit.

Enable static website hosting.

Index document: index.html

Save changes.

Go to the Permissions tab.

Scroll down to Bucket policy and click Edit.

Paste the following policy, replacing YOUR_BUCKET_NAME with your actual bucket name.

json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
Save changes.

Usage
Navigate to your S3 bucket's static website URL (found in the Properties tab).

Fill in the "Student ID" and "Full Name" fields.

Select an action ("Check In" or "Check Out").

Click Submit Attendance.

A success or error message will appear below the form.

Project Structure
text
.
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── README.md

License

This project is licensed under the MIT License.
