<?php

	header('Content-Type: text/html; charset=utf-8');

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$triggerSymbols=array();

	try{
		$SQL="SELECT name, path, selector FROM icon_triggers";
		$trigg_getRow=$conn->query($SQL);
		while($trigg_row = $trigg_getRow->fetchObject()){
			$triggerSymbols[$trigg_row->name] = array("path"=>$trigg_row->path,"selector"=>$trigg_row->selector);

		}
	}
	catch(PDOException $e) {
		echo "Error: " . $e->getMessage();
	}

?>