var store;
var inactiveTime = 0; 
var second = setInterval(increment, 1000);

function Store(serverUrl) {	
    this.serverUrl = serverUrl;
	this.stock = {};
	this.cart = [];
	this.onUpdate = null;
}


Store.prototype.syncWithServer = function(onSync) {
	var anyStore = this;
	
	ajaxGet(store.serverUrl + "/products", 
		function(productList) {
	
		//Calculate Delta
		var delta = {};
		
		for (obj in productList) {
			//Check if the item is currently in the stock. We can't make calculations with it if it is undefined
			if(store.stock[obj] != undefined) {
				if(store.cart[obj] != undefined) {
					delta[obj] = {}; 
					if(store.stock[obj].price != productList[obj].price) {
						console.log("if 1");
						delta[obj].price = productList[obj].price - store.stock[obj].price; 
					}
					if((store.stock[obj].quantity) != (productList[obj].quantity + store.cart[obj])) {
						console.log("if 2");
						delta[obj].quantity = productList[obj].quantity - (store.stock[obj].quantity + store.cart[obj]);
					}
				} else {
					delta[obj] = {}; 
					if(store.stock[obj].price != productList[obj].price) {
						console.log("if 3");
						delta[obj].price = productList[obj].price - store.stock[obj].price; 
					}
					if((store.stock[obj].quantity) != productList[obj].quantity) {
						console.log("if 4");
						delta[obj].quantity = productList[obj].quantity - store.stock[obj].quantity;
					}
				}
			}
		}
			
		
		console.log(delta);

		anyStore.stock = productList; 
		anyStore.onUpdate(); 
		
		
		if (onSync) {
			onSync(delta);
		}
		
		},

		function(error) {
			console.log("Error code:" + error);
		}
	);
}



window.onload = function () {
	
	store = new Store("https://cpen400a-bookstore.herokuapp.com");
	store.syncWithServer();
	store.onUpdate = function(itemName) {
		if (itemName !== undefined) {
			renderProduct(document.getElementById("product-" + itemName), store, itemName);
			renderCart(document.getElementById("modal-content"), store);
		}
		renderProductList(document.getElementById("productView"), store); 
	}	
}

var count500 = 0;
var countTimeout = 0

function ajaxGet(url, onSuccess, onError) {
	
	var request = new XMLHttpRequest();
	request.timeout = 500;
	request.open("GET", url);
	
	request.onload = function() {
		if(request.status == 200) {
			count500 = 0;
			countTimeout = 0;
			onSuccess(JSON.parse(request.responseText));
		} else { 
			if (count500 < 3) {
				count500++;
				console.log("handle 500");
				ajaxGet(url, onSuccess, onError);
			} else {
				onError(request.status);
				count500 = 0;
				console.log("Error Code: 500 occurred 3 times");
			}
		}
	}
	
	request.ontimeout = function() {
		if (countTimeout < 3) {
			console.log("In Timeout, Count = " + countTimeout); 
			countTimeout++;
			ajaxGet(url, onSuccess, onError);
		} else {
			onError(request.status);
			countTimeout = 0;
			console.log("goes to error");
		}
	}
	
	request.onerror = function() {
		console.log("Error with server");
	}
	
	request.send();
}

document.onkeydown = function(e) {
	if(e.keyCode == 27) {
		var modal = document.getElementById("modal");
		modal.style.display = "none";
	}
}



Store.prototype.addItemToCart = function(itemName) {
	inactiveTime = 0;
	
	if (itemName in this.cart == false) {
		this.cart[itemName] = 1;
		this.stock[itemName].quantity--; 			
	} else {
		if(this.stock[itemName].quantity > 0) {
			this.cart[itemName]++;
			this.stock[itemName].quantity--;
		} else {
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
		} else {
			this.cart[itemName] == 1;
			this.stock[itemName].quantity++;
			delete this.cart[itemName];
		} 
	} else {
		console.log("This item is not in the cart");
	}
	this.onUpdate(itemName);
}

function showCart(cart) {
	inactiveTime = 0;
	
	var modal = document.getElementById("modal");
	var modalContent = document.getElementById("modal-content");
	renderCart(modalContent, store);
	modal.style.display = "block";
}

