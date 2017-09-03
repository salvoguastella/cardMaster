		<?php
			$mainPath = dirname(__DIR__, 2);
			// include composer autoload
			require $mainPath . '\vendor\autoload.php';

			// import the Intervention Image Manager Class
			use Intervention\Image\ImageManager;

			include_once("conn.php");

			$conn=Core::getInstance()->dbh;

			$cardID=isset($_REQUEST['id']) ? $_REQUEST['id'] : "4";

			$SQL="SELECT card_it.name, card_it.description, classes.eng AS class,types.eng AS type,archetypes.eng AS archetype,icons.path,attack,health FROM `card_data` JOIN card_it ON card_it.ref = card_data.id JOIN classes ON classes.id = card_data.class JOIN types ON types.id = card_data.type JOIN archetypes ON archetypes.id = card_data.archetype JOIN icons ON icons.id = card_data.image WHERE card_data.id='".$cardID."'";

			try{

				$stm=$conn->prepare($SQL);
				$stm->execute();
				while($row=$stm->fetchObject()){
					//generate image

					// create an image manager instance with favored driver
					$manager = new ImageManager(array('driver' => 'imagick'));

					$classColor= array(
						"warrior"=>"#b03436",
						"mage"=>"#3b62b0",
						"rogue"=>"#379c39",
						"priest"=>"#ada242",
						"neutral"=>"#6b6b6b"
					);
					$mainColor=$classColor[strtolower($row->class)];

					$cardType = strtolower($row->type);
					if($cardType == "servant" or $cardType == "campione") {
						$cardBack = '/resources/img/card_parts/servant.png';
					}
					else{
						$cardBack = '/resources/img/card_parts/normal.png';
					}

					$card = $manager->make($mainPath.$cardBack);
					$cardW = $card->width();
					$cardH = $card->height();
					$rate = 1;
					$middleX = $cardW*$rate/2;
					$middleY = $cardH*$rate/2;
					$card->resize($cardW*$rate, $cardH*$rate);

					$cornerName = strtolower($row->class);
					if($row->archetype == "No") $cornerName.="_neutral";
					else $cornerName.="_".strtolower($row->archetype);
					$cornerName.=".png";

					$cornerType = '/resources/img/card_parts/borders/'.$cornerName;
					$cornerOffset = 40 * $rate;
					//$corner = $manager->make(__DIR__ .$cornerType);
					$corner = $manager->make($mainPath.$cornerType);
					$cornerW = $corner->width();
					$cornerH = $corner->height();
					$corner->resize($cornerW*$rate, $cornerH*$rate);

					// for 4 angles, rotate and position
					$card->insert($corner, 'bottom-left', $cornerOffset, $cornerOffset);

					$corner->rotate(90);
					$card->insert($corner, 'bottom-right', $cornerOffset, $cornerOffset);

					$corner->rotate(90);
					$card->insert($corner, 'top-right', $cornerOffset, $cornerOffset);

					$corner->rotate(90);
					$card->insert($corner, 'top-left', $cornerOffset, $cornerOffset);

					//card type
					$cardTypeOffset = 44*$rate;
					$card->text(ucwords($cardType), $middleX, $cardTypeOffset, function($font) use($mainPath,$rate, $mainColor) {
					    $font->file($mainPath.'/resources/fonts/candlebright.otf');
					    $font->size(40*$rate);
					    $font->color($mainColor);
					    $font->align('center');
					    $font->valign('top');
					});
					//TEXT BORDER
					$cardName = stripslashes($row->name);
					$nameSize = 60*$rate;
					if(strlen($cardName) > 16) $nameSize = 50*$rate;

					$borderWidth = 2*$rate;
					$borderSpacing = [
						[$borderWidth,$borderWidth],
						[$borderWidth/2,$borderWidth/2],
						[$borderWidth,-$borderWidth],
						[$borderWidth/2,-$borderWidth/2],
						[-$borderWidth,$borderWidth],
						[-$borderWidth/2,$borderWidth/2],
						[-$borderWidth,-$borderWidth],
						[-$borderWidth/2,-$borderWidth/2],
						[$borderWidth,0],
						[$borderWidth/2,0],
						[-$borderWidth,0],
						[-$borderWidth/2,0],
						[0,$borderWidth],
						[0,$borderWidth/2],
						[0,-$borderWidth],
						[0,-$borderWidth/2]
					];

					$textBorderLayer = $manager->canvas($cardW*$rate, $cardH*$rate);

					foreach ($borderSpacing as $key => $space) {
						$x=$middleX+$space[0];
						$y=$middleY+$space[1]-100*$rate;
						$textBorderLayer->text($cardName, $x, $y, function($font) use($mainPath,$rate,$nameSize) {
						    $font->file($mainPath.'/resources/fonts/candlebright.otf');
						    $font->size($nameSize);
						    $font->color('#3b270e');
						    $font->align('center');
						    $font->valign('top');
						});
					}

					$textBorderLayer->blur(2);

					$card->insert($textBorderLayer, 'top-left', 0,0);
					$card->insert($textBorderLayer, 'top-left', 0,0);
					$card->insert($textBorderLayer, 'top-left', 0,0);
					$card->insert($textBorderLayer, 'top-left', 0,0);
					$card->insert($textBorderLayer, 'top-left', 0,0);
					$card->insert($textBorderLayer, 'top-left', 0,0);

					//card name
					if(strlen($cardName) > 16) $nameSize = 50*$rate;
					$card->text($cardName, $middleX, $middleY-100*$rate, function($font) use($mainPath,$rate, $nameSize) {
					    $font->file($mainPath.'/resources/fonts/candlebright.otf');
					    $font->size($nameSize);
					    $font->color('#ffffff');
					    $font->align('center');
					    $font->valign('top');
					});

					//card text
					$textSize = 24*$rate;
					$cardText = stripslashes($row->description);
					$cardText = explode("|", $cardText);
					$textOffset = $middleY+40*$rate;
					$lineHeight = 40*$rate;
					if(count($cardText)>1){
						$categoryText = wordwrap($cardText[0], 36, "\n");
						$card->text($categoryText, 86*$rate, $textOffset, function($font) use($mainPath,$rate, $textSize) {
						    //$font->file($mainPath.'/resources/fonts/FiraSans-Regular.otf');
						    $font->file($mainPath.'/resources/fonts/FrizQuadrataBold.otf');
						    $font->size($textSize);
						    $font->color('#000000');
						    $font->align('left');
						    $font->valign('bottom');
						});
						$textOffset = $textOffset + $lineHeight;
						$bodyText = wordwrap($cardText[1], 36, "\n");
					}
					else{
						$bodyText = wordwrap($cardText[0], 36, "\n");
					}
					$bodyText = explode("\n",$bodyText);
					foreach($bodyText as $line){
						$card->text($line, 86*$rate, $textOffset, function($font) use($mainPath,$rate, $textSize) {
						    //$font->file($mainPath.'/resources/fonts/FiraSans-Regular.otf');
						    $font->file($mainPath.'/resources/fonts/FrizQuadrata.ttf');
						    $font->size($textSize);
						    $font->color('#000000');
						    $font->align('left');
						    $font->valign('bottom');
						});
						$textOffset = $textOffset + $lineHeight;
					}


					$imageLayer = $manager->canvas($cardW*$rate, $cardH*$rate);

					//add card type shape here
					$emblems=array(
						"oggetto"=>array("path"=>"oggetto.svg","size"=>200,"offset"=>90),
						"aura"=>array("path"=>"aura.svg","size"=>190,"offset"=>90),
						"azione"=>array("path"=>"azione.svg","size"=>210,"offset"=>80),
						"equip"=>array("path"=>"equip.svg","size"=>210,"offset"=>80),
						"servant"=>array("path"=>"servant.svg","size"=>180,"offset"=>95),
						"campione"=>array("path"=>"campione.svg","size"=>200,"offset"=>100)
					);

					$emblemW = ceil($emblems[$cardType]["size"]*$rate);
					$emblemH = ceil($emblems[$cardType]["size"]*$rate);
					$emblemOffest = ceil($emblems[$cardType]["offset"]*$rate);
					$emblemPath = $mainPath.'/resources/img/card_parts/emblems/'.$emblems[$cardType]["path"];
					$emblem = $manager->make($emblemPath)->resize($emblemW, $emblemH);

					//$emblem->opacity(80);

					$imageLayer->insert($emblem, 'top-center', 0, $emblemOffest);
					//card image
					$cardImageW = ceil(120*$rate);
					$cardImageH = ceil(120*$rate);
					$cardImageOffest = ceil(125*$rate);
					$cardImagePath = $mainPath.ltrim($row->path, ".");
					$cardImage = $manager->make($cardImagePath)->resize($cardImageW, $cardImageH);
					$imageLayer->insert($cardImage, 'top-center', 0, $cardImageOffest);

					$categorySymbols=array(
						"beast"=>array("path"=>"beast.svg"),
						"construct"=>array("path"=>"construct.svg"),
						"human"=>array("path"=>"human.svg"),
						"magic"=>array("path"=>"magic.svg"),
						"undead"=>array("path"=>"undead.svg")
					);

					//add card category here, if available
					if(isset($categoryText)){
						$categories = explode(",",$categoryText);
						$categoryNumber = count($categories);
						$categoryOffsetY = ceil(250*$rate);
						$categoryOffsetsX = [];
						switch ($categoryNumber) {
							case 1:
								array_push($categoryOffsetsX,0);
								break;
							case 2:
								array_push($categoryOffsetsX,-30);
								array_push($categoryOffsetsX,30);
								break;
							case 3:
								array_push($categoryOffsetsX,-60);
								array_push($categoryOffsetsX,0);
								array_push($categoryOffsetsX,60);
								break;
							case 4:
								array_push($categoryOffsetsX,-90);
								array_push($categoryOffsetsX,-30);
								array_push($categoryOffsetsX,30);
								array_push($categoryOffsetsX,90);
								break;
							default:
								array_push($categoryOffsetsX,0);
								break;
						}
						foreach ($categories as $k => $c) {
							$index=strtolower(trim($c));
							if(isset($categorySymbols[$index])){
								$symbolPath = $mainPath.'/resources/img/card_parts/categories/'.$categorySymbols[$index]["path"];
								$symbol = $manager->make($symbolPath)->resize(50,50);
								$symbolOffsetX = $middleX+$categoryOffsetsX[$k] - ($symbol->width()/2);
								$imageLayer->insert($symbol, 'top-left' , $symbolOffsetX, $categoryOffsetY);
							}
						}
					}

					$imageLayer->opacity(80);

					$card->insert($imageLayer, 'top-left', 0,0);

					//add triggers
					//add proprieties

					//servant/champion values

					if($cardType == "servant" or $cardType == "campione") {

						$valuesString = $row->attack." / ".$row->health;
						$valuesHeight = ($cardH - 108)*$rate;
						$valuesSize = 38*$rate;
						$card->text($valuesString, $middleX, $valuesHeight, function($font) use($mainPath,$rate,$valuesSize) {
						    $font->file($mainPath.'/resources/fonts/candlebright.otf');
						    $font->size($valuesSize);
						    $font->color('#3b270e');
						    $font->align('center');
						    $font->valign('top');
						});
					}

					$result ="../img/cardRenders/".$cardID.".png";
					$card->save($result);
					echo "success";
				}
			}
			catch(PDOException $e) {
				echo "Error: " . $e->getMessage() . " " .$SQL;
			}



		?>