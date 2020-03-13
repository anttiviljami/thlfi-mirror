const { S3 } = require('aws-sdk');
const axios = require('axios');

const s3 = new S3();

exports.handler = async (e) => {
  const { key, path } = e;

  const resource = `https://thl.fi${path}`;
  console.log('fetching', resource, '...');
  const res = await axios.get(resource);

  const params = {
    Bucket: 'thl-fi-mirror',
    Key: key,
    Body: res.data,
    ContentType: res.headers['content-type'],
  };
  const cached = await s3.putObject(params).promise();
  console.log(cached);
  return { cached };
};

