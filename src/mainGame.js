class HtmlElementFactory{
	static CreateButton(id, text, onClick){
		let button = document.createElement("button");
		button.id = id;
		button.innerHTML = text;
		button.onclick = onClick;
		return button;
	}
	static CreateTableRow(id){
		let row = document.createElement("tr");
		row.id = id;
		return row;
	}
	static CreateTableColumn(text){
		let column = document.createElement("td");
		column.innerHTML = text;
		return column;
	}
}

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
		this.clickMultiplier = 100;
	}

	Display() {
		let cashDisplay = document.getElementById("Gold");
		cashDisplay.innerHTML = this.cash;
		
		let table = document.getElementById("BuildingTable");
		this.buildingTypes.forEach((buildingType) => {
			let buildingRow = table.querySelector("#BuildingRow" + buildingType);

			let buildingCount = buildingRow.querySelector(".BuildingCount");
			buildingCount.innerHTML = this.buildings[buildingType].length;
			let buildingValue = buildingRow.querySelector(".BuildingValue");
			
			let buildingInstance = eval('new ' + buildingType + '()');
			buildingValue.innerHTML = buildingInstance.multiplier * this.buildings[buildingType].length;
			let buildingCost = buildingRow.querySelector(".BuildingCost");
			buildingCost.innerHTML = parseFloat(buildingInstance.cost) * (this.buildings[buildingType].length + 1);
		});
	}
	Update(elapsedSeconds){
		
		let increaseAmount = 0;
		if (elapsedSeconds >= 1000){
			this.buildingTypes.forEach((buildingType) => {
				let buildingInstance = eval('new ' + buildingType + '()');
				increaseAmount += parseFloat(buildingInstance.multiplier * this.buildings[buildingType].length);
			});
		}

		this.CheckEnabled();
		this.cash += increaseAmount;
	}
	CheckEnabled(){
		this.buildingTypes.forEach((buildingType) => {
			let indexOfTest = this.buildingTypes.indexOf(buildingType);
			let previousBuildingType = this.buildingTypes[indexOfTest - 1];
			if (previousBuildingType !== undefined){
				let previousBuildingInstance = eval('new ' + previousBuildingType + '()');
				if (this.buildings[previousBuildingType].length >= previousBuildingInstance.prevBuildingThreshold){
					try{
						let add = false;
						if (this.enabledBuildings.includes(buildingType) === false) {
							add = true;
						}
						if (add){
							this.enabledBuildings.push(buildingType);
						}
					}
					catch(Exception){
						debugger;
					}
				}
			}
			//Check if we are able to buy the building
			let table = document.getElementById("BuildingTable");
			let buildingRow = table.querySelector("#BuildingRow" + buildingType);
			if (this.enabledBuildings.includes(buildingType)){
				buildingRow.querySelector("#buy" + buildingType).disabled = false;
			}
			else{
				buildingRow.querySelector("#buy" + buildingType).disabled = true;
			}

			//Disable the button if we can't afford it

		});
	}
}

class Save{
	constructor(file){
		const fileReader = new FileReader();
		fileReader.onload = (event) => {
			this.data = JSON.parse(event.target.result);
			
		};
		fileReader.readAsText(file);
		this.cash = 1;
		this.buildings = {
			"Camp": [],
			"Hamlet": [],
			"Village": [],
			"Town": [],
			"City": [],
			"Metropolis": []
		};
	}
}

class Upgrade{
	constructor(){
		this.level = 0;
		this.multiplier = 1;
		this.incomeIncrease = 0;
		this.name = "";
		this.cost = 1;
		this.category = "Main"
	}
}

class ClickUpgrade extends Upgrade{
	constructor(from){
		super();
		this.name = from.name;
		this.multiplier = from.multiplier;
		this.cost = from.cost;
		this.incomeIncrease = from.incomeIncrease;
	}
}

let upgrades = [
	{
		name : "Click Base Upgrade",
		level : 1,
		incomeIncrease : 2,
		cost : 100,
	},
	{
		name : "Click multiplier",
		level : incomeIncrease,
		cost :200,
		incomeIncrease : 0,
		multiplier : 1.1
	}
];

class UpgradeManager{
	constructor(){
		this.upgrades = [];
	}
	AddUpgrade(upgrade){
		//Check if we already have the upgrade
		let upgradeIndex = this.upgrades.indexOf(upgrade);
		if (upgradeIndex === -1){
			this.upgrades.push(upgrade);
		}		
	}
	RemoveUpgrade(upgrade){
		let upgradeIndex = this.upgrades.indexOf(upgrade);
		if (upgradeIndex !== -1){
			this.upgrades.splice(upgradeIndex, 1);
		}
	}
}

