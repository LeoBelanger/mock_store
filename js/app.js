var products = {
	Box1: {label: "Box 1", imageUrl: "images/Box1_$10", price: 10, quantity: 5},
	Box2: {label: "Box 2", imageUrl: "images/Box2_$5", price: 5, quantity: 5},
	Clothes1: {label: "Clothes 1", imageUrl: "images/Clothes1_$20.png", price: 20, quantity: 5},
	Clothes2: {label: "Clothes 2", imageUrl: "images/Clothes2_$30.png", price: 30, quantity: 5},
	Jeans: {label: "Jeans", imageUrl: "images/Jeans_$50.png", price: 50, quantity: 5},		   
	KeyboardCombo: {label: "Keyboard Combo", imageUrl: "images/KeyboardCombo_$40.png", price: 40, quantity: 5},
	Keyboard: {label: "Keyboard", imageUrl: "images/Keyboard_$20.png", price: 20, quantity: 5},
	Mice: {label: "Mice", imageUrl: "images/Mice_$20.png", price: 20, quantity: 5},
	PC1: {label: "PC1", imageUrl: "images/PC1_$350.png", price: 350, quantity: 5},
	PC2: {label: "PC2", imageUrl: "images/PC2_$400.png", price: 400, quantity: 5},
	PC3: {label: "PC3", imageUrl: "images/PC3_$350.png", price: 300, quantity: 5},
	Tent: {label: "Tent", imageUrl: "images/Tent_$100.png", price: 100, quantity: 5},
};

var store = new Store(products);

var inactiveTime = 0; 

function Store(initialStock) {	
	this.stock = initialStock;
	this.cart = [];
}

Store.prototype.addItemToCart = function(itemName) {
	inactiveTime = 0;
	
	
	console.log(this.stock);
	if (itemName in this.cart == false) {
		this.cart[itemName] = 1;
		this.stock[itemName].quantity--; 
		console.log(this.cart);			
	} else {
		if(this.stock[itemName].quantity > 0) {
		//There is still stock left 
			this.cart[itemName]++;
			this.stock[itemName].quantity--;
			console.log(this.cart);
		} else {
		//There's no stock left of this item.
			console.log("There is no stock left!");
		}
	}
}
	
Store.prototype.removeItemFromCart = function(itemName) {
	inactiveTime = 0;
	if (itemName in this.cart) {
		if (this.cart[itemName] > 1) {
			this.cart[itemName]--;
			this.stock[itemName].quantity++;
			console.log(this.cart);
		} else {
			this.cart[itemName] == 1;
			this.stock[itemName].quantity++;
			delete this.cart[itemName];
			console.log(this.cart);
		} 
	} else {
		console.log("This item is not in the cart");
	}
}

function showCart(cart) {
	inactiveTime = 0;
	var string = "";
	
	itemsInCart = Object.entries(cart);
	console.log(this.cart);
	for(var i = 0; i < itemsInCart.length; i++) {
		string = string.concat(itemsInCart[i] + "\n");
		string = string.replace(",", ": ");
	}
	alert(string);
}

var second = setInterval(increment, 1000);

function increment() {
	inactiveTime++;
	console.log(inactiveTime);
	
	if (inactiveTime == 30) {
		alert("Hey there! Are you still planning to buy something?");
		inactiveTime = 0;
	}
}