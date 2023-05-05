// Initialize markers array

langEN = {
	"title_question" : "Do you remember any grocery stores that closed in Trondheim ?",
	"title_instructions" : "Click on the map where you think a grocery stores was located but has since closed. A new page will open and all you have to do is press the \"send\" button. You can then return to this page if you think of other stores.",
	"dispData" : "See what others have proposed",
};

langNO = {
	"title_question" : "Husker du noen dagligvarebutikker som stengte i Trondheim?",
	"title_instructions" : "Klikk på kartet der du tror en dagligvarebutikk lå, men som siden har stengt. En ny side åpnes, og alt du trenger å gjøre er å trykke på \"send\"-knappen. Du kan deretter gå tilbake til denne siden hvis du kommer på andre butikker.",
	"dispData" : "Se hva andre har foreslått",
};

var language = 'en';
var lang = langEN;

var formID = "1FAIpQLSem_9tSoQNv_OKkDIAjmCAYctFxjrupPbed5LQ830AO6RRxyw"
var formlatID = "702141779"
var formlngID = "933478607"
var formtypeID = "204126937"
var formdateID = "559537287"
var formdescriptionID = "1426942264"

var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxZqyHH7C4M_LySMtWv4Roa-snTqvFwFz88BRA_1a2Zw1ELV9RAewRB23NR5ZR0FlaIU2teaNL1L4C/pub?output=csv';

var shopIcon = L.icon({
	iconUrl: 'img/shopIcon.png',
	size: [40,40],
	iconAnchor: [20,20]
});

var data = []
var markers = [];


const map = L.map('map').setView([63.42, 10.43], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors',
	maxZoom: 19
}).addTo(map);


// Change the language of the page
function setLanguage(lg) {
	if (lg == 'en') {
		lang = langEN;
		language = 'en';
	}
	if (lg == 'no') {
		lang = langNO;
		language = 'no';
	}
	$("#title_question").text(lang.title_question);
	$("#title_instructions").text(lang.title_instructions);
	$("#displayAllData").text(lang.dispData);
}

// Download the Google Sheet with the surveys responses
function DLGoogleSheet() {
	Papa.parse(public_spreadsheet_url, {
		download: true,
		header: true,
		complete: showInfo
	})
  }
 
function showInfo(results) {
	data = results.data
}

function displayAllData (data) {
	// Extract data from object
	for (d of data) {
		var lat = parseFloat(d["Latitude (do not change)"]);
		var lng = parseFloat(d["Longitude (do not change)"]);
		var closingDate = d["Closing date"];
		var storeType = d["Store type"];

		// Create marker and set its position
		const marker = L.marker([lat, lng], {icon: shopIcon});

		// Set marker title and description
	if (storeType.startsWith("specialised")) {
		storeType = "Specialised in" + storeType.slice(12);		
	}
	marker.bindPopup("<b>Closing Date:</b> " + closingDate + "<br><b>Store Type:</b> " + storeType);
	marker.on('mouseover', function (e) {
		this.openPopup();
	});
	marker.on('mouseout', function (e) {
		this.closePopup();
	});
		// Add marker to the map
		marker.addTo(map);
	}
}

// Add new markers to the map and open google form
function onMapClick(e) {
	lat = e.latlng.lat;
	lng = e.latlng.lng;
	// var popup = document.getElementById("formdiv").innerHTML;
	if (language == 'en') {
		var popup = L.popup({content:'<div id="formdiv"><div class="form-group"><div class="form-group"><label for="storeType">What kind of store was it ?<br></label><label class="form-radio"><input type="radio" id="supermarket" name="storeType" value="supermarket" checked="checked" onclick="UpdateSpecialised(true)"></input>Supermarket<br></label><label class="form-radio"><input type="radio" id="kiosk" name="storeType" value="kiosk" onclick="UpdateSpecialised(true)"></input>Kiosk<br></label><label class="form-radio"><input type="radio" id="specialised" name="storeType" value="specialised" onclick="UpdateSpecialised(false)"></input>Specialised : <input type="text" name="storeType" placeholder="type of products sold" id="specialisedInput" disabled="true"/> <br><br></label><label for="date">In what year did this store close ?</label><input class="form-control" name="dateInput" id="dateInput" placeholder="(optionnal)"></input><br><br><label for="description">Short description of the store</label><textarea class="form-control" name="descriptionInput" id="descriptionInput" placeholder="(optionnal)"></textarea></div><em class="text-muted">Click submit to add a store at this location.</em><div id="formHelp"></div><hr /><button type="button" id="SubmitButton" onclick="OpenForm();">Add a store</button></div></div>', closeButton:true});
	}
	if (language == 'no') {
		var popup = L.popup({content:'<div id="formdiv"><div class="form-group"><div class="form-group"><label for="storeType">Hva slags butikk var det?<br></label><label class="form-radio"><input type="radio" id="supermarket" name="storeType" value="supermarket" checked="checked" onclick="UpdateSpecialised(true)"></input>Supermarked<br></label><label class="form-radio"><input type="radio" id="kiosk" name="storeType" value="kiosk" onclick="UpdateSpecialised(true)"></input>Kiosk<br></label><label class="form-radio"><input type="radio" id="specialised" name="storeType" value="specialised" onclick="UpdateSpecialised(false)"></input>Spesialisert: <input type="text" name="storeType" placeholder="type av produkter solgt" id="specialisedInput" disabled="true"/> <br><br></label><label for="date">I hvilket år stengte denne butikken ?</label><input class="form-control" name="dateInput" id="dateInput" placeholder="(valgfritt)"></input><br><br><label for="description">Kort beskrivelse av butikken</label><textarea class="form-control" name="descriptionInput" id="descriptionInput" placeholder="(valgfritt)"></textarea> </div><em class="text-muted">Klikk på send for å legge til en butikk på dette stedet.</em><div id="formHelp"></div><hr /><button type="button" id="SubmitButton" onclick="OpenForm();">Legg til en butikk</button></div></div>', closeButton:true});
	}
	//Add marker visually on the map and open a popup
	marker = L.marker(e.latlng).addTo(map).bindPopup(popup);

    setTimeout(function() {
		marker.openPopup();
    }, 100);
	
	// Remove the marker when the popup is closed
	marker.on('popupclose', function() {
		map.removeLayer(marker);
		setTimeout(function() {
			for (m of markers) {	
				m.addTo(map);
			};
		},0);
	});
};


function OpenForm() {
	let date = document.querySelector('#dateInput').value;
	if (date == "") {
		date = "unknow";
	};
	
	let type = document.querySelector('input[name="storeType"]:checked').value;	
	if (type == "specialised") {
		type = type + ": " + document.getElementById("specialisedInput").value;
	};
	
	let description = document.querySelector('#descriptionInput').value;
	
	var link = "https://docs.google.com/forms/d/e/" + formID + "/formResponse?usp=pp_url&entry." + formlatID + "=" + lat + "&entry." + formlngID + "=" + lng + "&entry." + formdateID + "=" + date + "&entry." + formtypeID + "=" + type + "&entry." + formdescriptionID + "=" + description + "&submit=Submit";
	window.open(link);
	
	markers.push(marker);
	
	document.getElementById("displayAllData").style.display = "inline";
}

function UpdateSpecialised(disabled) {
	document.getElementById("specialisedInput").disabled = disabled;
	if (disabled) {
		document.getElementById("specialisedInput").value = "";
	};
};

DLGoogleSheet();

map.on('click', onMapClick);
