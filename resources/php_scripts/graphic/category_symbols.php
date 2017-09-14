<?php

	header('Content-Type: text/html; charset=utf-8');

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$categorySymbols=array();

	try{
		$SQL="SELECT name, path FROM icon_categories";
		$cat_getRow=$conn->query($SQL);
		while($cat_row = $cat_getRow->fetchObject()){
			$categorySymbols[$cat_row->name] = array("path"=>$cat_row->path);
		}
		//print_r($attributeSymbols);
	}
	catch(PDOException $e) {
		echo "Error: " . $e->getMessage();
	}

?>