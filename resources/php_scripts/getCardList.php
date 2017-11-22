<?php

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$active=isset($_REQUEST['active']) ? $_REQUEST['active'] : "1";
	$lemma=isset($_REQUEST['lemma']) ? $_REQUEST['lemma'] : "";
	$class=isset($_REQUEST['class']) ? $_REQUEST['class'] : "";
	$archetype=isset($_REQUEST['archetype']) ? $_REQUEST['archetype'] : "";
	$type=isset($_REQUEST['type']) ? $_REQUEST['type'] : "";
	$flags=isset($_REQUEST['flags']) ? $_REQUEST['flags'] : "";
	$orderBy=isset($_REQUEST['orderBy']) ? $_REQUEST['orderBy'] : "";

	$SQL = "SELECT card_data.id,card_it.name,description,class,archetype,type,attack,health,flags,path FROM card_data JOIN card_it ON ref = card_data.id JOIN icons ON image = icons.id WHERE active='$active'";// AND image = '587'";

	$tail = "";

	$filters = array();

	if($lemma != ""){
		$string = "(card_it.name LIKE '%".$lemma."%' OR card_it.description LIKE '%".$lemma."%')";
		array_push($filters,$string);
	}
	if($class != ""){
		$string = "class = ".$class;
		array_push($filters,$string);
	}
	if($type != ""){
		$string = "type = ".$type;
		array_push($filters,$string);
	}
	if($archetype != ""){
		$string = "archetype = ".$archetype;
		array_push($filters,$string);
	}

	$tail.= join(' AND ', $filters);

	if($tail != "") $SQL.= " AND ".$tail;

	if($orderBy != ""){
		$SQL .= " ORDER BY ".$orderBy;
	}

	//echo $SQL;
	$flagsArray = explode("|",$flags);

	try{

		$stm=$conn->prepare($SQL);
		$stm->execute();
		$listJSON = "[";
		while($row=$stm->fetchObject()){
			//FLAG FILTERING IS DONE ON RESULTS
			if($flags != "" AND count($flagsArray) > 0 ){
				$showRow = true;
				$flagsJSON = json_decode($row->flags, true);
				foreach ($flagsArray as $i => $filterFlag) {
					if($flagsJSON[$filterFlag-1]["value"] != "1") $showRow = false;
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