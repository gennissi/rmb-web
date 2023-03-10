/*
 * Google layer using Google Maps API
 */

/* global google: true */

L.Google = L.Layer.extend({
	includes: L.Mixin.Events,

	options: {
		minZoom: 0,
		maxZoom: 18,
		tileSize: 256,
		subdomains: 'abc',
		errorTileUrl: '',
		attribution: '',
		opacity: 1,
		continuousWorld: false,
		noWrap: false,
		mapOptions: {
			backgroundColor: '#dddddd'
		}
	},

	// Possible types: SATELLITE, ROADMAP, HYBRID, TERRAIN
	initialize: function (type, options) {
		var _this = this;

		this._ready = L.Google.isGoogleMapsReady();

		L.Util.setOptions(this, options);

		this._googleApiPromise = this._ready ? Promise.resolve(window.google) : L.Google.createGoogleApiPromise();

		this._googleApiPromise
		.then(function () {
			_this._ready = true;
			_this._initMapObject();
			_this._update();
		});

		this._type = type || 'SATELLITE';
	},

	onAdd: function (map, insertAtTheBottom) {
		var _this = this;
		this._googleApiPromise
		.then(function () {
			_this._map = map;
			_this._insertAtTheBottom = insertAtTheBottom;

			// create a container div for tiles
			_this._initContainer();
			_this._initMapObject();

			// set up events
			map.on('viewreset', _this._reset, _this);

			_this._limitedUpdate = L.Util.throttle(_this._update, 150, _this);
			map.on('move', _this._update, _this);

			map.on('zoomanim', _this._handleZoomAnim, _this);

			// 20px instead of 1em to avoid a slight overlap with google's attribution
			map._controlCorners.bottomright.style.marginBottom = '20px';

			_this._reset();
			_this._update();
		});
	},

	onRemove: function (map) {
		map._container.removeChild(this._container);

		map.off('viewreset', this._reset, this);

		map.off('move', this._update, this);

		map.off('zoomanim', this._handleZoomAnim, this);

		map._controlCorners.bottomright.style.marginBottom = '0em';
	},

	getAttribution: function () {
		return this.options.attribution;
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		if (opacity < 1) {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	setElementSize: function (e, size) {
		e.style.width = size.x + 'px';
		e.style.height = size.y + 'px';
	},

	_initContainer: function () {
		var tilePane = this._map._container,
			first = tilePane.firstChild;

		if (!this._container) {
			this._container = L.DomUtil.create('div', 'leaflet-google-layer');
			this._container.id = '_GMapContainer_' + L.Util.stamp(this);
			this._container.style.zIndex = 'auto';
		}

		tilePane.insertBefore(this._container, first);

		this.setOpacity(this.options.opacity);
		this.setElementSize(this._container, this._map.getSize());
	},

	_initMapObject: function () {
		if (!this._ready || !this._container) return;
		this._google_center = new google.maps.LatLng(0, 0);
		var map = new google.maps.Map(this._container, {
			center: this._google_center,
			zoom: 0,
			tilt: 0,
			mapTypeId: google.maps.MapTypeId[this._type],
			disableDefaultUI: true,
			keyboardShortcuts: false,
			draggable: false,
			disableDoubleClickZoom: true,
			scrollwheel: false,
			streetViewControl: false,
			styles: this.options.mapOptions.styles,
			backgroundColor: this.options.mapOptions.backgroundColor
		});
		
		var _this = this;
		this._reposition = google.maps.event.addListenerOnce(map, 'center_changed',
			function () { _this.onReposition(); });
		this._google = map;
		
		if (gsValues['map_traffic'] == true)
		{
			var traffic_layer = new google.maps.TrafficLayer();
			traffic_layer.setMap(map);
		}
		
		google.maps.event.addListener(map, 'rightclick',
			function() { this._map.fire('contextmenu'); });
		google.maps.event.addListenerOnce(map, 'idle',
			function () { _this._checkZoomLevels(); });
		google.maps.event.addListenerOnce(map, 'tilesloaded',
			function () { _this.fire('load'); });
		// Reporting that map-object was initialized.
		this.fire('MapObjectInitialized', {mapObject: map});		
		
		//// maroc
		//if (google.maps.MapTypeId[this._type] == 'roadmap')
		//{
		//	mapStyles = [{featureType: "administrative.country", stylers: [{ visibility: "off" }]}],
		//	mapType = new google.maps.StyledMapType(mapStyles , {name: "Maroc"});
		//	map.mapTypes.set('maroc', mapType );
		//	map.setMapTypeId('maroc');
		//	
		//	layer = new google.maps.FusionTablesLayer({
		//		query: {
		//		    select: 'geometry',
		//		    from: '1S4aLkBE5u_WS0WMVSchhBgMLdAARuPEjyW4rs20',
		//		    where: "col1 contains 'MAR'"
		//		},
		//		styles: [{
		//		    polylineOptions: {
		//			strokeColor: "#333333",
		//			strokeWeight: 1
		//		    },
		//		}],
		//		suppressInfoWindows: true,
		//	});
		//	layer.setMap(map);	
		//}
	},

	_checkZoomLevels: function () {
		//setting the zoom level on the Google map may result in a different zoom level than the one requested
		//(it won't go beyond the level for which they have data).
		// verify and make sure the zoom levels on both Leaflet and Google maps are consistent
		if ((this._map.getZoom() !== undefined) && (this._google.getZoom() !== Math.round(this._map.getZoom()))) {
			//zoom levels are out of sync. Set the leaflet zoom level to match the google one
			this._map.setZoom(this._google.getZoom());
		}
	},

	_reset: function () {
		this._initContainer();
	},

	_update: function () {
		if (!this._google) return;
		this._resize();

		var center = this._map.getCenter();
		var _center = new google.maps.LatLng(center.lat, center.lng);

		this._google.setCenter(_center);
		if (this._map.getZoom() !== undefined)
			this._google.setZoom(Math.round(this._map.getZoom()));

		this._checkZoomLevels();
	},

	_resize: function () {
		var size = this._map.getSize();
		if (this._container.style.width === size.x &&
				this._container.style.height === size.y)
			return;
		this.setElementSize(this._container, size);
		this.onReposition();
	},


	_handleZoomAnim: function (e) {
		var center = e.center;
		var _center = new google.maps.LatLng(center.lat, center.lng);

		this._google.setCenter(_center);
		this._google.setZoom(Math.round(e.zoom));
	},


	onReposition: function () {
		if (!this._google) return;
		google.maps.event.trigger(this._google, 'resize');
	}
});

L.Google.isGoogleMapsReady = function () {
	return !!window.google && !!window.google.maps && !!window.google.maps.Map;
};

// backwards compat
L.Google.asyncInitialize = L.Google.isGoogleMapsReady;

L.Google.maxApiChecks = 10;

L.Google.apiCheckIntervalMilliSecs = 500;

L.Google.createGoogleApiPromise = function () {
	var checkCounter = 0;
	var intervalId = null;

	return new Promise(function (resolve, reject) {
		intervalId = setInterval(function () {
			if (checkCounter >= L.Google.maxApiChecks && !L.Google.isGoogleMapsReady()) {
				clearInterval(intervalId);
				return reject(new Error('window.google not found after max attempts'));
			}
			if (L.Google.isGoogleMapsReady()) {
				clearInterval(intervalId);
				return resolve(window.google);
			}
			checkCounter++;
		}, L.Google.apiCheckIntervalMilliSecs);
	});
};
