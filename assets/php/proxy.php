<?php

$config['icao']       = $_GET['icao']; // url of html to grab

$location = $_GET['icao'];

get_metar($location);

function get_metar($location) {
$fileName = "http://weather.noaa.gov/pub/data/observations/metar/decoded/$location.TXT";
//$fileName = "http://weather.noaa.gov/pub/data/observations/metar/stations/$location.TXT";
	$metar = '';
	$fileData = @file($fileName) or die('METAR not available');
	if ($fileData != false) {
		list($i, $date) = each($fileData);

		$utc = strtotime(trim($date));
		$time = date("D, F jS Y g:i A",$utc);

		while (list($i, $line) = each($fileData)) {
			$metar .= ' ' . trim($line);
			}
		$metar = trim(str_replace('  ', ' ', $metar));
		}
	//echo "METAR FOR $location (Issued: $time UTC):<br>$metar";
	echo "$metar";
	}
?>