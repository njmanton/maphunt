<?php

$fn = sprintf('./%s.json', $_POST['name']);

$json = json_decode(file_get_contents($fn));
$json[] = ($_POST['guess']);

if (file_put_contents($fn, json_encode($json, JSON_PRETTY_PRINT)) !== false) {

	echo json_encode(count($json));

} else {

	echo json_encode(false);

}
	



?>