var mongo = require('mongodb');

var Server = mongo.Server,
    BSON = mongo.BSONPure;


var mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost/orchiddb?auto_reconnnect" 



var db = null;
mongo.connect(mongoUri, {}, function(err, database) {
    if(!err) {
    	db = database;
        console.log("Connected to 'orchiddb' database");
        db.collection('orchids', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'orchids' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
    else {
    	console.log("COULD NOT CONNECT TO MONGO: " +mongoUri);
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving orchid: ' + id);
    db.collection('orchids', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('orchids', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addOrchid = function(req, res) {
    var orchid = req.body;
    console.log('Adding orchid: ' + JSON.stringify(orchid));
    db.collection('orchids', function(err, collection) {
        collection.insert(orchid, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateOrchid = function(req, res) {
    var id = req.params.id;
    var orchid = req.body;
    delete orchid._id;
    console.log('Updating orchid: ' + id);
    console.log(JSON.stringify(orchid));
    db.collection('orchids', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, orchid, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating orchid: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(orchid);
            }
        });
    });
}

exports.deleteOrchid = function(req, res) {
    var id = req.params.id;
    console.log('Deleting orchid: ' + id);
    db.collection('orchids', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var orchids = [
    {
        genus: "CHATEAU DE SAINT COSME",
        species: "2009",
        awards: "Grenache / Syrah",
        color: "France",
        sizeofplant: "Southern Rhone",
        purchaseprice: "$15.99",
		purchasedate: "",
        fragrance: "Yes",
        description: "The aromas of fruit and spice give one a hint of the light drinkability of this lovely wine, which makes an excellent complement to fish dishes.",
        picture: "saint_cosme.jpg"
    }, 
    {
        genus: "WATERBROOK",
        species: "2009",
        award: "Merlot",
        color: "USA",
        sizeofplant: "Washington",
        purchaseprice: "$15.12",
        purchasedate: "",
        fragrance: "Yes",
        description: "Legend has it the gods didn't share their ambrosia with mere mortals. This merlot may be the closest we've ever come to a taste of heaven.",
        picture: "waterbrook.jpg"
    }];

    db.collection('orchids', function(err, collection) {
        collection.insert(orchids, {safe:true}, function(err, result) {});
    });

};