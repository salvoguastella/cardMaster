<?php
	include_once("conn.php");

	$conn=Core::getInstance()->dbh;


	$page_size = 40;
	$page=isset($_REQUEST['page']) ? $_REQUEST['page'] : "1";
	$start=($page - 1) * $page_size;

	$limit = $page*$page_size - $start;

	$usedIconsSQL = "SELECT image, name FROM `card_data` JOIN `card_it` ON `card_data`.id = `card_it`.ref GROUP BY image";

	try{

		$stm=$conn->prepare($usedIconsSQL);
		$stm->execute();

		$usedIcons = [];
		$usedIconsNames = [];

		while($row=$stm->fetchObject()){
			array_push($usedIcons, $row->image);
			$usedIconsNames[$row->image] = array("name" => $row->name);
		}

		$countSQL = "SELECT id,name,path FROM icons";

		try{

			$stm=$conn->prepare($countSQL);
			$stm->execute();
			$totalIcons = $stm->rowCount();
			$totalPages = ceil($totalIcons/$page_size);

			$SQL="SELECT id,name,path FROM icons ORDER BY name LIMIT $start,$limit";

			try{

				$stm=$conn->prepare($SQL);
				$stm->execute();

				$imageList = "";
				$firstItemName = "";
				$lastItemName = "";
				while($row=$stm->fetchObject()){

					if ($firstItemName == "") $firstItemName = $row->name;
					$lastItemName = $row->name;
					if(in_array($row->id, $usedIcons)){
						$imageList .= "<img class='iconImage used' data-id='".$row->id."' src='".$row->path."' alt='".$row->name."' title='".$row->name.", assigned to ".$usedIconsNames[$row->id]["name"]."' >";
					}
					else{
						$imageList .= "<img class='iconImage' data-id='".$row->id."' src='".$row->path."' alt='".$row->name."' title='".$row->name."' >";
					}
				}
				//first page
				$commandList = "<div class='page' data-index='1'>1</div>";
				//3rd prev page
				if($page-3 > 1){
					$commandList.= "<div class='page' data-index='".($page-3)."'>-3</i></div>";
				}
				//prev page
				if($page > 1){
					$commandList.= "<div class='page' data-index='".($page-1)."'><i class='fa fa-angle-left'></i></div>";
				}
				//current page
				if($page > 1 && $page < $totalPages){
					$commandList.= "<div class='page current' data-index='".$page."'>".$page."</div>";
				}
				//next page
				if($page < $totalPages){
					$commandList.= "<div class='page' data-index='".($page+1)."'><i class='fa fa-angle-right'></i></div>";
				}
				//3rd next page
				if($page+3 < $totalPages){
					$commandList.= "<div class='page' data-index='".($page+3)."'>+3</i></div>";
				}
				//last page
				$commandList.= "<div class='page' data-index='".$totalPages."'>".$totalPages."</div>";

				$iconPage = [];

				$iconPage["header"] = "<i class='fa fa-file-image-o'></i>".substr($firstItemName, 0, 3)." - ".substr($lastItemName, 0, 3);
				$iconPage["list"] = $imageList;
				$iconPage["commands"] = $commandList;

				echo json_encode($iconPage);
			}
			catch(PDOException $e) {
				echo "Error: " . $e->getMessage() . " " .$SQL;
			}

		}
		catch(PDOException $e) {
			echo "Error: " . $e->getMessage() . " " .$SQL;
		}
	}
	catch(PDOException $e) {
		echo "Error: " . $e->getMessage() . " " .$SQL;
	}







	?>