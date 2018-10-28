var products = {
	Box1: {label: "Box 1", imageUrl: "images/Box1.png", price: 10, quantity: 5},
	Box2: {label: "Box 2", imageUrl: "images/Box2.png", price: 5, quantity: 5},
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

var store;

function Store(initialStock) {	
	this.stock = initialStock;
	this.cart = [];
	this.onUpdate = null;
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
	
	this.onUpdate(itemName);
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
	
	this.onUpdate(itemName);
}

function showCart(cart) {
	inactiveTime = 0;
	
	var modal = document.getElementById("modal");
	console.log("got modal");
	var modalContent = document.getElementById("modal-content");
	renderCart(modalContent, store);
	modal.style.display = "block";
	/*
	var string = "";
	
	itemsInCart = Object.entries(cart);
	console.log(this.cart);
	for(var i = 0; i < itemsInCart.length; i++) {
		string = string.concat(itemsInCart[i] + "\n");
		string = string.replace(",", " : ");
	}
	alert(string); */
}

window.onload = function () {
	console.log("on load");
	store = new Store(products);
	
	store.onUpdate = function(itemName) {
		renderProduct(document.getElementById(itemName), store, itemName);
		renderCart(document.getElementById("modal-content"), store);
	}	
	
	renderProductList(document.getElementById("productView"), store); 
}



function renderProduct(container, storeInstance, itemName) {
	console.log(itemName);
	
	while (container.firstChild != null) {
		container.removeChild(container.firstChild);
	}
	
	var addButton = document.createElement("BUTTON");
	var addButtonLabelNode = document.createTextNode("Add to Cart");
	var removeButton = document.createElement("BUTTON");
	var removeButtonLabelNode = document.createTextNode("Remove from Cart");
	var img = document.createElement("IMG"); 
	var priceOverlay = document.createElement("DIV");
	var priceOverlayLabelNode = document.createTextNode("$" + storeInstance.stock[itemName].price);
	var productLabel = document.createElement("P");
	var productLabelNode = document.createTextNode(storeInstance.stock[itemName].label);
	
	container.setAttribute("class", "product");
	container.setAttribute("id", itemName);
	
	addButton.setAttribute("class", "btn-add");
	addButton.setAttribute("onclick", "store.addItemToCart('" + itemName + "')");
	
	removeButton.setAttribute("class", "btn-remove");
	removeButton.setAttribute("onclick", "store.removeItemFromCart('" + itemName + "')");
	
	img.setAttribute("src", storeInstance.stock[itemName].imageUrl); 
	
	priceOverlay.setAttribute("class", "priceOverlay");

	productLabel.setAttribute("class", "productLabel");
	
	container.appendChild(img);
	
	if(storeInstance.stock[itemName].quantity != 0) {
		container.appendChild(addButton);
		addButton.appendChild(addButtonLabelNode);
	}
	
	if(storeInstance.cart[itemName] > 0) {
		container.appendChild(removeButton);
		removeButton.appendChild(removeButtonLabelNode);
	}
	
	container.appendChild(priceOverlay);
	priceOverlay.appendChild(priceOverlayLabelNode);
	
	container.appendChild(productLabel);
	productLabel.appendChild(productLabelNode);
	
	return container;
}

function renderProductList(container, storeInstance) {
	console.log(Object.keys(storeInstance.stock).length);
	var productList = document.createElement("UL");
	productList.setAttribute("id", "productList"); 
	
	for (var product in storeInstance.stock) {
		console.log(product);
		var productBox = document.createElement("LI");
		var temp = renderProduct(productBox, storeInstance, product);
		productList.appendChild(temp);
	}
	container.appendChild(productList);
}

function renderCart(container, storeInstance) {
	while (container.lastChild != null) {
		if (container.lastChild != document.getElementById("btn-hide-cart")) 
			container.removeChild(container.lastChild);
	} 
	
	var table = document.createElement("table");
	
	var keysInCart = Object.keys(storeInstance.cart);
	console.log(keysInCart);
	var valuesInCart = Object.values(storeInstance.cart);
	
	var totalPrice = 0;
	
	if (keysInCart.length > 0) {
		for(var count = 0; count < keysInCart.length; count++) {
			var keyLabel = keysInCart[count];
			var priceOfKey = products[keyLabel].price;
			
			totalPrice = totalPrice + (valuesInCart[count] * priceOfKey);
			
			var row = document.createElement("tr");
			
			var itemName = document.createElement("td");
			var itemNameNode = document.createTextNode(keysInCart[count]);
			
			var quantity = document.createElement("td");
			var quantityNode = document.createTextNode(valuesInCart[count]);
			
			var addButton = document.createElement("button");
			var addButtonNode = document.createTextNode("+");
			
			var removeButton = document.createElement("button");
			var removeButtonNode = document.createTextNode("-");
			
			row.setAttribute("class", "modalRow");
			
			container.appendChild(table);
			
			table.appendChild(row);
			
			row.appendChild(itemName);
			row.appendChild(quantity);
			row.appendChild(addButton);
			row.appendChild(removeButton);
			
			itemName.appendChild(itemNameNode);
			quantity.appendChild(quantityNode);
			addButton.appendChild(addButtonNode);
			addButton.setAttribute("onclick", "store.addItemToCart('" + keyLabel + "')");

			removeButton.appendChild(removeButtonNode);
			removeButton.setAttribute("onclick", "store.removeItemFromCart('" + keyLabel + "')");
		}	
		
		var priceRow = document.createElement("tr");
		var priceNode = document.createTextNode(totalPrice);
		priceRow.appendChild(priceNode);
		table.appendChild(priceRow);
	}
}

function hideCart() {
	console.log("hide cart");
	var modal = document.getElementById("modal");
	modal.style.display = "none";
}

var inactiveTime = 0; 

var second = setInterval(increment, 1000);

function increment() {
	inactiveTime++;
	//console.log(inactiveTime);
	
	if (inactiveTime == 1800) {
		alert("Hey there! Are you still planning to buy something?");
		inactiveTime = 0;
	}
}