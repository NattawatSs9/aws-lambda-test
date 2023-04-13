import AWS from 'aws-sdk'

const dynamoClient = new AWS.DynamoDB.DocumentClient()
export const handler = async (event, context, callback) => {

    try {
        let requestJSON = JSON.parse(event.body);
        let item = {
            user_id: new Date().toISOString()+"-id",
            firstname: requestJSON.name,
            lastname: requestJSON.surname
        }
        await dynamoClient.put({
            TableName: "users",
            Item: item
        }).promise()

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
}