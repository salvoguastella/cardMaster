<?php
	include_once("conn.php");

	$conn=Core::getInstance()->dbh;


	$page_size = 40;
	$page=isset($_REQUEST['page']) ? $_REQUEST['page'] : "1";
	$start=($page - 1) * $page_size;

	$limit = $page*$page_size - $start;

	$SQL="SELECT id,name,path FROM icons LIMIT $start,$limit";

	try{

		$stm=$conn->prepare($SQL);
		$stm->execute();

		$imageList = "";
		while($row=$stm->fetchObject()){
			//for flags HERE. FLAG FILTERING IS DONE ON RESULTS
			$imageList .= "<img class='iconImage' data-id='".$row->id."' src='".$row->path."' alt='".$row->name."' title='".$row->name."' >";
		}
		echo $imageList;
	}
	catch(PDOException $e) {
		echo "Error: " . $e->getMessage() . " " .$SQL;
	}



	?>