class Building {
	constructor() {
		this.name = "";
		this.multiplier = 1;
		this.costMultiplier = 1;
		this.cost = 1;
		this.prevBuildingThreshold = 20;
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
		this.multiplier = 5;
		this.costMultiplier = 3;
	}
}

class Village extends Building {
	constructor() {
		super();
		this.name = "Village";
		this.cost = 1000;
		this.multiplier = 20;
		this.costMultiplier = 4;
	}
}

class Town extends Building {
	constructor() {
		super();
		this.name = "Town";
		this.cost = 10000;
		this.multiplier = 80;
		this.costMultiplier = 5;
	}
}

class City extends Building {
	constructor() {
		super();
		this.name = "City";
		this.cost = 100000;
		this.multiplier = 200;
		this.costMultiplier = 6;
	}
}

class Metropolis extends Building {
	constructor() {
		super();
		this.name = "Metropolis";
		this.cost = 1000000;
		this.multiplier = 800;
		this.costMultiplier = 7;
	}
}

// Init();

// setInterval(() => {
// 	UpdateLoop();
// }, frameTime);


//TODO: Move to this class. 
class Game {
	constructor() {
		this.globalValues = new Globals();
		this.upgradeManager = new UpgradeManager();
		this.elapsedSeconds = 0;
		this.frameTime = 1000 / 60;
	}
	Init(){
		this.globalValues.cash = 0;
		this.globalValues.enabledBuildings.push("Camp");
		this.CreateInitialHtml();
		const mainClickButton = document.getElementById("Increase");
		mainClickButton.onclick = () => {this.ClickIncrease();};
	}
	Run(){
		setInterval(() => {
			this.Update();
			this.Draw();
		}, this.frameTime);		
	}
	Update(){
		this.elapsedSeconds += this.frameTime;
		
		this.globalValues.Update(this.elapsedSeconds);
		
		if (this.elapsedSeconds >= 1000){
			this.elapsedSeconds = 0;
		}
	}
	Draw(){
		this.globalValues.Display();
	}
	CreateInitialHtml () {

		let table = document.getElementById("BuildingTable");
	
		this.globalValues.buildingTypes.forEach((buildingType) => {
			let tableRow = HtmlElementFactory.CreateTableRow("BuildingRow" + buildingType);
			let buildingTypeName = HtmlElementFactory.CreateTableColumn(buildingType);
			let buildingCount = HtmlElementFactory.CreateTableColumn("0");
			buildingCount.classList.add("BuildingCount");
			let buildingValue = HtmlElementFactory.CreateTableColumn("0");
			buildingValue.classList.add("BuildingValue");
			let buildingCost = HtmlElementFactory.CreateTableColumn("0");
			buildingCost.classList.add("BuildingCost");
			let buildingButton = HtmlElementFactory.CreateButton("buy" + buildingType,"Buy", () => {
				this.BuyBuilding(buildingType);
			});
			buildingButton.classList.add("button");
			buildingButton.setAttribute("disabled","");
			let buildingActionContainer = HtmlElementFactory.CreateTableColumn("");
			buildingActionContainer.classList.add("BuildingActionContainer");
			buildingActionContainer.appendChild(buildingButton);
	
			tableRow.appendChild(buildingTypeName);
			tableRow.appendChild(buildingCount);
			tableRow.appendChild(buildingValue);
			tableRow.appendChild(buildingCost);
			tableRow.appendChild(buildingActionContainer);
			table.querySelector("tbody").appendChild(tableRow);
		});
	}
	ClickIncrease() {
		this.globalValues.cash += this.globalValues.clickMultiplier;
	}
	BuyBuilding (buildingType) {
		if (!this.globalValues.enabledBuildings.includes(buildingType)){
			return;
		}	
	
		var building = null;
		let amountOfBuildings = this.globalValues.buildings[buildingType].length;
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
	
		let increaseMultiplier = parseFloat(amountOfBuildings * building.multiplier);
		let cost = building.cost;
	
		if (this.globalValues.cash >= building.cost + parseFloat(amountOfBuildings * building.costMultiplier))
		{
			this.globalValues.cash -= building.cost + parseFloat(amountOfBuildings * building.costMultiplier);
			this.globalValues.buildings[buildingType].push(building);
		}
		else{
			console.log("Not enough cash to buy " + buildingType);
		}
	}
	BuyUpgrade (upgradeName) {
		let upgrade = null;
		switch(upgradeName){
			case "ClickUpgrade": {
				upgrade = new ClickUpgrade(); 
				break;
			}
		}
		this.globalValues.cash -= upgrade.cost;
		this.upgradeManager.BuyUpgrade(upgrade);
	}
	LoadGame (file) {
		let save = new Save(file);
		save.Load();
	}
}

let game = new Game();
game.Init();
game.Run();