function renderProduct(container, storeInstance, itemName) {
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
	while (container.firstChild != null) {
		container.removeChild(container.firstChild);
	}
	
	var productList = document.createElement("UL");
	productList.setAttribute("id", "productList"); 
	
	for (var itemName in storeInstance.stock) {
		var productBox = document.createElement("LI");
		productBox.setAttribute("class", "product");
		productBox.setAttribute("id", "product-" + itemName);
		var temp = renderProduct(productBox, storeInstance, itemName);
		productList.appendChild(temp);
	}
	container.appendChild(productList);
	
	return container;
}

function renderCart(container, storeInstance) {
	var totalPrice = 0;
	
	while (container.firstChild != null) {
		container.removeChild(container.firstChild);
	}
	
	var hideCartButton = document.createElement("button");
	var hideCartButtonNode = document.createTextNode("x");
	hideCartButton.setAttribute("id", "btn-hide-cart"); 
	hideCartButton.setAttribute("onclick", "hideCart()");
	hideCartButton.appendChild(hideCartButtonNode);
	container.appendChild(hideCartButton);
	
	var checkoutButton = document.createElement("button");
	var checkoutButtonNode = document.createTextNode("Check Out");
	checkoutButton.setAttribute("id", "btn-check-out"); 
	checkoutButton.setAttribute("onclick", "disabled = true;store.checkOut(function() {document.getElementById('btn-check-out').disabled = false;})");
	checkoutButton.appendChild(checkoutButtonNode);
	container.appendChild(checkoutButton);
	
	
	
	
	var table = document.createElement("table");
	table.setAttribute("id", "cartTable");
	
	var keysInCart = Object.keys(storeInstance.cart);
	var valuesInCart = Object.values(storeInstance.cart);
	
	var headerRow = document.createElement("tr"); 
	var headerItemName = document.createElement("th"); 
	var headerItemQuantity = document.createElement("th");
	headerRow.appendChild(headerItemName);
	headerRow.appendChild(headerItemQuantity);
	var headerItemNameText = document.createTextNode("Item Name"); 
	var headerItemQuantityText = document.createTextNode("Quantity"); 
	headerItemName.appendChild(headerItemNameText); 
	headerItemQuantity.appendChild(headerItemQuantityText); 
	table.appendChild(headerRow);
	
	if (keysInCart.length > 0) {
		for(var count = 0; count < keysInCart.length; count++) {
			var keyLabel = keysInCart[count];
			var priceOfKey = storeInstance.stock[keyLabel].price;
			
			totalPrice = totalPrice + (valuesInCart[count] * priceOfKey);
			
			var row = document.createElement("tr");
			
			var itemName = document.createElement("td");
			var itemNameNode = document.createTextNode(storeInstance.stock[keyLabel].label);
			
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
			addButton.setAttribute("id", "modalAddButton"); 

			removeButton.appendChild(removeButtonNode);
			removeButton.setAttribute("onclick", "store.removeItemFromCart('" + keyLabel + "')");
			removeButton.setAttribute("id", "modalRemoveButton"); 
		}	
	}
	
	var priceRow = document.createElement("tr");
	priceRow.setAttribute("id", "totalPriceRow");
	var priceElement = document.createElement("td");
	priceElement.setAttribute("colspan", "2");
	priceRow.appendChild(priceElement);
	var priceNode = document.createTextNode("Total Price: $" + totalPrice);
	priceElement.appendChild(priceNode);
	table.appendChild(priceRow);
	
	return container;
}

function hideCart() {
	var modal = document.getElementById("modal");
	modal.style.display = "none";
}


Store.prototype.checkOut = function(onFinish) {
	this.syncWithServer(function(delta) {
		
		console.log(delta); 
		//Task 4B: Check delta, if it has values, indicate what they are to the user. 
		if(delta) {
			console.log(delta);
			
			var itemsList = Object.entries(delta);
			/*for(i in itemsList) {
				var price = item[i].price; 
				var quantity = item[i].quantity; 
			}*/
				
			console.log(itemsList);
			
		}
	
	
	});
	
	if(onFinish != undefined) {
		onFinish();
	}
}


function increment() {
	inactiveTime++;
	
	if (inactiveTime == 1800) {
		alert("Hey there! Are you still planning to buy something?");
		inactiveTime = 0;
	}
}

