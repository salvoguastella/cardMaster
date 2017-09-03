<?php

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$_REQUEST["start"] = isset($_REQUEST["start"]) ? $_REQUEST["start"]: 0;
	$_REQUEST["limit"] = isset($_REQUEST["limit"]) ? $_REQUEST["limit"]: 10;


	$SQL = "SELECT id,name,path FROM icons LIMIT ".$_REQUEST["start"].", ".$_REQUEST["limit"];
	$stm=$conn->prepare($SQL);
	$stm->execute();
	$iconList = "<ul class='icon-list'>";
	while($row=$stm->fetchObject()){
		$iconList = $iconList."<li><img src='".$row->path."' data-index='".$row->id."' title='".$row->name."'></li>";
	}
	$iconList = $iconList."</ul>";
	echo $iconList;
?>