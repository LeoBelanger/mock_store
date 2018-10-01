var products = {
	Box1_$10: {label: "Box 1",
			   imageUrl: "images/Box1_$10.png",
			   price: 10,
			   quantity: 5,
	},
	Box2_$5: {label: "Box 2",
			   imageUrl: "images/Box2_$10.png",
			   price: 5,
			   quantity: 5,
	},
	Clothes1_$20: {label: "Clothes 1",
			   imageUrl: "images/Clothes1_$20.png",
			   price: 20,
			   quantity: 5,
	},
	Clothes2_$30: {label: "Clothes 2",
			   imageUrl: "images/Clothes2_$30.png",
			   price: 30,
			   quantity: 5,
	},
	Jeans_$50: {label: "Jeans",
			   imageUrl: "images/Jeans_$50.png",
			   price: 50,
			   quantity: 5,
	},		   
	KeyboardCombo_$40: {label: "Keyboard Combo",
			   imageUrl: "images/KeyboardCombo_$40.png",
			   price: 40,
			   quantity: 5,
	},
	Keyboard_$20: {label: "Keyboard",
			   imageUrl: "images/Keyboard_$20.png",
			   price: 20,
			   quantity: 5,
	},
	Mice_$20: {label: "Mice",
			   imageUrl: "images/Mice_$20.png",
			   price: 20,
			   quantity: 5,
	},
	PC1_$350: {label: "PC1",
			   imageUrl: "images/PC1_$350.png",
			   price: 350,
			   quantity: 5,
	},
	PC2_$400: {label: "PC2",
			   imageUrl: "images/PC2_$400.png",
			   price: 400,
			   quantity: 5,
	},
	PC3_$300: {label: "PC3",
			   imageUrl: "images/PC3_$350.png",
			   price: 300,
			   quantity: 5,
	},
	Tent_$100: {label: "Tent",
			   imageUrl: "images/Tent_$100.png",
			   price: 100,
			   quantity: 5,
	}
};

var store = new Store(products);

function Store(initialStock) {	
	this.stock = initialStock;
	this.cart = [];
	this.addItemToCart = function() {
	}
	this.removeItemFromCart = function() {
	}
}