var products = {
	Box1: {label: "Box 1", imageUrl: "images/Box1", price: 10, quantity: 5},
	Box2: {label: "Box 2", imageUrl: "images/Box2", price: 5, quantity: 5},
	Clothes1: {label: "Clothes 1", imageUrl: "images/Clothes1.png", price: 20, quantity: 5},
	Clothes2: {label: "Clothes 2", imageUrl: "images/Clothes2.png", price: 30, quantity: 5},
	Jeans: {label: "Jeans", imageUrl: "images/Jeans.png", price: 50, quantity: 5},		   
	KeyboardCombo: {label: "Keyboard Combo", imageUrl: "images/KeyboardCombo.png", price: 40, quantity: 5},
	Keyboard: {label: "Keyboard", imageUrl: "images/Keyboard.png", price: 20, quantity: 5},
	Mice: {label: "Mice", imageUrl: "images/Mice.png", price: 20, quantity: 5},
	PC1: {label: "PC1", imageUrl: "images/PC1.png", price: 350, quantity: 5},
	PC2: {label: "PC2", imageUrl: "images/PC2.png", price: 400, quantity: 5},
	PC3: {label: "PC3", imageUrl: "images/PC3.png", price: 300, quantity: 5},
	Tent: {label: "Tent", imageUrl: "images/Tent.png", price: 100, quantity: 5},
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
	
	/* Hide add if out of stock */
	if (this.stock[itemName].quantity == 0) {
		var addButton = document.getElementById(itemName).childNodes[1];
		console.log(document.getElementById(itemName).childNodes);
		addButton.style.visibility = "hidden";
	}
	
	/* Regenerate remove button */
	if (this.cart[itemName] > 0) {
		var removeButton = document.getElementById(itemName).childNodes[3];
		console.log(document.getElementById(itemName).childNodes);
		removeButton.style.visibility = "visible";
	}
}
	
Store.prototype.removeItemFromCart = function(itemName) {
	inactiveTime = 0;
	/* Hide remove if cart quantity is 0 */
	if (this.cart[itemName] == 1) {
		var removeButton = document.getElementById(itemName).childNodes[3];
		console.log(document.getElementById(itemName).childNodes);
		removeButton.style.visibility = "hidden";
	}
	
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
	
	/* Regenerate add if cart is full */
	if (this.stock[itemName].quantity > 0) {
		var addButton = document.getElementById(itemName).childNodes[1];
		console.log(document.getElementById(itemName).childNodes);
		addButton.style.visibility = "visible";
	}
}

function showCart(cart) {
	inactiveTime = 0;
	var string = "";
	
	itemsInCart = Object.entries(cart);
	console.log(this.cart);
	for(var i = 0; i < itemsInCart.length; i++) {
		string = string.concat(itemsInCart[i] + "\n");
		string = string.replace(",", " : ");
	}
	alert(string);
}

var second = setInterval(increment, 1000);

function increment() {
	inactiveTime++;
	//console.log(inactiveTime);
	
	if (inactiveTime == 1800) {
		alert("Hey there! Are you still planning to buy something?");
		inactiveTime = 0;
	}
}

function renderProduct(container, storeInstance, itemName) {
	var productBox = document.createElement("LI");
	var addButton = document.createElement("BUTTON");
	var removeButton = document.createElement("BUTTON");
	var img = document.createElement("IMG"); 
	var priceOverlay = document.createElement("DIV");
	var label = document.createElement("TEXT"); 
	
	productBox.setAttribute("class", "product");
	productBox.setAttribute("id", itemName);
	addButton.setAttribute("class", "btn-add");
	addButton.setAttribute("onclick", "store.addItemToCart('" + itemName + "')");
	addButton.setAttribute("text", "Add to Cart");
	removeButton.setAttribute("class", "btn-remove");
	removeButton.setAttribute("onclick", "store.removeItemFromCart('" + itemName + "')");
	removeButton.setAttribute("text", "Remove from Cart");
	img.setAttribute("src", storeInstance.stock[itemName].imageUrl); 
	priceOverlay.setAttribute("class", "priceOverlay");
	priceOverlay.setAttribute("text", "$" + storeInstance.stock[itemName].price);
	label.setAttribute("text", storeInstance.stock[itemName].label);
	
	productBox.appendChild(addButton);
	productBox.appendChild(removeButton);
	productBox.appendChild(img);
	productBox.appendChild(priceOverlay);
	productBox.appendChild(label);
	
	container = productBox;
}

function renderProductList(container, storeInstance) {
	var productList = document.createElement();
}