<?php

	header('Content-Type: text/html; charset=utf-8');

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$mode=isset($_REQUEST['mode']) ? $_REQUEST['mode'] : "edit";
	$id=isset($_REQUEST['id']) ? $_REQUEST['id'] : -1;
	$name=isset($_REQUEST['name']) ? $_REQUEST['name'] : "no name";
	$class=isset($_REQUEST['class']) ? $_REQUEST['class'] : 0;
	$cards=isset($_REQUEST['cards']) ? $_REQUEST['cards'] : "";
	$description=isset($_REQUEST['description']) ? $_REQUEST['description'] : "no description";

	try{
		if($mode == "edit"){
			$SQL="UPDATE combos SET name=:name, class=:class, cards=:cards, notes=:description WHERE id = :id";
			$edit_combo=$conn->prepare($SQL);
			$edit_combo->bindParam(':id',$id,PDO::PARAM_STR);
			$edit_combo->bindParam(':name',$name,PDO::PARAM_STR);
			$edit_combo->bindParam(':class',$class,PDO::PARAM_STR);
			$edit_combo->bindParam(':cards',$cards,PDO::PARAM_STR);
			$edit_combo->bindParam(':description',$description,PDO::PARAM_STR);
			if($edit_combo->execute()){
				echo "Combo '".ucwords($name)."' has been modified!";
			}
			else echo "data_error";
		}
		else if ($mode =="delete"){
			$SQL="UPDATE combos SET active='0' WHERE id = :id";
			//$SQL="DELETE FROM card_data WHERE id = :id";
			$delete_combo=$conn->prepare($SQL);
			$delete_combo->bindParam(':id',$id,PDO::PARAM_STR);
			if($delete_combo->execute()){
				echo "Combo '".ucwords($name)."' has been removed!";
				/*
				$SQL="DELETE FROM card_it WHERE ref = :id";
				$delete_card=$conn->prepare($SQL);
				$delete_card->bindParam(':id',$id,PDO::PARAM_STR);
				if($delete_card->execute()){
					echo "Card '".ucwords($name)."' has been removed!";
				}
				else echo "lang_error";
				*/
			}
			else echo "data_error";
		}
		else{
			$SQL="UPDATE combos SET active='1' WHERE id = :id";
			//$SQL="DELETE FROM card_data WHERE id = :id";
			$delete_combo=$conn->prepare($SQL);
			$delete_combo->bindParam(':id',$id,PDO::PARAM_STR);
			if($delete_combo->execute()){
				echo "Combo '".ucwords($name)."' has been recovered!";
				/*
				$SQL="DELETE FROM card_it WHERE ref = :id";
				$delete_card=$conn->prepare($SQL);
				$delete_card->bindParam(':id',$id,PDO::PARAM_STR);
				if($delete_card->execute()){
					echo "Card '".ucwords($name)."' has been removed!";
				}
				else echo "lang_error";
				*/
			}
			else echo "data_error";
		}
	}
	catch(PDOException $e) {
		echo "Error: " . $e->getMessage();
	}


?>