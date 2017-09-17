<?php
	include_once("getValues.php");
	include_once("conn.php");
	$conn=Core::getInstance()->dbh;

	class _elements{
		private $values;
		public function __construct($_classes,$_archetypes,$_types,$_flags,$_categories,$_triggers,$_attributes){
			$this->values = array();
			$this->values["classes"] = $_classes;
			$this->values["archetypes"] = $_archetypes;
			$this->values["types"] = $_types;
			$this->values["flags"] = $_flags;
			$this->values["categories"] = $_categories;
			$this->values["triggers"] = $_triggers;
			$this->values["attributes"] = $_attributes;
		}
		public function getJSON(){
			return json_encode($this->values);
		}
	}


	$classGetter = new _valueGetter("class", $conn);

	$archetypeGetter = new _valueGetter("archetype", $conn);

	$typeGetter = new _valueGetter("type", $conn);

	$flagGetter = new _valueGetter("flag", $conn);

	$categoryGetter = new _valueGetter("category", $conn);

	$triggerGetter = new _valueGetter("trigger", $conn);

	$attributeGetter = new _valueGetter("attribute", $conn);

	$elementsJSON = new _elements($classGetter->getArray(),$archetypeGetter->getArray(),$typeGetter->getArray(),$flagGetter->getArray(),$categoryGetter->getArray(),$triggerGetter->getArray(),$attributeGetter->getArray());

	$finalJSON = $elementsJSON->getJSON();
	echo $finalJSON;

?>