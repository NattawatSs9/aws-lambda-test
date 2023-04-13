import AWS from 'aws-sdk';
const s3 = new AWS.S3();
const dynamoClient = new AWS.DynamoDB.DocumentClient();
export const handler = async(event, context, callback) => {
    // TODO implement
    let statusCode = 200;
    try {
        const parsedBody = JSON.parse(event.body);
        const base64File = parsedBody.file;
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/,""), "base64");
        const params = {
            Bucket: "cloud-base-kmitl",
            Key: `images/${new Date().toISOString()}.jpeg`,
            Body: decodedFile,
            ContentType: "image/jpeg",
        };
        
        const uploadResult = await s3.upload(params).promise();
        let item = {
            images_id: new Date().toISOString() + "-id",
            url: uploadResult.Location
        }
        await dynamoClient.put({
            TableName: "images",
            Item: item
        }).promise();

        let responseData = {
            message: "Successfully",
            data: item
        }
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(responseData)
        })

    }
    catch(e) {
        let responseData = {
            message: "Failed",
            data: e
        }
        callback(null, {
            statusCode: 500,
            body: JSON.stringify(responseData)
        })
    }
};
