<?php
	include_once("conn.php");

	$conn=Core::getInstance()->dbh;


	$page_size = 40;
	$page=isset($_REQUEST['page']) ? $_REQUEST['page'] : "1";
	$start=($page - 1) * $page_size;

	$limit = $page*$page_size - $start;

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
			while($row=$stm->fetchObject()){
				//for flags HERE. FLAG FILTERING IS DONE ON RESULTS
				$imageList .= "<img class='iconImage' data-id='".$row->id."' src='".$row->path."' alt='".$row->name."' title='".$row->name."' >";
			}

			$commandList = "<div class='page' data-index='1'>1</div>";
			if($page > 1){
				$commandList.= "<div class='page' data-index='".($page-1)."'><i class='fa fa-angle-left'></i></div>";
			}
			if($page > 1 && $page < $totalPages){
				$commandList.= "<div class='page current' data-index='".$page."'>".$page."</div>";
			}
			if($page < $totalPages){
				$commandList.= "<div class='page' data-index='".($page+1)."'><i class='fa fa-angle-right'></i></div>";
			}
			$commandList.= "<div class='page' data-index='".$totalPages."'>".$totalPages."</div>";

			$iconPage = [];

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





	?>