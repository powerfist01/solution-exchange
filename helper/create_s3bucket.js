const AWS = require('aws-sdk');
const fs = require('fs');
// Enter copied or downloaded access ID and secret key here
const AWSAccessKeyId='AKIAITAUQPYHV3AJKAUQ'

const AWSSecretKey='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'

// The name of the bucket that you have created
const BUCKET_NAME = 'assignments-soluge';

const s3 = new AWS.S3({
    accessKeyId: AWSAccessKeyId,
    secretAccessKey: AWSSecretKey
});

const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        // Set your region here
        LocationConstraint: "eu-west-1"
    }
};

s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.Location);
});
