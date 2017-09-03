<?php

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	//get id-name list in dropdown format

	$SQL = "SELECT card_data.id,card_it.name FROM card_data JOIN card_it ON ref = card_data.id ORDER BY card_it.name";

	try{

		$stm=$conn->prepare($SQL);
		$stm->execute();
		$cardDropdown = "<select name='newComboCard' class='new_combo_card'>";
		while($row=$stm->fetchObject()){
			$cardDropdown = $cardDropdown."<option value='".$row->id."'>".$row->name."</option>";
		}
		$cardDropdown = $cardDropdown."</select>";
		echo $cardDropdown;
	}
	catch(PDOException $e) {
		echo "Error: " . $e->getMessage() . " " .$SQL;
	}
?>