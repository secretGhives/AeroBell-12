<?php

$config['icao']       = $_GET['icao']; // url of html to grab
$location = $_GET['icao'];
get_taf($location);

function get_taf($location) {
$fileName = "ftp://tgftp.nws.noaa.gov/data/forecasts/taf/stations/$location.TXT";
	$taf = '';
	$fileData = @file($fileName) or die('TAF not available');
	if ($fileData != false) {
		list($i, $date) = each($fileData);

		$utc = strtotime(trim($date));
		$time = date("D, F jS Y g:i A",$utc);

		while (list($i, $line) = each($fileData)) {
			$taf .= ' ' . trim($line);
			}
		$taf = trim(str_replace('  ', ' ', $taf));
		}
	//echo "TAF FOR $loc (Issued: $time UTC):<br>$taf";
	echo "$taf";
	}

?>