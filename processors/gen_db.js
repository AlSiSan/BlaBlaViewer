const {MongoClient} = require('mongodb');

const uri = "mongodb+srv://admin:admin@blablaviewer-o6yam.mongodb.net/test?retryWrites=true"


const client = new MongoClient(uri);
let connected;
client.connect(() => {
    connected = true;
});

let waitUntilConnected = () => {
    if (!connected) {
        setTimeout(waitUntilConnected, 100);
    }
}
waitUntilConnected();

//preparar los datos

//insert many


