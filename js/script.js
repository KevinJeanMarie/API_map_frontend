
var MAP_API = {

	AVIATION_API_URL: "https://nicolaspigelet.com/airports.json",

	map: null,
	airports: null,
	icon: null,
	markers: [],

	initMap: function () {

		this.buildMap();
		this.fetchData();
	},

	buildMap: function () {

		this.icon = {
			url: "./img/plane.svg",
			anchor: new google.maps.Point(10, 20),
			scaledSize: new google.maps.Size(20, 20)
		};

		// initialiser la google map
		var paris = {
			lat: 48.8534,
			lng: 2.3488
		};

		this.map = new google.maps.Map(document.getElementById("map"), {
			zoom: 5,
			center: paris
		});
	},

	fetchData: function () {

		var self = this;

		var initObject = {
			method: 'GET',
			mode: 'cors',
			headers: new Headers()
		};

		fetch(this.AVIATION_API_URL, initObject)
			.then(function (response) {
				return response.json()
			})
			.then(function (list_airports) {

				self.cleanList();
				self.cleanMap();

				self.airports = list_airports.data;

				self.airports.forEach(function (airport, index) {

					self.appendElementToList(airport);
					self.drawAirportOnMap(self.map, airport);

				});

			});

	},

	fetchRequest: function (POST, requestBody) {

		var self = this;

		var initObject = {
			method: POST,
			mode: 'cors',
			headers: new Headers(),
			body: JSON.stringify(requestBody)
		};

		fetch(self.AVIATION_API_URL, initObject)
			.then(function (response) {
				return response.json();
			})
			.then(function (response) {

				console.log(response);

			});
	},

	appendElementToList: function (airport) {

		var li = document.createElement("LI");

		var a = document.createElement("A");
		a.setAttribute('data-id', airport.airport_id);
		a.setAttribute('data-lat', airport.latitude);
		a.setAttribute('data-lng', airport.longitude);

		var airport_name = document.createTextNode(airport.airport_name);
		a.appendChild(airport_name);

		var btnDelete = document.createElement("A");
		btnDelete.setAttribute('data-id', airport.airport_id);
		btnDelete.classList.add('btn-delete');

		var iconDelete = document.createTextNode("x");
		btnDelete.appendChild(iconDelete);

		li.appendChild(a);
		// li.appendChild(btnDelete);

		var self = this;
		a.addEventListener('click', function (event) {
			event.preventDefault();
			event.stopPropagation();

			// TODO Afficher la modal 
			document.querySelector(".modal").classList.remove('visible');
			document.querySelector(".modal").classList.add('visible');

			//fermer la modal 
			console.log("btn-close");

			var modal = document.getElementsByClassName("btn-close");

			modal.onclick = function () {
				modal.style.display = "none";
			}

			window.onclick = function (event) {
				if (event.target == modal) {
					modal.style.display = "none";
				}
			}

			// mode = 'update'
			var id = event.target.dataset.id

			self.map.panTo({
				lat: parseFloat(event.target.dataset.lat),
				lng: parseFloat(event.target.dataset.lng)
			});

		});

		btnDelete.addEventListener('click', function (event) {
			event.preventDefault();

			// TODO faire la requete pour supprimer l'aeroport
			// mode = 'delete'
			// id = event.target.dataset.id

		});

		document.getElementById("airports-list").appendChild(li);

	},

	drawAirportOnMap: function (map, airport) {

		var self = this;

		var marker = new google.maps.Marker({
			map: map,
			position: {
				lat: parseFloat(airport.latitude),
				lng: parseFloat(airport.longitude)
			},
			airport_id: airport.airport_id,
			icon: self.icon
		});

		// TODO au click sur un marker ouvrir la modal

		// mode = 'update'
		// id = marker.get('airport_id')


		self.markers.push(marker);
	},

	cleanList: function () {

		document.getElementById("airports-list").innerHTML = "";
	},

	cleanMap: function () {

		if (this.markers.length == 0) return;

		this.markers.forEach(function (marker) {
			marker.setMap(null);
		});

		this.markers = [];
	}
}
