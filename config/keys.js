// dbPassword = 'mongodb+srv://YOUR_USERNAME_HERE:'+ encodeURIComponent('YOUR_PASSWORD_HERE') + '@CLUSTER_NAME_HERE.mongodb.net/test?retryWrites=true';
dbPassword = 'mongodb://soluge_user:soluge_user@studytoday-shard-00-00.2pjsr.mongodb.net:27017,studytoday-shard-00-01.2pjsr.mongodb.net:27017,studytoday-shard-00-02.2pjsr.mongodb.net:27017/solution?ssl=true&replicaSet=atlas-a8k3p1-shard-0&authSource=admin&retryWrites=true&w=majority'
// dbPassword = 'mongodb://localhost:27017/solution'
module.exports = {
    mongoURI: dbPassword
};