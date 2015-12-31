var map, 
		mapdata,
		x = 0,
		questions = './test.json',
		mapCount = 0;

var colors = {

}

$(document).ready(function() {

	// if the google maps library can't be loaded, show an error message
	window.google || $('.nomap').text('If you can read this, Google Maps hasn\'t loaded :-(');

	// get the questions file
	$.getJSON(questions, function(data) {

		mapdata = data;
		mapCount = mapdata.length;
		showMap(mapdata[x++], x, mapCount);

	})

	$('#answers').on('click', '#next', function() {

		map = null;
		showMap(mapdata[x++], x, mapCount);
		
	})

	$('#answers').on('click', '#last', function() {
		// show overall results
		alert ('Yay, finished!');
	})

})


/****************************************
showMap
sets up a new map and adds click handler
args: data (JSON maphunt object)
			num (number of map in collection)
			total (total maps in collection)
****************************************/
function showMap(data, num, total) {

	// set up variables
	var centre = new google.maps.LatLng(data.center.lat, data.center.lng),
			target = new google.maps.LatLng(data.target.lat, data.target.lng),
			mapOptions = {
				center: centre,
				zoom: data.center.zoom,
				mapTypeControl: false,
				disableDefaultUI: true,
				draggable: data.options.allowPan,
				scrollwheel: data.options.allowZoom
			},
			mapElement = document.getElementById('map');

	// create a new google map object
	map = new google.maps.Map(mapElement, mapOptions);

	$('#title').show().text(data.title);
	$('#mapcount').show().text(__('Map %s of %s', [num, total]));
	$('#answer').hide();

	// show the hint in the answer pane
	$('#question').show().text(__('Can you place %s on the map?', data.name));
	if (data.options.allowPan) {
		$('#icon-pan').addClass('enabled').removeClass('disabled');
	}
	if (data.options.allowZoom) {
		$('#icon-zoom').addClass('enabled').removeClass('disabled');
	}

	// add a listener for the click event
	google.maps.event.addListener(map, 'click', function(guess) {

		// remove any previous lines
		if (typeof line !== 'undefined') {
			line.setMap(null);
		}

		// use the goemetry library to get a distance
		var distance = google.maps.geometry.spherical.computeDistanceBetween (guess.latLng, target);

		// create a new path between the guess and the target
		var path = [guess.latLng, target];
		var pathOptions = {
			path: path,
			strokeWeight: 3,
			strokeColor: '#ff3355',
			strokeOpactiy: 0.8
		}
		line = new google.maps.Polyline(pathOptions);
		line.setMap(map);

		// remove the listener to stop any further clicks
		google.maps.event.clearListeners(map, 'click');
		// process the guess
		processGuess(data, target, guess, distance);

		if (num === total) {
			$('#answer').append('<button id="last">Finish</button>');
		} else {
			$('#answer').append('<button id="next">Next Map</button>');
		}
	})

}

function processGuess(data, target, guess, distance) {

	saveAnswer(data.title, guess, distance);
	showAnswer(distance);
	getGuesses(data.title, target, guess, distance); 
}

/************************************
storeAnswer
adds a guess to a list of previous
guesses
args: mapName (which map)
			item (the point object)
			distance (between point and target)
************************************/
function saveAnswer(mapName, item, distance) {
	// get the JSON file containing previous guesses
	// if no file create one
	// parse it into an object
	// stringify it and save it back to server

	var newGuess = {
		lat: item.latLng.lat(),
		lng: item.latLng.lng(),
		distance: distance,
		time: Date.now()
	};

	$.ajax({
		url: '/guesses/addGuess.php',
		type: 'POST',
		dataType: 'JSON',
		data: {guess: newGuess, name: mapName}
	}).done(function(e) {

		//console.log(e);

	}).fail(function(e) {

		//console.log('Something went wrong');

	})

}

/****************************************
showAnswer
displays the result in the answer pane
args: d (formatted string showing distance)
			stats ()
****************************************/
function showAnswer(distance, stats) {

	var remark = '', 
			precision = 2, 
			metres = false;

	if (distance <= 100) {
		remark = 'Amazing!';
		precision = 1;
		metres = true;
	} else if (distance <= 500) {
		remark = 'Excellent!';
		precision = 1;
		metres = true;
	} else if (distance <= 1000) {
		remark = 'Well done!';
		metres = true;
		precision = 0;
	} else if (distance <= 2000) {
		remark = 'Not bad.';
		precision = 1;
	} else if (distance <= 5000) {
		remark = 'Almost.';
	} else if (distance <= 10000) {
		remark = 'Hmmm...';
	} else if (distance <= 20000) {
		remark = 'Oops!';
	} else {
		remark = 'Yikes!';
	}

	var distanceText = (metres) ? (distance.toFixed(precision)) + 'm' : (distance / 1000).toFixed(precision) + 'km';

	$('#mapcount, #question').hide();
	$('#answer').show().html(__('<p>%s You were %s away</p><p>That ranks you <span id="rank"></span> out of <span id="allguesses"></span> guesses', [remark, distanceText]));

}

/************************************
getGuesses
load in all previous guesses
args: mapName (which map)
			e (the guess point)
			d (distance for current guess)
************************************/
function getGuesses(mapName, target, guess, distance) {

	var url = __('/guesses/%s.json', mapName),
			distances = [];

	// get all guesses for the map
	$.get(url).done(function(guesses) {

		// lighten the map to highlight guesses
		var styles = [{
			stylers: [
				{ lightness: 20 },
				{ saturation: -60 }
			]
		}];
		map.setOptions({styles: styles});

		var circle = new google.maps.Circle({
			fillColor: '#0f0',
			fillOpacity: '0.3',
			center: target,
			radius: distance,
			strokeWeight: 0
		})
		circle.setMap(map);

		// loop through guesses, creating a new marker for each
		// and adding to an array
		$.each(guesses, function(k, v) {

			var ll = new google.maps.LatLng(v.lat, v.lng);
			var marker = new google.maps.Marker({
				position: ll,
				map: map,
				icon: {
					path: google.maps.SymbolPath.CIRCLE, 
					scale: 2,
					strokeColor: (v.distance > distance) ? '#fa5882' : '#333',
					strokeOpacity: 0.8
				}
			})
			distances.push(Number(v.distance));

		})

		// calculate the percentile for the current guess
		var guessRank = rank(distances, distance),
			j = guessRank[0] % 10,
			k = guessRank[0] % 100,
			suffix = '';

		if (j == 1 && k != 11) {
			suffix = 'st';
		} else if (j == 2 && k != 12) {
			suffix = 'nd';
		} else if (j == 3 && k != 13) {
			suffix = 'rd';
		} else {
			suffix = 'th';
		}

		// show the rank
		$('#rank').text(guessRank + suffix);
		$('#allguesses').text(distances.length);

	}).fail(function(e) {

		console.log (e, "Couldn't get guesses");
	});

}



