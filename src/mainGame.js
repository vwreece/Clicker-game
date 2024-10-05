import { HtmlElementFactory } from "./HtmlElementFactory.js";





class Globals {
	constructor(dataFile) {
		this.cash = 1;
		this.enabledBuildings = [];
		this.clickMultiplier = 1;
		this.buildingTypes = dataFile.Buildings.map(x => new BuildingType(x));
		//TODO:Better structure to manage instances of buildings etc.
		this.buildingCounts = this.buildingTypes.map(x => { return { 
			name : x.name, 
			count : 0,
			costMultiplier : x.costMultiplier,
			multiplier : 1
		}});
		this.buildingCounts.getByName = function(nameParam){
			return this.find(x => x.name == nameParam);
		};
		this.buildingTypes.getByName = function(nameParam){
			return this.find(x => x.name == nameParam);
		};
		console.log(this.buildingCounts);
	}

	Display() {
		let cashDisplay = document.getElementById("Gold");
		cashDisplay.innerHTML = this.cash.toFixed(2);
		
		let table = document.getElementById("BuildingTable");
		this.buildingTypes.forEach((buildingType) => {
			let buildingRow = table.querySelector("#BuildingRow" + buildingType.name);
			let buildingInstance = this.buildingCounts.getByName(buildingType.name);

			let buildingCount = buildingRow.querySelector(".BuildingCount");
			buildingCount.innerHTML = buildingInstance.count;
			let buildingValue = buildingRow.querySelector(".BuildingValue");
			buildingValue.innerHTML = buildingInstance.multiplier * buildingInstance.count;
			let buildingCost = buildingRow.querySelector(".BuildingCost");
			buildingCost.innerHTML = parseFloat(buildingType.cost) * (buildingInstance.count + 1) * buildingInstance.costMultiplier;
		});
	}
	Update(frameTime){
		
		let increaseAmount = 0;
		
		this.buildingTypes.forEach((buildingType) => {
			var buildingToSum = this.buildingCounts.find( x => x.name == buildingType.name);
			if (buildingToSum == null)
				throw Exception("No matching buiding count for building type.");

			increaseAmount += parseFloat(buildingToSum.multiplier * buildingToSum.count);
		});

		this.CheckEnabled();
		this.cash += increaseAmount / frameTime;
	}
	CheckEnabled(){
		this.buildingTypes.forEach((buildingType) => {
			let indexOfTest = this.buildingTypes.indexOf(buildingType);
			let previousBuildingType = this.buildingTypes[indexOfTest - 1];
			if (previousBuildingType !== undefined){
				let previousBuildingInstance  = this.buildingCounts.find(x => x.name == previousBuildingType.name);
				if (previousBuildingInstance.count >= previousBuildingType.prevBuildingThreshold){
					try{
						let add = false;
						if (this.enabledBuildings.includes(buildingType.name) === false) {
							add = true;
						}
						if (add){
							this.enabledBuildings.push(buildingType.name);
						}
					}
					catch(Exception){
						debugger;
					}
				}
			}
			//Check if we are able to buy the building
			let table = document.getElementById("BuildingTable");
			let buildingRow = table.querySelector("#BuildingRow" + buildingType.name);
			if (this.enabledBuildings.includes(buildingType.name)){
				buildingRow.querySelector("#buy" + buildingType.name).disabled = false;
			}
			else{
				buildingRow.querySelector("#buy" + buildingType.name).disabled = true;
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

class BuildingType {
	constructor(buildingDefinition) {
		this.name = buildingDefinition.Name;
		this.cost = buildingDefinition.Cost;
		this.prevBuildingThreshold = buildingDefinition.PrevBuildingThreshold;
		this.costMultiplier = parseFloat(buildingDefinition.CostMultiplier);
	}
}

class BuildingInstance {
	
}

class BuildingUpgrade {
    constructor() {
        this.name = "BuildingUpgrade";
        this.cost = 1000; // Set the cost of the upgrade
        this.multiplier = 2; // Set the multiplier of the upgrade
    }
}

class BuildingManager {
	constructor(){
		this.buildingTypes;
		this.buildingInstances;
	}
}

// Init();

// setInterval(() => {
// 	UpdateLoop();
// }, frameTime);


//TODO: I think instead of loading the datafiles on the globals create a building and upgrade manager to manage active upgrades and the data itself.
class Game {
	constructor() {
		this.elapsedSeconds = 0;
		this.frameTime = 1000 / 60;
	}
	async Init(){
		//Load the datafile configuration. 
		const response = await fetch('./data.json');
		const localDataFile = await response.json();
		this.globalValues = new Globals(localDataFile);

		this.globalValues.cash = 0;
		this.globalValues.enabledBuildings.push("Camp");
		this.CreateInitialHtml();
		const mainClickButton = document.getElementById("Increase");
		mainClickButton.onclick = () => {this.ClickIncrease();};
		return this;
	}
	Run(){
		setInterval(() => {
			this.Update();
			this.Draw();
		}, this.frameTime);		
	}
	Update(){
		this.elapsedSeconds += this.frameTime;
		
		this.globalValues.Update(this.frameTime);
		if (this.elapsedSeconds >= 1000){
			this.elapsedSeconds = 0;
		}
	}
	Draw(){
		this.globalValues.Display();
	}
	CreateInitialHtml () {
		//TODO: Am still a little sketch on building the elements like this.
		let table = document.getElementById("BuildingTable");
	
		this.globalValues.buildingTypes.forEach((buildingType) => {
			let tableRow = HtmlElementFactory.CreateTableRow("BuildingRow" + buildingType.name);
			let buildingTypeName = HtmlElementFactory.CreateTableColumn(buildingType.name);
			let buildingCount = HtmlElementFactory.CreateTableColumn("0");
			buildingCount.classList.add("BuildingCount");
			let buildingValue = HtmlElementFactory.CreateTableColumn("0");
			buildingValue.classList.add("BuildingValue");
			let buildingCost = HtmlElementFactory.CreateTableColumn("0");
			buildingCost.classList.add("BuildingCost");
			let buildingButton = HtmlElementFactory.CreateButton("buy" + buildingType.name,"Buy", () => {
				this.BuyBuilding(buildingType.name);
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
	BuyBuilding (buildingTypeName) {
		if (!this.globalValues.enabledBuildings.includes(buildingTypeName)){
			return;
		}	
	
		let building = this.globalValues.buildingCounts.getByName(buildingTypeName);
		let buildingType = this.globalValues.buildingTypes.getByName(buildingTypeName);
		let amountOfBuildings = building.count;
		//TODO: Need to fix this buy centralizing how to fetch cost 
		let costMultiplier = parseFloat((amountOfBuildings + 1) * building.costMultiplier);
		let cost = buildingType.cost;
		debugger;
		let checkIfCanBuy = this.globalValues.cash >= cost * costMultiplier;
		if (checkIfCanBuy)
		{
			this.globalValues.cash -= cost * costMultiplier;
			building.count++;
		}
		else{
			console.log("Not enough cash to buy " + buildingType.name);
		}
	}
	BuyUpgrade (upgradeName) {
		let upgrade = null;
		switch(upgradeName){
			case "ClickUpgrade": {
				upgrade = new ClickUpgrade(); 
				break;
			}
			case "BuildingUpgrade": {
				upgrade = new BuildingUpgrade();
				break;
			}
		}
		if (this.globalValues.cash >= upgrade.cost) {
			this.globalValues.cash -= upgrade.cost;
			this.upgradeManager.BuyUpgrade(upgrade);
		} else {
			console.log("Not enough cash to buy " + upgradeName);
		}
	}
	LoadGame (file) {
		let save = new Save(file);
		save.Load();
	}
}

let game = new Game();
await game.Init();
game.Run();



