var store;
var inactiveTime = 0; 
var second = setInterval(increment, 1000);
var displayed = [];

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
			var delta = productList;
			
			for (obj in productList) {
				if(store.stock[obj] != undefined) {
					if(store.cart[obj] != undefined) {
						delta[obj] = {}; 
						if(store.stock[obj].price != productList[obj].price) {
							delta[obj].price = productList[obj].price - store.stock[obj].price; 
						}
						if((store.stock[obj].quantity + store.cart[obj]) != productList[obj].quantity) {
							delta[obj].quantity = productList[obj].quantity - (store.stock[obj].quantity + store.cart[obj]);
						}
					} else {
						delta[obj] = {}; 
						if(store.stock[obj].price != productList[obj].price) {
							delta[obj].price = productList[obj].price - store.stock[obj].price; 
						}
						if((store.stock[obj].quantity) != productList[obj].quantity) {
							delta[obj].quantity = productList[obj].quantity - store.stock[obj].quantity;
						}
					}
				}
			}

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
	store = new Store("http://localhost:3000");
	store.syncWithServer(function(delta) {
		console.log("DELTA: ", delta); 
		displayed = Object.keys(delta);
		renderProductList(document.getElementById("productView"), store); 
	});
	store.onUpdate = function(itemName) {
		if (itemName !== undefined) {
			renderProduct(document.getElementById("product-" + itemName), store, itemName);
			renderCart(document.getElementById("modal-content"), store);
		}
		renderProductList(document.getElementById("productView"), store); 
		renderMenu(document.getElementById("menuView"), store);
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
	console.log("Render Product displayed: ", displayed);
	console.log(itemName);
	console.log(storeInstance.stock[itemName]);
	
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
	console.log(storeInstance);
	while (container.firstChild != null) {
		container.removeChild(container.firstChild);
	}
	
	var productList = document.createElement("UL");
	productList.setAttribute("id", "productList"); 
	console.log("displayed in renderprodlist:", displayed);
	for (var itemName in displayed) {
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
	var changes = {};
	
	this.syncWithServer(function(delta) {
		changes = delta; 
		var overallChanges = "";
		
		//Task 4B: Check delta, if it has values, indicate what they are to the user. 
		if(delta != undefined) {
			console.log(delta);
			var change = false;
			for (i in delta) {
				if (delta[i].price != undefined || delta[i].quantity != undefined) {
					overallChanges = overallChanges.concat(i + ": ");
				}
				if (delta[i].price != undefined) {
					overallChanges = overallChanges.concat("Price changed by: $", delta[i].price);
					overallChanges = overallChanges.concat(" ");
					change = true; 
				}
				if (delta[i].quantity != undefined) {
					overallChanges = overallChanges.concat("Quantity changed by: ", delta[i].quantity);
					overallChanges = overallChanges.concat("\n");
					change = true; 
				}
			}
			
			console.log(overallChanges);
			
			if(change) {
				alert(overallChanges);
			}
		} 
	});
	
	
	
	if(onFinish != undefined) {
		var totalPrice = 0; 
		var enableCheckout = true; 
		
		onFinish(); 
		
		for(obj in store.cart) {
			if(changes[obj]) {
				enableCheckout = false;
			}
		}
		
		for(i in store.cart) {
			totalPrice += store.cart[i] * store.stock[i].price;
		}
		
		if(enableCheckout) {
			alert("The total price is: " + totalPrice);
		}
		if(enableCheckout == false) {
			alert("Changes were made when synchronizing with the server.");
		}
	}
}


function increment() {
	inactiveTime++;
	
	if (inactiveTime == 1800) {
		alert("Hey there! Are you still planning to buy something?");
		inactiveTime = 0;
	}
}

Store.prototype.queryProducts = function(query, callback){
	var self = this;
	var queryString = Object.keys(query).reduce(function(acc, key){
			return acc + (query[key] ? ((acc ? '&':'') + key + '=' + query[key]) : '');
		}, '');
	ajaxGet(this.serverUrl+"/products?"+queryString,
		function(products){
			Object.keys(products)
				.forEach(function(itemName){
					var rem = products[itemName].quantity - (self.cart[itemName] || 0);
					if (rem >= 0){
						self.stock[itemName].quantity = rem;
					}
					else {
						self.stock[itemName].quantity = 0;
						self.cart[itemName] = products[itemName].quantity;
						if (self.cart[itemName] === 0) delete self.cart[itemName];
					}
					
					self.stock[itemName] = Object.assign(self.stock[itemName], {
						price: products[itemName].price,
						label: products[itemName].label,
						imageUrl: products[itemName].imageUrl
					});
				});
			self.onUpdate();
			callback(null, products);
		},
		function(error){
			callback(error);
		}
	)
}

function renderMenu(container, storeInstance){
	while (container.lastChild) container.removeChild(container.lastChild);
	if (!container._filters) {
		container._filters = {
			minPrice: null,
			maxPrice: null,
			category: ''
		};
		container._refresh = function(){
			storeInstance.queryProducts(container._filters, function(err, products){
					if (err){
						alert('Error occurred trying to query products');
						console.log(err);
					}
					else {
						displayed = Object.keys(products);
						console.log("Displayed = ", displayed); 
						renderProductList(document.getElementById('productView'), storeInstance);
					}
				});
		}
	}

	var box = document.createElement('div'); container.appendChild(box);
		box.id = 'price-filter';
		var input = document.createElement('input'); box.appendChild(input);
			input.type = 'number';
			input.value = container._filters.minPrice;
			input.min = 0;
			input.placeholder = 'Min Price';
			input.addEventListener('blur', function(event){
				container._filters.minPrice = event.target.value;
				container._refresh();
			});

		input = document.createElement('input'); box.appendChild(input);
			input.type = 'number';
			input.value = container._filters.maxPrice;
			input.min = 0;
			input.placeholder = 'Max Price';
			input.addEventListener('blur', function(event){
				container._filters.maxPrice = event.target.value;
				container._refresh();
			});

	var list = document.createElement('ul'); container.appendChild(list);
		list.id = 'menu';
		var listItem = document.createElement('li'); list.appendChild(listItem);
			listItem.className = 'menuItem' + (container._filters.category === '' ? ' active': '');
			listItem.appendChild(document.createTextNode('All Items'));
			listItem.addEventListener('click', function(event){
				container._filters.category = '';
				container._refresh()
			});
	var CATEGORIES = [ 'Clothing', 'Technology', 'Office', 'Outdoor' ];
	for (var i in CATEGORIES){
		var listItem = document.createElement('li'); list.appendChild(listItem);
			listItem.className = 'menuItem' + (container._filters.category === CATEGORIES[i] ? ' active': '');
			listItem.appendChild(document.createTextNode(CATEGORIES[i]));
			listItem.addEventListener('click', (function(i){
				return function(event){
					container._filters.category = CATEGORIES[i];
					container._refresh();
				}
			})(i));
	}
}