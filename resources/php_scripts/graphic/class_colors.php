<?php

	header('Content-Type: text/html; charset=utf-8');

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$classColor=array();

	try{
		$SQL="SELECT eng, color FROM classes";
		$col_getRow=$conn->query($SQL);
		while($col_row = $col_getRow->fetchObject()){
			$classColor[strtolower($col_row->eng)] = $col_row->color;
		}
		//print_r($attributeSymbols);
	}
	catch(PDOException $e) {
		echo "Error: " . $e->getMessage();
	}

?>