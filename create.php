<!DOCTYPE html>
<html lang="en">

	<head>
		<meta charset="utf-8" />
		<title>Goddard | Create</title>
		<link rel="stylesheet" type="text/css" href="/assets/css/master.css" />
		<!--[if lt IE 9 ]> 
			<link rel="stylesheet" type="text/css" href="/assets/css/ie.css" />
		<![endif]-->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.js"></script>
		<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyADVGUeoLZJz5Fc0sCdDGWKPk4bFPjc9Ao&sensor=false&libraries=geometry"></script>
	</head>

	<body class="content row">

		<section class="medium-12 columns">
			<h2>Create a new Quiz</h2>
			<p>Create your own collection by using the form. Pan/zoom the map to set the starting view and zoom. Click on the map to select a new target.</p>
			<p>You can add up to 10 locations in a single quiz.</p>
		</section>

		<div class="large-12 columns">
			<form action="#" method="post" id="targetform">
				<input type="hidden" id="code" value="" />
				<p>Question <span id="curr">1</span> of <span id="total">1</span></p>
				<section class="large-6 columns">
					<label for="">Title
						<input type="text" id="title" />
					</label>
					<label for="">Name
						<input type="text" id="name" />
					</label>
					<label for="">Allow Pan
						<input type="checkbox" checked id="allow_pan" />
					</label>
					<label for="">Allow Zoom
						<input type="checkbox" checked id="allow_zoom" />
					</label>
					<label for="">Max Zoom:
						<input type="range" value="7" max="14" min="0" id="max_zoom" />
					</label>
					<fieldset disabled>
						<legend>Map Centre</legend>
						<label for="">Lat
							<input type="text" value="0" id="centre_lat" />
						</label>
						<label for="">Lng
							<input type="text" value="0" id="centre_lng" />
						</label>
					</fieldset>
					<fieldset disabled>
						<legend>Target</legend>
						<label for="">Lat
							<input type="text" id="target_lat" />
						</label>
						<label for="">Lng
							<input type="text" id="target_lng" />
						</label>
					</fieldset>
					<button class="nav" id="backward" disabled>&laquo;</button>
					<button class="nav" id="forward">&raquo;</button>
					<input type="submit" value="Save" class="button">
				</section>

				<section class="large-6 columns">
					<div id="map">
						<p class="nomap"></p>
					</div>
					<p>Zoom Level: <span id="zoom_level">4</span></p>
				</section>

			</form>
		</div>

	</body>
	
	<script src="/assets/js/fns.js"></script>
	<script src="/assets/js/create.js"></script>


</html>