export class UIManager 
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
			tableRow.classList.add("BuildingRow");
			let buildingTypeName = HtmlElementFactory.CreateTableColumn(buildingType.name);
			let buildingCount = HtmlElementFactory.CreateTableColumn("0");
			buildingCount.classList.add("BuildingCount");
			let buildingValue = HtmlElementFactory.CreateTableColumn("0");
			buildingValue.classList.add("BuildingValue");
			let buildingCost = HtmlElementFactory.CreateTableColumn("0");
			buildingCost.classList.add("BuildingCost");
			let buildingButton = HtmlElementFactory.CreateButton("buy" + buildingType.name,"Buy");
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
    EnableValidBuildings(enabledBuildings){
		let table = document.getElementById("BuildingTable");
		enabledBuildings.forEach(element => {
			let buildingRow = table.querySelector("#BuildingRow" + element);
			buildingRow.querySelector("#buy" + element).disabled = false;
		});
    }
	Draw(BuildingManager, GlobalManager){
		this.DrawBuildingTable(BuildingManager);
	}
    UpdateInnerHtmlById(elementId, value){
        let element = document.getElementById(elementId);
        element.innerHTML = value;
    }
    UpdateInnerHtmlByElement(element,value){
        element.innerHTML = value;
    }
    BindEvent(element, eventType, event){
        element.addEventListener(eventType, event);
    }
}

class HtmlElementFactory {
	static CreateButton(id, text, onClick) {
		let button = document.createElement("button");
		button.id = id;
		button.innerHTML = text;
		button.onclick = onClick;
		return button;
	}
	static BindClick(id, eventType, event){
		let element = document.getElementById(id);
		element.addEventListener(eventType, event);
	}
	static CreateTableRow(id) {
		let row = document.createElement("tr");
		row.id = id;
		return row;
	}
	static CreateTableColumn(text) {
		let column = document.createElement("td");
		column.innerHTML = text;
		return column;
	}
}
