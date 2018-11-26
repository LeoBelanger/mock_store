var MongoClient = require('mongodb').MongoClient;	// require the mongodb driver

/**
 * Uses mongodb v3.1.9 - [API Documentation](http://mongodb.github.io/node-mongodb-native/3.1/api/)
 * StoreDB wraps a mongoDB connection to provide a higher-level abstraction layer
 * for manipulating the objects in our bookstore app.
 */
function StoreDB(mongoUrl, dbName){
	if (!(this instanceof StoreDB)) return new StoreDB(mongoUrl, dbName);
	this.connected = new Promise(function(resolve, reject){
		MongoClient.connect(
			mongoUrl,
			{
				useNewUrlParser: true
			},
			function(err, client){
				if (err) reject(err);
				else {
					console.log('[MongoClient] Connected to '+mongoUrl+'/'+dbName);
					resolve(client.db(dbName));
				}
			}
		)
	});
}

StoreDB.prototype.getProducts = function(queryParams){
	var queryObj = {};
	return this.connected.then(function(db){
		return new Promise(function(resolve, reject) {
			 
			
			console.log(queryObj); 
			console.log("QueryParams: ", queryParams); 
			
			if(queryParams.minPrice != undefined) {
				if(queryObj.price != undefined) {
					queryObj.price["$gte"] = Number(queryParams.minPrice);
				}else {
					queryObj.price = {};
					queryObj.price["$gte"] = Number(queryParams.minPrice);
				}
				
			}
			
			if(queryParams.maxPrice != undefined) {
				if(queryObj.price != undefined) {
					queryObj.price["$lte"] = Number(queryParams.maxPrice);
				}else {
					queryObj.price = {};
					queryObj.price["$lte"] = Number(queryParams.maxPrice);
				}
			}
			
			if(queryParams.category != undefined) {
				queryObj.category = {};
				queryObj.category = {"$eq": queryParams.category};
			} 
			
			console.log(queryObj); 

			db.collection("products").find(queryObj).toArray(function(err, result) {

				
				if(err) {
					console.log(err);
					reject(err);
				} else {
					var returnResult = {};
					for (var i = 0; i < result.length; i++) {
						var product = result[i];
						console.log("product: ", product);
						returnResult[product._id] = product;
						delete returnResult[product._id]["_id"];
					}
					console.log("return result: ", returnResult);
					resolve(returnResult); 
				}
			});
		});
	});
}

StoreDB.prototype.addOrder = function(order){
	return this.connected.then(function(db){
		return new Promise(function(resolve, reject) {
			console.log("Initializing order... ", order);
				
			db.collection("orders").insert(order, function(err, result) {
				if(err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
			
			//Reduce Quantity in Products Collection
			for(var item in order.cart) {
				db.collection("products").update({_id: item}, {$inc: {quantity: - order.cart[item]}}); 
			}
		})
	})
}

module.exports = StoreDB;