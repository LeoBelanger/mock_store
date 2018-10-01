var products = {
	Box1_$10: {label: "Box 1",
			   imageUrl: "images/Box1_$10.png",
			   price: 10,
			   quantity: 5,
			}
};

var test = Object.create( products );


console.log(test.Box1_$10);

function Store(initialStock) {	
	this.stock = initialStock;
	this.cart = [];
	this.addItemToCart = function() {
	}
	this.removeItemFromCart = function() {
	}
}