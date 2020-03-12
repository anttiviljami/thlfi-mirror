const crypto = require('crypto');

const main = (input = '') => {
  const hash = crypto.createHash('md5').update(input).digest('hex');
  console.log(hash);
}

main(process.argv[2]);
