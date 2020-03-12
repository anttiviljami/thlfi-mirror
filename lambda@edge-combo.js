iconst { S3 } = require('aws-sdk');
const crypto = require('crypto')

exports.handler = async (event, context) => {
    console.log(JSON.stringify(event));
    const { uri, querystring } = event.Records[0].cf.request;
    console.log(uri, querystring);

    const hash = crypto.createHash('md5').update(`combo?${querystring}`).digest('hex');

    const Key = `combo/${hash}`;
    console.log(Key);

    let response;

    try {
        const s3 = new S3();
        const obj = await s3.getObject({
            Bucket: 'thl-fi-mirror',
            Key,
        }).promise();
        console.log(obj);

        response = {
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
    } catch (err) {
        response = {
            status: '200',
            statusDescription: 'OK',
            headers: {
                'content-type': [{
                    key: 'Content-Type',
                    value: 'application/json',
                }]
            },
            body: JSON.stringify({ err, Key, event })
        };
    }

    console.log(response);
    return response;
};

