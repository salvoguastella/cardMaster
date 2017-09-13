<?php

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$active=isset($_REQUEST['active']) ? $_REQUEST['active'] : "1";
	$lemma=isset($_REQUEST['lemma']) ? $_REQUEST['lemma'] : "";
	$class=isset($_REQUEST['class']) ? $_REQUEST['class'] : "";
	$checkCard=isset($_REQUEST['card']) ? $_REQUEST['card'] : "";

	$orderBy=isset($_REQUEST['orderBy']) ? $_REQUEST['orderBy'] : "";

	$SQL = "SELECT id,name,class,cards,notes FROM combos WHERE active='$active'";

	$tail = "";

	$filters = array();

	if($lemma != ""){
		$string = "(name LIKE '%".$lemma."%' OR notes LIKE '%".$lemma."%')";
		array_push($filters,$string);
	}
	if($class != ""){
		$string = "class = ".$class;
		array_push($filters,$string);
	}

	$tail.= join(' AND ', $filters);

	if($tail != "") $SQL.= " AND ".$tail;

	if($orderBy != "" AND $orderBy != "cards"){
		$SQL .= " ORDER BY ".$orderBy;
	}

	try{

		$stm=$conn->prepare($SQL);
		$stm->execute();
		$listJSON = "[";
		while($row=$stm->fetchObject()){
			//CARD FILTERING IS DONE ON RESULTS
			if($checkCard != "" ){
				$showRow = false;
				$comboCards = explode("|", $row->cards);
				foreach ($comboCards as $i => $comboCard) {
					if($comboCard == $checkCard){
						$showRow = true;
						break;
					}
				}
				if($showRow) $listJSON = $listJSON.json_encode($row).",";
			}
			else{
				$listJSON = $listJSON.json_encode($row).",";
			}
		}
		$listJSON = rtrim($listJSON, ",")."]";
		echo $listJSON;
	}
	catch(PDOException $e) {
		echo "Error: " . $e->getMessage() . " " .$SQL;
	}
?>