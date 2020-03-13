const { S3, Lambda } = require('aws-sdk');
const crypto = require('crypto');

exports.handler = async (event, context) => {
  const { uri, querystring } = event.Records[0].cf.request;
  const hash = crypto
    .createHash('md5')
    .update(querystring)
    .digest('hex');
  const path = `${uri}?${querystring}`;
  const key = `cache/${hash}`;

  try {
    const s3 = new S3();
    const obj = await s3
      .getObject({
        Bucket: 'thl-fi-mirror',
        Key: key,
      })
      .promise();

    // CACHE HIT
    console.log('CACHE HIT');

    if (obj.Body.length > 1000 * 1000) {
      return {
        status: '302',
        statusDescription: 'Redirect',
        headers: {
          location: [
            {
              key: 'location',
              value: `https://thl.viljami.io/${key}`,
            },
          ],
        },
      };
    }

    return {
      status: '200',
      statusDescription: 'OK',
      headers: {
        'content-type': [
          {
            key: 'content-type',
            value: obj.ContentType,
          },
        ],
        'x-lambda-cache': [
          {
            key: 'x-lambda-cache',
            value: 'hit',
          },
        ],
        'cache-control': [
          {
            key: 'cache-control',
            value: 'max-age=604800',
          },
        ],
      },
      body: obj.Body.toString('utf-8'),
    };
  } catch (err) {
    // CACHE MISS
    console.log('CACHE MISS');
    const lambda = new Lambda();

    lambda
      .invoke({
        FunctionName: 'thl-fi-cache',
        Payload: JSON.stringify({ path, key }),
      })
      .promise()
      .then(() => null);

    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      status: '404',
      statusDescription: 'Not Found',
      headers: {
        'content-type': [
          {
            key: 'content-type',
            value: 'application/json',
          },
        ],
        'x-lambda-cache': [
          {
            key: 'x-lambda-cache',
            value: 'miss',
          },
        ],
        'cache-control': [
          {
            key: 'cache-control',
            value: 'no-cache',
          },
        ],
      },
      body: '',
    };
  }
};
