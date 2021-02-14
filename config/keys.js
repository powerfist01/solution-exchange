dbPassword = 'mongodb://soluge_admin:solugepassword@cluster0-shard-00-00.qjbrr.mongodb.net:27017,cluster0-shard-00-01.qjbrr.mongodb.net:27017,cluster0-shard-00-02.qjbrr.mongodb.net:27017/solution?ssl=true&replicaSet=atlas-mm41px-shard-0&authSource=admin&retryWrites=true&w=majority'

module.exports = {
    mongoURI: dbPassword
};