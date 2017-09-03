<?php

	include_once("getValues.php");
	include_once("conn.php");
	$conn=Core::getInstance()->dbh;

	$element = isset($element) ? $element : "class";
	$valueGetter = new _valueGetter($element, $conn);

	echo $valueGetter->getSelect();

?>