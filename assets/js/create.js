var map,
		mk,
		current = 0,
		total = 1,
		data = [];

$(document).ready(function() {

	var coordDiv = document.createElement('div');
	coordDiv.className = 'mapControl';
	coordDiv.id = 'mapCoords';
	
	// if the google maps library can't be loaded, show an error message
	window.google || $('.nomap').text('If you can read this, Google Maps hasn\'t loaded :-(');

	// set up a map object
	var mapElement = document.getElementById('map'),
			centre = new google.maps.LatLng(0, 0),
			mapOptions = {
				disableDefaultUI: true,
				zoom: 4,
				mapTypeControl: false,
				center: centre
			};
	map = new google.maps.Map(mapElement, mapOptions);
	map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(coordDiv);
	
	// add listener for map pan, and record the centre coords
	google.maps.event.addListener(map, 'center_changed', function() {
		var centre = map.getCenter();
		$('#centre_lat').val(centre.lat());
		$('#centre_lng').val(centre.lng());
	})

	// add listener for zoom event, and capture zoom level
	google.maps.event.addListener(map, 'zoom_changed', function() {
		$('#zoom_level').text(map.getZoom());
	})

	// add listener for a click event, and capture the position
	google.maps.event.addListener(map, 'click', function(e) {
		
		var	target = e.latLng;
		coordDiv.innerHTML = __('Lat: %s<br />Lng: %s', [e.latLng.lat().toFixed(4), e.latLng.lng().toFixed(4)]);
		$('#target_lat').val(target.lat());
		$('#target_lng').val(target.lng());
		if (mk === undefined) {
			mk = new google.maps.Marker({
				map: map,
				position: target
			})
		} else {
			mk.setPosition(target);
		}


	})

	// create a new unique ID and add it to the form
	document.getElementById('code').value = createUniqueId();

	// handler for back and forward buttons
	$('.nav').on('click', function(e) {

		// stop the button triggering a form submit
		e.preventDefault();

		var dir = $(this).attr('id');
		if (dir == 'forward') {
			saveFields();
			current++;
			if (current > total) {
				total = current;
			}
		} else if (dir == 'backward') {
			getFields();
			current--;
		}

		updateCounts();

	})

	function updateCounts() {

		$('#curr').text(current + 1);
		$('#total').text(total + 1);
		
		$('#backward').prop('disabled', (current == 0));
		$('#forward').prop('disabled', (current == 9));
	}

	function saveFields() {

		if (data[current - 1] === undefined) {

			// no data for this question yet, so add it
			data[current - 1] = {
				title: document.getElementById('title').value,
				id: current + 1,
				name: document.getElementById('name').value,
				options: {
					allowZoom: document.getElementById('allow_zoom').value,
					allowPan: document.getElementById('allow_pan').value,
					maxZoom: document.getElementById('max_zoom').value,
				},
				center: {
					lat: document.getElementById('centre_lat').value,
					lng: document.getElementById('centre_lng').value,
					zoom: document.getElementById('zoom_level').value,
				},
				target: {
					lat: document.getElementById('centre_lat').value,
					lng: document.getElementById('centre_lng').value,
				}
			}
			console.log('save', current);
			document.getElementById('targetform').reset();

		} else {

			getFields();

		}

	}

	function getFields() {

		console.log('get', current);
		$('#title').val(data[current - 1]['title']);

	}

	function createUniqueId() {

		var pass = '',
				len = 8,
				possible = 'ABCDEFGHJKLMNPQRTWXYZ2346789';

		for (var x = 0; x < len; x++) {
			pass = pass + possible[Math.floor(Math.random()*possible.length)];
		}

		return pass;

	}

})