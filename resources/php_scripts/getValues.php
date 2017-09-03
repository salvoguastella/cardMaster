<?php

	class _valueGetter{

		private $valuesJSON;
		private $valuesSelect;
		private $valuesArray;
		private $SQL;

		public function __construct($mode, $conn){
			switch ($mode) {
				case 'archetype':
					$this->SQL="SELECT `id`,`class`,`ita`,`eng` FROM `archetypes`";
					break;
				case 'type':
					$this->SQL="SELECT `id`,`ita`,`eng` FROM `types`";
					break;
				case 'flag':
					$this->SQL="SELECT `id`,`name` FROM `flags`";
					break;
				default:
					//otherwise class
					$this->SQL="SELECT `id`,`ita`,`eng` FROM `classes`";
					break;
			}

			$stm=$conn->prepare($this->SQL);
			$stm->execute();

			$this->valuesJSON = "[";
			$this->valuesSelect = "<select name='".$mode."' class='card_".$mode."'>";
			$this->valuesArray = array();
			while($row=$stm->fetchObject()){
				$this->valuesJSON = $this->valuesJSON.json_encode($row).",";
				if($mode == "archetype"){
					$this->valuesSelect = $this->valuesSelect."<option value='".$row->id."' data-class='".$row->class."'>".ucwords($row->ita)."</option>";
					$this->valuesArray[$row->id] = array("class"=>$row->class, "name"=>$row->ita);
				}
				else if($mode == "flag"){ 
					$this->valuesSelect = $this->valuesSelect."<option value='".$row->id."'>".ucwords($row->name)."</option>";
					$this->valuesArray[$row->id] = array("name"=>$row->name);
				}
				else {
					$this->valuesSelect = $this->valuesSelect."<option value='".$row->id."'>".ucwords($row->ita)."</option>";
					$this->valuesArray[$row->id] = array("name"=>$row->ita);
				}
			}
			$this->valuesJSON = rtrim($this->valuesJSON, ",")."]";
			$this->valuesSelect = $this->valuesSelect."</select>";
		}

		public function getJSON(){
			return $this->valuesJSON;
		}

		public function getSelect(){
			return $this->valuesSelect;
		}

		public function getArray(){
			return $this->valuesArray;
		}

	}

?>