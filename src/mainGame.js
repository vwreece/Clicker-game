class Globals {
	constructor() {
		this.cash = 1;
		this.enabledBuildings = [];
		this.buildingTypes = [
			"Camp",
			"Hamlet",
			"Village",
			"Town",
			"City",
			"Metropolis"
		];
		this.buildings = {
			"Camp": [],
			"Hamlet": [],
			"Village": [],
			"Town": [],
			"City": [],
			"Metropolis": []
		};
		this.clickMultiplier = 1;
	}

	Display() {
		let cashDisplay = document.getElementById("Gold");
		cashDisplay.innerHTML = this.cash;
	}
	Update(){
		
		let increaseAmount = 0;
		this.buildingTypes.forEach((buildingType) => {
			let buildingInstance = eval('new ' + buildingType + '()');
			increaseAmount += parseFloat(buildingInstance.multiplier * this.buildings[buildingType].length);
		});
		this.cash += increaseAmount;
	}
}

class Building {
	constructor() {
		this.name = "";
		this.multiplier = 1;
		this.costMultiplier = 1;
		this.cost = 1;
	}

	IncreaseCash() {
		globalValues.cash += this.multiplier;
	}
}

class Camp extends Building {
	constructor() {
		super();
		this.name = "Camp";
		this.cost = 1;
		this.multiplier = 1;
		this.costMultiplier = 1;
	}
}

class Hamlet extends Building {
	constructor() {
		super();
		this.name = "Hamlet";
		this.cost = 100;
		this.multiplier = 1;
		this.costMultiplier = 3;
	}
}

class Village extends Building {
	constructor() {
		super();
		this.name = "Village";
		this.cost = 1000;
		this.multiplier = 1;
		this.costMultiplier = 4;
	}
}

class Town extends Building {
	constructor() {
		super();
		this.name = "Town";
		this.cost = 10000;
		this.multiplier = 1;
		this.costMultiplier = 5;
	}
}

class City extends Building {
	constructor() {
		super();
		this.name = "City";
		this.cost = 100000;
		this.multiplier = 1;
		this.costMultiplier = 6;
	}
}

class Metropolis extends Building {
	constructor() {
		super();
		this.name = "Metropolis";
		this.cost = 1000000;
		this.multiplier = 1;
		this.costMultiplier = 7;
	}
}

function getSubClasses(baseClass){
	let result = [];
	let classes = Object.values(baseClass);
	for(let i = 0; i < classes.length; i++){
		if(classes[i].prototype instanceof baseClass){
			result.push(classes[i]);
		}
	}
	return result;
}

let globalValues = new Globals();

const Increase = () => {
	globalValues.cash += globalValues.clickMultiplier;
};

function BuyBuilding () {
	let buildingType = this.id.replace("buy", "");

	if (!globalValues.enabledBuildings.includes(buildingType)){
		console.log("Buying " + buildingType + " is disabled.");
		return;
	}
	

	var building = null;
	let amountOfBuildings = globalValues.buildings[buildingType].length;
	switch(buildingType){
		case "Camp": {
			building = new Camp();
			break;
		}
		case "Hamlet": { 
			building = new Hamlet();
			break;
		}
		case "Village": { 
			building = new Village();
			break;
		}
		case "Town": {
			building = new Town();
			break;
		}
		case "City": {
			building = new City();
			break;
		}
		case "Metropolis": { 
			building = new Metropolis();
			break;
		}
	}

	console.log(amountOfBuildings);

	let increaseMultiplier = parseFloat(amountOfBuildings * building.multiplier);
	let cost = building.cost;
	console.log(building);

	if (globalValues.cash > building.cost + parseFloat(amountOfBuildings * building.costMultiplier))
	{
		globalValues.cash -= building.cost + parseFloat(amountOfBuildings * building.costMultiplier);
		globalValues.buildings[buildingType].push(building);
	}
	else{
		console.log("Not enough cash to buy " + buildingType);
	}
};

const init = () => {
	globalValues.casg = 0;
	globalValues.enabledBuildings.push("Camp");
	let listOfBuildingTypes = [
		"Camp",
		"Hamlet",
		"Village",
		"Town",
		"City",
		"Metropolis"
	];

	listOfBuildingTypes.forEach((buildingType) => {
		let buttonToAdd = document.getElementById("buy" + buildingType);
		buttonToAdd.onclick = BuyBuilding;
	});

	console.log(window);
};

let elapsedSeconds = 0;
const frameTime = 1000 / 60;

const UpdateLoop = () => {
	elapsedSeconds += frameTime;
	let buttonCampAdd = document.getElementById("buyCamp");
	let buttonHamletAdd = document.getElementById("buyHamlet");

	//Update global loop.
	if (elapsedSeconds >= 1000) {
		elapsedSeconds = 0;
		globalValues.cash += Camp.length;
		globalValues.cash += Hamlet.length > 0 ? Hamlet.length * hamlet.prototype.multiplier : 0;
		globalValues.Update();
	}

	globalValues.Display();
	

	//Check what is enabled.
	buttonHamletAdd.enabled = globalValues.cash - (Hamlet.cost + Hamlet.length * Hamlet.cost) >= 0;
	buttonCampAdd.enabled = globalValues.cash - Camp.length * 1 >= 0;
	
};

setInterval(() => {
	UpdateLoop();
}, frameTime);

init();