const { S3 } = require('aws-sdk');

exports.handler = async (event, context) => {
    console.log(JSON.stringify(event));
    const { uri, querystring } = event.Records[0].cf.request;

    const s3 = new S3();
    const obj = await s3.getObject({
        Bucket: 'thl-fi-mirror',
        Key: `${uri}?${querystring}`.substr(1,1024),
    }).promise();

    const response = {
        status: '200',
        statusDescription: 'OK',
        headers: {
            'content-type': [{
                key: 'Content-Type',
                value: obj.ContentType,
            }]
        },
        body: obj.Body.toString('utf-8'),
    };

    return response;
};

