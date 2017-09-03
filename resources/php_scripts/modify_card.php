<?php

	header('Content-Type: text/html; charset=utf-8');

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$mode=isset($_REQUEST['mode']) ? $_REQUEST['mode'] : "edit";
	$id=isset($_REQUEST['id']) ? $_REQUEST['id'] : -1;
	$name=isset($_REQUEST['name']) ? $_REQUEST['name'] : "no name";
	$description=isset($_REQUEST['description']) ? $_REQUEST['description'] : "no description";
	$class=isset($_REQUEST['class']) ? $_REQUEST['class'] : 0;
	$type=isset($_REQUEST['type']) ? $_REQUEST['type'] : 0;
	$archetype=isset($_REQUEST['archetype']) ? $_REQUEST['archetype'] : 0;
	$attack=isset($_REQUEST['attack']) ? $_REQUEST['attack'] : 0;
	$health=isset($_REQUEST['health']) ? $_REQUEST['health'] : 0;
	$flags=isset($_REQUEST['flags']) ? $_REQUEST['flags'] : 0;
	$lang=isset($_REQUEST['lang']) ? $_REQUEST['lang'] : "it";

	try{
		if($mode == "edit"){
			$lang_table = "card_".$lang;
			$SQL="UPDATE card_data SET class=:class, type=:type, archetype=:archetype, flags=:flags, attack=:attack, health=:health WHERE id = :id";
			$edit_card=$conn->prepare($SQL);
			$edit_card->bindParam(':id',$id,PDO::PARAM_STR);
			$edit_card->bindParam(':class',$class,PDO::PARAM_STR);
			$edit_card->bindParam(':type',$type,PDO::PARAM_STR);
			$edit_card->bindParam(':archetype',$archetype,PDO::PARAM_STR);
			$edit_card->bindParam(':flags',$flags,PDO::PARAM_STR);
			$edit_card->bindParam(':attack',$attack,PDO::PARAM_STR);
			$edit_card->bindParam(':health',$health,PDO::PARAM_STR);
			if($edit_card->execute()){
				$SQL="UPDATE ".$lang_table." SET name=:name, description=:description WHERE ref=:ref";
				$edit_card=$conn->prepare($SQL);
				$edit_card->bindParam(':ref',$id,PDO::PARAM_STR);
				$lashName = addslashes($name);
				$edit_card->bindParam(':name',$lashName,PDO::PARAM_STR);
				$lashDescription=addslashes($description);
				$edit_card->bindParam(':description',$lashDescription,PDO::PARAM_STR);
				if($edit_card->execute()){
					echo "Card '".ucwords($name)."' has been modified!";
				}
				else echo "lang_error";
			}
			else echo "data_error";
		}
		else if ($mode =="delete"){
			$SQL="UPDATE card_data SET active='0' WHERE id = :id";
			//$SQL="DELETE FROM card_data WHERE id = :id";
			$delete_card=$conn->prepare($SQL);
			$delete_card->bindParam(':id',$id,PDO::PARAM_STR);
			if($delete_card->execute()){
				echo "Card '".ucwords($name)."' has been removed!";
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
			$SQL="UPDATE card_data SET active='1' WHERE id = :id";
			//$SQL="DELETE FROM card_data WHERE id = :id";
			$delete_card=$conn->prepare($SQL);
			$delete_card->bindParam(':id',$id,PDO::PARAM_STR);
			if($delete_card->execute()){
				echo "Card '".ucwords($name)."' has been recovered!";
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