module.exports = {
  google: {
    clientID: "",
    clientSecret: "",
    callbackURL: ""
  },
  mongodb: {
    url: "mongodb://localhost:27017/seedpro",
    prod: "mongodb+srv://seedpro:Iremide-09@vigorlab-4gwpc.mongodb.net/seedpro",
    dev: "mongodb://seedpro:Iremide-09@vigorlab-shard-00-00-4gwpc.mongodb.net:27017,vigorlab-shard-00-01-4gwpc.mongodb.net:27017,vigorlab-shard-00-02-4gwpc.mongodb.net:27017/seedpro?ssl=true&replicaSet=Vigorlab-shard-0&authSource=admin&retryWrites=true",
    dbName: "seedpro"
  },
  session: {
    cookieKey: "icanhehtyurjnghnk575768nnfhndvj4iunfurnnbg"
  },
  secret: "edrxfctgvyhubijnko5467yuiordcfv45655fgdttejdorywudn756672mmsgyfus",
  port: process.env.PORT || 4000
}