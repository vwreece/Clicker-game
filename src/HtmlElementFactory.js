export class HtmlElementFactory {
	static CreateButton(id, text, onClick) {
		let button = document.createElement("button");
		button.id = id;
		button.innerHTML = text;
		button.onclick = onClick;
		return button;
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
