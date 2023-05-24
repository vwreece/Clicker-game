function globals() {
	this.cash = 1;
};

function camp() {
	this.name = "";
	this.multiplier = 1;
	this.costMultiplier = 1.1;
	this.cost = 1;
};

function hamlet(){
	this.name = "Hamlet";
};

hamlet.prototype = {
	cost : 100,
	multiplier : 2,
	costMultiplier : 3
};

//buildings

var camps = new Array();
var hamlets = new Array();
var globalValues = new globals();

camp.prototype.IncreaseCash = function(cash) {
	globals.cash+= multiplier;
};

globals.prototype.Update = function(){
	var cashDisplay = document.getElementById("Gold");
	cashDisplay.innerHTML = this.cash;
};

//This is the main function for the clicker itself that will increse the variable for the pointer clicker
var Increase = function(){
	globalValues.cash++;
	globalValues.Update();
};

var BuyCamp = function(){
	if (this.enabled === false)
		return;
	camps.push(new camp());
	globalValues.cash -= (camps.length * 1.1);
};

var BuyHamlet = function(){
	console.log(this.enabled);
	if (this.enabled === false)
		return;
	hamlets.push(new hamlet());
	globalValues.cash -= (hamlet.prototype.cost + hamlets.length * hamlet.prototype.costMultiplier);

};

var init = function(){
	var buttonCampAdd = document.getElementById("buyCamp");
	buttonCampAdd.onclick = BuyCamp;
	var buttonHamletAdd = document.getElementById("buyHamlet");
	buttonHamletAdd.onclick = BuyHamlet;
};

//Main update loop
var UpdateLoop = function(){
	var buttonCampAdd = document.getElementById("buyCamp");
	var buttonHamletAdd = document.getElementById("buyHamlet");
	if (globalValues.cash - (hamlet.prototype.cost + hamlets.length * hamlet.prototype.cost) < 0){
		buttonHamletAdd.enabled = false;
	}
	else{
		buttonHamletAdd.enabled = true;
	}
	if (globalValues.cash - (camps.length * 1.1) < 0
		){
		buttonCampAdd.enabled = false;
	}
	else {
		buttonCampAdd.enabled = true;
	}
	globalValues.cash += camps.length;
	globalValues.cash += hamlets.length > 0 ? hamlets.length * hamlet.prototype.multiplier : 0;
	console.log(hamlets.length);
	globalValues.Update();
};

setInterval(function() {
	UpdateLoop();
}, 1000);

init();