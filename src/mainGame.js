import { HtmlElementFactory } from "./HtmlElementFactory.js";


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

class GlobalManager {
	constructor(){
		this.cash = 0;
		this.clickMultiplier = 1;
	}
	Update(gameTime){

	}
	Increase(cash){
		this.cash += cash;
	}
	Click(){
		this.cash += this.clickMultiplier;
	}
	Decrease(amount){
		this.cash -= amount;
	}
	CanAfford(amount){
		return this.cash > amount;
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
	Update(gameTime){

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

//TODO:instead of constructor maybe create a separate create/init method so that we can build from a "saved" or serialized instance perahps.
class BuildingInstance {
	constructor(buildingDefinition){
		this.name = buildingDefinition.name;
		this.count = 0;
		this.costMultiplier = buildingDefinition.costMultiplier;
		this.multiplier = 1;
	}
	CalculateIncrease(){
		return parseFloat(this.multiplier * this.count);
	}
	IncreaseBuilding(amount = 1){
		this.count += amount;
	}
	NextIncrementCost(){
		return parseFloat((this.count + 1) * this.costMultiplier);
	}
}

class BuildingUpgrade {
    constructor() {
        this.name = "BuildingUpgrade";
        this.cost = 1000; // Set the cost of the upgrade
        this.multiplier = 2; // Set the multiplier of the upgrade
    }
}

class BuildingManager {
	constructor(dataFileBuildings){
		this.buildingTypes = dataFileBuildings.map(x => new BuildingType(x));;
		this.buildingInstances = this.buildingTypes.map(x => new BuildingInstance(x));
		this.enabledBuildings = [];
		this.enabledBuildings.push("Camp");
	}
	GetDefinitionByName(nameParam){
		return this.buildingTypes.find(x => x.name == nameParam);
	}
	GetInstanceByName(nameParam){
		return this.buildingInstances.find(x => x.name == nameParam);
	}
	//private check enabled. I want the element stuff out of here. 
	#CheckEnabled(){
		this.buildingTypes.forEach((buildingType, index) => {
			let previousBuildingType = this.buildingTypes[index - 1];
			if (previousBuildingType !== undefined){
				let previousBuildingInstance  = this.buildingInstances.find(x => x.name == previousBuildingType.name);
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
						console.log("Something went wrong when trying to check an enabled building.")
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
	GetIncreaseAmount(){
		let increaseAmount = 0;
		
		this.buildingInstances.forEach((buildingInstance) => {
			increaseAmount += buildingInstance.CalculateIncrease();
		});
		return increaseAmount;
	}
	CostToIncrement(buildingTypeName){
		let building = this.GetInstanceByName(buildingTypeName);
		return building.NextIncrementCost();
	}
	Update(gameTime){
		this.#CheckEnabled();
	}
	IsBuildingTypeEnabled(buildingType){
		return this.enabledBuildings.find(x => x == buildingType) == buildingType;
	}
	CanBuyBuilding(name){
		return name != "" && name != null && this.IsBuildingTypeEnabled(name);
	}
	AddBuildingInstance(name){
		if (!this.CanBuyBuilding(name)){
			throw Exception("Invalid building type");
		}
		
		this.GetInstanceByName(name).IncreaseBuilding();
	}
}

class UIManager
{
	constructor(){

	}
	Init(BuildingManager){
		this.GenerateBuildingsTable(BuildingManager);
	}
	GenerateBuildingsTable(BuildingManager){
		//TODO:Still sketched tf out. Maybe react or some shit?
		//TODO:Binding an event an issue. 
		let table = document.getElementById("BuildingTable");
	
		BuildingManager.buildingTypes.forEach((buildingType) => {
			let tableRow = HtmlElementFactory.CreateTableRow("BuildingRow" + buildingType.name);
			let buildingTypeName = HtmlElementFactory.CreateTableColumn(buildingType.name);
			let buildingCount = HtmlElementFactory.CreateTableColumn("0");
			buildingCount.classList.add("BuildingCount");
			let buildingValue = HtmlElementFactory.CreateTableColumn("0");
			buildingValue.classList.add("BuildingValue");
			let buildingCost = HtmlElementFactory.CreateTableColumn("0");
			buildingCost.classList.add("BuildingCost");
			let buildingButton = HtmlElementFactory.CreateButton("buy" + buildingType.name,"Buy", () => {
				debugger;
				BuildingManager.BuyBuilding(buildingType.name);
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
	DrawScoreSection(GlobalManager){
		let cashDisplay = document.getElementById("Gold");
		cashDisplay.innerHTML = GlobalManager.cash.toFixed(2);
	}
	DrawBuildingTable(BuildingManager){
		let table = document.getElementById("BuildingTable");
		BuildingManager.buildingTypes.forEach((buildingType) => {
			let buildingRow = table.querySelector("#BuildingRow" + buildingType.name);
			let buildingInstance = BuildingManager.GetInstanceByName(buildingType.name);

			let buildingCount = buildingRow.querySelector(".BuildingCount");
			buildingCount.innerHTML = buildingInstance.count;
			let buildingValue = buildingRow.querySelector(".BuildingValue");
			buildingValue.innerHTML = buildingInstance.multiplier * buildingInstance.count;
			let buildingCost = buildingRow.querySelector(".BuildingCost");
			buildingCost.innerHTML = parseFloat(buildingType.cost) * (buildingInstance.count + 1) * buildingInstance.costMultiplier;
		});
	}
	Draw(BuildingManager, GlobalManager){
		this.DrawScoreSection(GlobalManager);
		this.DrawBuildingTable(BuildingManager);
	}
} 

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

		this.BuildingManager = new BuildingManager(localDataFile.Buildings);
		this.GlobalManager = new GlobalManager();
		this.UpgradeManager = new UpgradeManager();
		this.UIManager = new UIManager();

		this.UIManager.Init(this.BuildingManager);
		const mainClickButton = document.getElementById("Increase");
		mainClickButton.onclick = () => {this.GlobalManager.Click()};
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

		this.BuildingManager.Update(this.elapsedSeconds);
		
		let increaseAmount = this.BuildingManager.GetIncreaseAmount();
		this.GlobalManager.Increase(increaseAmount / this.frameTime);
		
		if (this.elapsedSeconds >= 1000){
			this.elapsedSeconds = 0;
		}
	}
	Draw(){
		this.UIManager.Draw(this.BuildingManager, this.GlobalManager);
		
	}
	ClickIncrease() {
		this.GlobalManager.Click();
	}
	BuyBuilding (buildingTypeName) {
		let buildingCost = this.BuildingManager.CostToIncrement(buildingTypeName);
		let canBuybuilding = this.BuildingManager.CanBuyBuilding(buildingTypeName);
		debugger;
		if (canBuybuilding && this.GlobalManager.CanAfford(buildingCost)){
			this.BuildingManager.AddBuildingInstance(buildingTypeName);
			return;
		}	
		console.log("Can't afford building");
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



