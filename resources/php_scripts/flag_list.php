<?php

	include_once("getValues.php");
	include_once("conn.php");
	$conn=Core::getInstance()->dbh;

	$valueGetter = new _valueGetter("flag", $conn);

	$flags = json_decode($valueGetter->getJSON(),true);

	if(!isset($flagMode) or $flagMode == "is-form"){
		$flagPrefix="flag_";
	}
	else{
		$flagPrefix="filterFlag_";
	}

	echo "<ul class='flag_wrapper'>";

	foreach ($flags as $key => $flag) {
		echo "<li>";
		echo "<input type='checkbox' id='".$flagPrefix.$flag["name"]."' class='single_flag flag_".$flag["name"]."' data-flag='".$flag["id"]."'>";
		echo "<label for='".$flagPrefix.$flag["name"]."'>".ucwords($flag["name"])."</label>";
		echo "</li>";
	}
	echo "</ul>";

?>