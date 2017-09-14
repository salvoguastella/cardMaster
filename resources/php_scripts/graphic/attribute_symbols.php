<?php

	header('Content-Type: text/html; charset=utf-8');

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$attributeSymbols=array();

	try{
		$SQL="SELECT name, path, selector FROM icon_attributes";
		$attr_getRow=$conn->query($SQL);
		while($attr_row = $attr_getRow->fetchObject()){
			$attributeSymbols[$attr_row->name] = array("path"=>$attr_row->path,"selector"=>$attr_row->selector);

		}
		//print_r($attributeSymbols);
	}
	catch(PDOException $e) {
		echo "Error: " . $e->getMessage();
	}

?>