window.cardMaster = window.cardMaster || {};

cardMaster.cardList = [];
cardMaster.comboList = [];
cardMaster.classes = [];
cardMaster.archetypes = [];
cardMaster.types = [];
cardMaster.flags = [];
cardMaster.editMode = false;
cardMaster.comboList = [];

//namespaces
cardMaster.collection = {};
cardMaster.combos = {};

function _cardFilter(){
	this.active="1";
	this.lemma="";
	this.orderBy="";
	this.class = "";
	this.archetype = "";
	this.type = "";
	this.flags = "";
	this.showArchive = function(){
		this.active="0";
	}
	this.reset = function(){
		this.lemma="";
		this.orderBy="";
		this.class = "";
		this.archetype = "" ;
		this.type = "";
		this.flags = "";
	}
	this.toQueryString = function(){
		var str = [];
		for(var p in this){
			if (cardMaster.cardFilter.hasOwnProperty(p)) {
				//add exception for flags
				if(typeof cardMaster.cardFilter[p] !== "function"){
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(cardMaster.cardFilter[p]));
				}
			}
		}
		return str.join("&");
	}
}

function _card(options){
	this.id = options.id || 0;
	this.name_eng = options.name_eng || "no name";
	this.description_eng = options.description_eng || "no description";
	this.name_ita = options.name_ita || "no name";
	this.description_ita = options.description_ita || "no description";
	this.class = options.class || 1;
	this.archetype = options.archetype || 0 ;
	this.type = options.type || 1;
	this.attack = options.attack || 0;
	this.health = options.health || 0;
	this.flags = options.flags || [];
	this.image = options.image || null;
	this.getName = function(lang){
		lang = lang || "eng";
		if(lang == "ita") return this.name_ita;
		else return this.name_eng;
	}
	this.getDescription = function(lang){
		lang = lang || "eng";
		if(lang == "ita") return this.description_ita;
		else return this.description_eng;
	}
	this.has_flags = function(){
		//check all card flags with filter flags
		console.dir(cardMaster.cardFilter);
		return true;
	}
}

function _imageLoader(){
	this.page = 0;
}

function _combo(options){
	this.id = options.id || 0;
	this.name = options.name || "no name";
	this.description = options.description || "no description";
	this.class = options.class || 1;
	this.cards = options.cards || [];
	this.getName = function(lang){
		lang = lang || "eng";
		if(lang == "ita") return this.name_ita;
		else return this.name_eng;
	}
	this.getDescription = function(lang){
		lang = lang || "eng";
		if(lang == "ita") return this.description_ita;
		else return this.description_eng;
	}
	this.getCardImages = function(){
		var imageString = "";
		this.cards.forEach(function(card){
			imageString = imageString + "<img src='./resources/img/cardRenders/"+card+".png'>";
		});
		return imageString;
	}
}

cardMaster.getPage = function(){
	return document.title;
}

cardMaster.collection.syncArchetypes = function(){
	var selector=$("select.card_class");
	var sub_selector=$("select.card_archetype");
	selector.on('change', function(event) {
		event.preventDefault();
		var value = $(this).val();
		sub_selector.find("option").hide();
		sub_selector.find("option[data-class='"+value+"']").show();
		sub_selector.find("option[data-class='1']").show().attr("selected", "selected");
		sub_selector.val(1);
	});
	selector.trigger("change");
};

cardMaster.collection.showServantFields = function(){
	var selector = $(".card_form .card_type");
	var target = $(".card_form .servant_values");
	selector.on("change", function(){
		if(selector.val() == "4" || selector.val() == "6") target.show();
		else target.hide();
	});
	selector.trigger("change");
};

cardMaster.collection.generateFlags = function(){
	var selector = $(".card_form .single_flag");
	var target = $(".card_form .card_flags");
	selector.on("change", function(){
		var flags = [];
		selector.each(function(index, el) {
			var flag = {};
			if ($(el).is(":checked")) flag = {"index":$(el).data("flag"), "value":1};
			else flag = {"index":$(el).data("flag"), "value":0};
			flags.push(flag);
		});
		target.val(JSON.stringify(flags));
	});
	selector.first().trigger("change");
};

cardMaster.collection.createCard = function(){
	var selector=$("#newCardForm");
	selector.on("submit", function(e){
		console.log(selector.serialize());
		e.preventDefault();
		$.ajax({
			url: selector.attr("action"),
			type: "POST",
			dataType: 'text',
			data: selector.serialize(),
		})
		.done(function(res) {
			if(parseInt(res) == 0){
				cardMaster.showMessage("This card already exists in DB", "error");
			}
			else{
				cardMaster.collection.resetCardForm();
				cardMaster.showMessage(res, "confirm");
			}
		})
		.fail(function() {
			cardMaster.showMessage("Connection error", "error");
		})
	});
};

cardMaster.getCardDataById = function(id){
	var foundCard = "none";
	cardMaster.cardList.forEach(function(card){
		var testId = parseInt(card.id);
		if(testId == id){
			foundCard = card;
		}
	});
	return foundCard;
};

cardMaster.collection.sendChangeRequest = function(form){
		$.ajax({
			url: form.attr("action"),
			type: "POST",
			dataType: 'text',
			data: form.serialize(),
		})
		.done(function(res) {
			if(res == "data_error"){
				cardMaster.showMessage("Error updating DB", "error");
			}
			else{
				cardMaster.collection.resetCardForm();
				cardMaster.collection.loadCards(cardMaster.collection.renderCardList);
				cardMaster.showMessage(res, "confirm");
				cardMaster.editMode = false;
			}
		})
		.fail(function() {
			cardMaster.showMessage("Connection error", "error");
		})
};

cardMaster.collection.startEdit = function(selRow){
	cardMaster.editMode = true;
	var editForm = $("#modifyCardForm");
	editForm.find(".card_id").val("");
	editForm.find(".card_mode").val("edit");
	cardMaster.collection.resetCardForm();

	var row_selector = $("#cardList .card");
	var rowID = selRow.parent().data("id");
	row_selector.removeClass('active')
	selRow.parent().addClass("active");
	var selectedCard = cardMaster.getCardDataById(rowID);
	editForm.find(".card_id").val(selectedCard.id);
	editForm.find(".card_name").val(selectedCard.getName().replace(/\\'/g, "'"));
	editForm.find(".card_description").val(selectedCard.getDescription().replace(/\\'/g, "'"));
	editForm.find(".card_class").val(selectedCard.class);
	editForm.find(".card_archetype").val(selectedCard.archetype);
	editForm.find(".card_type").val(selectedCard.type).trigger("change");
	editForm.find(".card_attack").val(selectedCard.attack);
	editForm.find(".card_health").val(selectedCard.health);
	_flags = JSON.parse(selectedCard.flags);
	_flags.forEach(function(flag){
		var ID_bit = cardMaster.flags[flag.index].name;
		//console.log(ID_bit);
		var checkbox = $(".card_form .flag_"+ID_bit);
		if(flag.value == 1)checkbox.prop("checked",true);
		else checkbox.prop("checked",false);
		checkbox.trigger("change");
	});
};

cardMaster.collection.editCard = function(){
	var selector=$("#modifyCardForm");
	selector.on("submit", function(e){
		e.preventDefault();
		cardMaster.collection.sendChangeRequest(selector);
	});
};

cardMaster.collection.deleteCard = function(){
	var trigger=$("#removeCard");
	var message=$("#removeCard .message");
	var confirm=$("#removeCard #confirm");
	var cancel=$("#removeCard #cancel");
	var selector=$("#modifyCardForm");

	message.on("click", function(){
		if(cardMaster.editMode){
			trigger.addClass("confirm");
		}
	});
	confirm.on("click", function(){
		if(cardMaster.editMode){
			selector.find(".card_mode").val("delete");
			cardMaster.collection.sendChangeRequest(selector);
			trigger.removeClass("confirm");
		}
	});
	cancel.on("click", function(){
		trigger.removeClass("confirm");
	});
};

cardMaster.collection.recoverCard = function(){
	var trigger=$("#recoverCard");
	var message=$("#recoverCard .message");
	var confirm=$("#recoverCard #confirm");
	var cancel=$("#recoverCard #cancel");
	var selector=$("#modifyCardForm");

	message.on("click", function(){
		if(cardMaster.editMode){
			trigger.addClass("confirm");
		}
	});
	confirm.on("click", function(){
		if(cardMaster.editMode){
			selector.find(".card_mode").val("recover");
			cardMaster.collection.sendChangeRequest(selector);
			trigger.removeClass("confirm");
		}
	});
	cancel.on("click", function(){
		trigger.removeClass("confirm");
	});
};

cardMaster.collection.resetCardForm = function(){
	var selector = $(".card_form");
	var textFields = selector.find("input[type='text'], textarea");
	var checkBoxes = selector.find("input[type='checkbox']");
	var select0 = selector.find("select.card_archetype");
	var select1 = selector.find("select.card_class, select.card_type");
	textFields.val("");
	checkBoxes.removeAttr('checked');
	select1.val(1).trigger('change');
	cardMaster.collection.generateFlags();
};

cardMaster.showMessage = function(msg,type){
	type = type || "confirm";
	var selector = $(".message-bar");
	selector.addClass(type);
	selector.find("span").text(msg+" - "+cardMaster.getTimeStamp());
	console.log(msg+" - "+cardMaster.getTimeStamp());
};

cardMaster.getTimeStamp = function(){
	var d = new Date();
	var date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
	var time = d.getHours()+":"+d.getMinutes();
	return date+"-"+time;
};

cardMaster.loadLiteralElements = function(callback){
	$.ajax({
		url: "resources/php_scripts/getElementsJSON.php",
		type: "GET",
		dataType: 'json'
	})
	.done(function(data){
		$.each(data, function(index, el) {
			if(cardMaster[index]){
				cardMaster[index] = el;
			}
		});
		if(typeof callback === "function"){
			callback();
		}
	})
	.fail(function(){
		cardMaster.showMessage("Error retrieving literal elements list", "error");
	});
};

cardMaster.collection.updateCount = function(){
	var selector = $("#cardCount");
	var cardCount = cardMaster.cardList.length;
	selector.text(cardCount);
}

cardMaster.collection.loadCards = function(callback){

	var filters = cardMaster.cardFilter.toQueryString();
	console.log(filters);

	$.ajax({
		url: "resources/php_scripts/getCardList.php",
		type: "GET",
		data: filters,
		dataType: 'json'
	})
	.done(function(data) {
		//console.log("success " + data);
		cardMaster.showMessage("Card list loaded", "confirm");
		cardMaster.cardList = [];
		$.each(data, function(i,_single_card){
			var single_card = {};

			single_card.id = _single_card.id || 0;
			single_card.name_eng = _single_card.name;
			single_card.description_eng = _single_card.description;
			single_card.name_ita = _single_card.name;
			single_card.description_ita = _single_card.description;
			single_card.class = _single_card.class;
			single_card.archetype = _single_card.archetype;
			single_card.type = _single_card.type;
			single_card.attack = _single_card.attack;
			single_card.health = _single_card.health;
			single_card.flags = _single_card.flags;
			single_card.image = _single_card.path.replace("./","");

			var card = new _card(single_card);
			cardMaster.cardList.push(card);
		});
		console.dir(cardMaster.cardList);
		cardMaster.collection.updateCount();
		if(typeof callback === "function") callback();
	})
	.fail(function() {
		cardMaster.showMessage("Error retrieving card list", "error");
	})
};

cardMaster.collection.showIconBox = function(source){
	if(source){
		var rect = source.getBoundingClientRect();
		var offset = $(document).scrollTop();
		var boxY = rect.top + offset;
		var selector = $("#imageList");
		selector.css({top:boxY});
		selector.addClass("active");
		var rowId = $(source).parent().parent().data("id");
		selector.find(".images").data("row",rowId);
	}
}

cardMaster.collection.hideIconBox = function(){
	var selector = $("#imageList");
	selector.removeClass("active");
	selector.find(".images").data("row","");
}

cardMaster.collection.renderCardList = function(){
	console.log("render");
	var selector = $("#cardList");
	//wipe cardList before render
	selector.html("");
	var tabFields = [
		"image",
		"name_eng",
		"class",
		"archetype",
		"type",
		"attack",
		"health",
		"flags"
	];
	$.each(cardMaster.cardList, function(i,row){

		var cardRow = $("<div>", {
			class: "row card",
			"data-id": row.id
		})
		//generate other rows and append them
		tabFields.forEach(function(el) {
			var textValue = row[el];
			switch(el){
				case "image":
					var image = $("<img>", {
						src: textValue
					});
					var cardField= $("<span>", {
						class: "card__"+el,
						html: image
					});
					image.on("click", function(){
						cardMaster.collection.showIconBox(image[0]);
					});
					break;
				case "name_eng":
				case "name_ita":
					var lang = el.split("_");
					var name = row.getName(lang[1]).replace(/\\'/g, "'");
					var description = row.getDescription(lang[1]).replace(/\\'/g, "'");
					var cardField= $("<span>", {
						class: "card__"+lang[0]+" "+lang[1],
						text: name,
						title: description
					});
					cardField.bind("click", function(){
						//add show preview on click 
						cardMaster.collection.renderCard($(this));
						cardMaster.collection.startEdit($(this));
						//$(window).scrollTop(0);
					});
					break;
				case "class":
					var cardField= $("<span>", {
						class: "card__"+el,
						text: cardMaster.classes[textValue].name,
						"data-index": textValue
					});
					break;
				case "archetype":
					var cardField= $("<span>", {
						class: "card__"+el,
						text: cardMaster.archetypes[textValue].name,
						"data-index": textValue
					});
					break;
				case "type":
					var cardField= $("<span>", {
						class: "card__"+el,
						text: cardMaster.types[textValue].name,
						"data-index": textValue
					});
					break;
				case "flags":
					var visualFlags = "<ul class='visual-flags'>";
					var _f = JSON.parse(textValue);
					$.each(_f,function(i,f){
						var status = "inactive";
						var pin = "";
						if (f.value == 1){
							status = "active";
							pin = "<i class='ra ra-flame-symbol'></i>";
						}
						visualFlags = visualFlags + "<li class='"+status+"' data-flag='"+cardMaster.flags[f.index].name+"' title='"+cardMaster.flags[f.index].name+"'>"+pin+"</li>";
					});
					visualFlags = visualFlags + "</ul>";

					var cardField= $("<span>", {
						class: "card__"+el,
						html: visualFlags
					});
					break;
				default:
					var cardField= $("<span>", {
						class: "card__"+el,
						text: textValue
					});
			}
			cardRow.append(cardField);
		});
		//generate inline controls HERE
		selector.append(cardRow);
	});
};

cardMaster.collection.orderList = function(){
	var selector = $(".header > .sortable");
	selector.on("click", function(){
		if($(this).hasClass("sorted")){
			$(this).removeClass("sorted");
			cardMaster.cardFilter.orderBy = "";
			cardMaster.collection.loadCards(cardMaster.collection.renderCardList);
		}
		else{
			selector.removeClass('sorted');
			$(this).addClass("sorted");
			cardMaster.cardFilter.orderBy = $(this).data("sort");
			cardMaster.collection.loadCards(cardMaster.collection.renderCardList);
		}
	});
}
cardMaster.collection.addFilters = function(){
	var selector = $("#filterTrigger");
	var textSearch = $("#textSearch");
	var classSearch = $(".filter_panel .card_class");
	var archetypeSearch = $(".filter_panel .card_archetype");
	var typeSearch = $(".filter_panel .card_type");
	var flagElement = $(".filter_panel .single_flag");
	//deselect
	classSearch.val(0);
	archetypeSearch.val(0);
	typeSearch.val(0);
	submit = $("#submitFilter");
	reset = $("#resetFilter");
	selector.on("click", function(){
		$(this).parent().toggleClass('active');
	});
	textSearch.on("change", function(){
		cardMaster.cardFilter.lemma = $(this).val();
	});
	classSearch.on("change", function(){
		cardMaster.cardFilter.class = $(this).val();
	});
	archetypeSearch.on("change", function(){
		cardMaster.cardFilter.archetype = $(this).val();
	});
	typeSearch.on("change", function(){
		cardMaster.cardFilter.type = $(this).val();
	});
	flagElement.on("change", function(){
		var flag = $(this).data("flag");
		var flagValues = [];
		$.each(flagElement, function(i,_flag){
			if($(_flag).is(":checked")) flagValues.push($(_flag).data("flag"));
		});
		cardMaster.cardFilter.flags = flagValues.join("|");
		console.log(cardMaster.cardFilter.flags);
	});
	submit.on("click", function(){
		cardMaster.collection.loadCards(cardMaster.collection.renderCardList);
	});
	reset.on("click", function(){
		cardMaster.cardFilter.reset();
		textSearch.val("");
		//classSearch.val(1);
		//archetypeSearch.val(1);
		//typeSearch.val(1);
		classSearch.val(0);
		archetypeSearch.val(0);
		typeSearch.val(0);
		flagElement.each(function(i,flag){
			$(flag).prop("checked", false);
		});
		cardMaster.collection.loadCards(cardMaster.collection.renderCardList);
	});
}

cardMaster.collection.iconBox = function(){
	var selector = $("#imageList");
	trigger = selector.find(".paging");
	close = selector.find(".close");
	//check if reference brokes after appending this element to a different node
	$(trigger).on("click", function(){
		if($(this).hasClass("prev")){
			if(cardMaster.imageLoader.page > 1) cardMaster.imageLoader.page--;
			else  cardMaster.imageLoader.page = 1;
		}
		else{
			cardMaster.imageLoader.page++;
		}
		console.log("retrieving page "+cardMaster.imageLoader.page);
		$.ajax({
			url: "resources/php_scripts/getImageList.php",
			type: "GET",
			data: {page: cardMaster.imageLoader.page },
			dataType: 'html'
		})
		.done(function(data) {
			cardMaster.showMessage("Icon page loaded", "confirm");
			var imgList = selector.find(".images");
			imgList.html(data);
			selector.find(".iconImage").on("click", function(){
				cardMaster.collection.setImageToCard(imgList.data("row"), $(this).data("id"), $(this).prop("src"));
			});
		})
		.fail(function() {
			cardMaster.showMessage("Error retrieving icon page", "error");
		})
	});
	close.on("click", function(){
		cardMaster.collection.hideIconBox();
	});
	$(trigger[0]).trigger("click");
}

cardMaster.collection.selectTab = function(){
	var selector = $(".mode-tabs .tab");
	selector.on("click", function(){
		var target = $(this).data("target");
		selector.removeClass("active");
		$(this).addClass("active");
		$(".tab-content").removeClass("active");
		$(target).addClass("active");
	});
}

cardMaster.collection.setImageToCard = function(rowID, imageID, src){
	$.ajax({
		url: "resources/php_scripts/setImageToCard.php",
		type: "GET",
		data: {cardID: rowID, imageID: imageID },
		dataType: 'html'
	})
	.done(function(msg) {
		cardMaster.showMessage(msg, "confirm");
		var rowImage = $("#cardList").find(".card[data-id='"+rowID+"']").find(".card__image img");
		rowImage.prop("src", src);
		cardMaster.collection.hideIconBox();
	})
	.fail(function() {
		cardMaster.showMessage("Error setting a new icon", "error");
	})
}

cardMaster.collection.stickyPanel = function(){
	var selector = $(".control-area");
	$(document).on("scroll", function(){
		if($(document).scrollTop()>60){
			selector.addClass('sticky');
		}
		else selector.removeClass('sticky');
	});
}

cardMaster.collection.renderCard = function(selRow){
	var rowID = selRow.parent().data("id");
	var $selector = $("#updateCard");
	var $image = $selector.parent().find(".card_render");
	//get image path here
	$image.prop("src", "./resources/img/cardRenders/"+rowID+".png?n="+Date.now());
	var $name = selRow.parent().find(".card__name").text();
	$image.prop("title", $name);
	console.log("card retrieve "+$name);
	$selector.unbind("click");
	$selector.on("click", function(){
		$selector.addClass('active');
		$.ajax({
			url: "resources/php_scripts/generateCardImage.php",
			type: "GET",
			data: {id: rowID},
			dataType: 'html'
		})
		.done(function(msg) {
			$image.prop("src", "./resources/img/cardRenders/"+rowID+".png?n="+Date.now());
			$selector.removeClass('active');
			cardMaster.showMessage("Card updated!");
		})
		.fail(function() {
			cardMaster.showMessage("Error updating card image", "error");
		})
	});
};

cardMaster.combos.loadComboList = function(callback){
	console.log("will load combo list");


	//var filters = cardMaster.cardFilter.toQueryString();
	//console.log(filters);

	$.ajax({
		url: "resources/php_scripts/getComboList.php",
		type: "GET",
		//data: filters,
		dataType: 'json'
	})
	.done(function(data) {
		//console.log("success " + data);
		cardMaster.showMessage("Combo list loaded", "confirm");
		cardMaster.comboList = [];
		$.each(data, function(i,_single_combo){
			var single_combo = {};

			single_combo.id = _single_combo.id || 0;
			single_combo.name = _single_combo.name;
			single_combo.description = _single_combo.notes;
			single_combo.class = _single_combo.class;
			single_combo.cards = _single_combo.cards.split("|");

			var combo = new _combo(single_combo);
			console.log(combo.getCardImages());
			cardMaster.comboList.push(combo);
		});
		console.dir(cardMaster.comboList);
		//cardMaster.collection.updateCount();
		if(typeof callback === "function") callback();
	})
	.fail(function() {
		cardMaster.showMessage("Error retrieving combo list", "error");
	})

}

cardMaster.combos.renderComboList= function(){
	console.log("will render combo list");
}

cardMaster.combos.toggleNewComboFormStatus = function(){
	var target = $(".new-combo");
	target.toggleClass('active');
}

cardMaster.combos.toggleNewComboForm = function(){
	var target = $(".new-combo");
	var trigger = target.find(".new-combo__trigger");
	trigger.on("click", function(){
		cardMaster.combos.toggleNewComboFormStatus();
	});
}

cardMaster.combos.resetNewComboFormStatus = function(){
	var target = $("#newCombo");
	var name = target.find("input[name='name']");
	var _class = target.find("select[name='class']");
	var cards = target.find("input[name='cards']");
	var description = target.find("textarea[name='description']");
	var select = target.find("select[name='newComboCard']");
	name.val("");
	_class.val(1);
	cards.val("");
	description.val("");
	var firstValue = select.find("option:first").val();
	select.val(firstValue);
	target.find(".added-card:not(.new-card)").remove();
}

cardMaster.combos.resetNewComboForm = function(){
	var target = $(".new-combo");
	var trigger = target.find(".new-combo__cancel");
	trigger.on("click", function(){
		cardMaster.combos.resetNewComboFormStatus();
		cardMaster.combos.toggleNewComboFormStatus();
	});
}

cardMaster.combos.addNewComboCard = function(){
	var newCardForm = $(".new-combo .new-card");
	var trigger = newCardForm.find(".btn");
	trigger.on("click", function(){
		var cardValue = newCardForm.find("select").val();
		var container = newCardForm.parent();
		var addedCard = $("<div>", {
						class: "added-card",
						"data-index": cardValue
					});
		var addedCardImg = $("<img>", {
						src: "./resources/img/cardRenders/"+cardValue+".png"
					});
		addedCard.append(addedCardImg);
		container.prepend(addedCard);
		var formCardsField = container.parent().find("input[name='cards']");
		var formCards = formCardsField.val();
		if(formCards != ""){
			formCards = formCardsField.val().split("|");
			formCards.push(cardValue);
			formCardsField.val(formCards.join("|"));
		}
		else{
			formCardsField.val(cardValue);
		}
	});
}

cardMaster.combos.createCombo = function(){
	var selector = $(".new-combo");
	var trigger = selector.find(".new-combo__save");
	var target = selector.find("#newCombo");
	trigger.on("click", function(){
		target.trigger("submit");
	});
	target.on("submit", function(e){
		e.preventDefault();
		$.ajax({
			url: target.attr("action"),
			type: "POST",
			dataType: 'text',
			data: target.serialize(),
		})
		.done(function(res) {
			if(parseInt(res) == 0){
				cardMaster.showMessage("This combo already exists in DB", "error");
			}
			else{
				cardMaster.combos.resetNewComboFormStatus();
				cardMaster.combos.toggleNewComboFormStatus();
				cardMaster.combos.loadComboList(cardMaster.combos.renderComboList);
				cardMaster.showMessage(res, "confirm");
			}
		})
		.fail(function() {
			cardMaster.showMessage("Connection error", "error");
		})
	});
}

cardMaster.init = function(){
	cardMaster.cardFilter = new _cardFilter();
	cardMaster.imageLoader = new _imageLoader();
	cardMaster.collection.syncArchetypes();
	cardMaster.collection.generateFlags();
	cardMaster.collection.showServantFields();
	cardMaster.collection.createCard();

	//page scripts
	console.log(cardMaster.getPage());
	if(cardMaster.getPage() == "archive"){
		cardMaster.cardFilter.showArchive();
		cardMaster.collection.recoverCard();
	}
	if(cardMaster.getPage() == "collection" || cardMaster.getPage() == "archive"){
		cardMaster.loadLiteralElements(function(){
			cardMaster.collection.loadCards(cardMaster.collection.renderCardList);
		});
		cardMaster.collection.orderList();
		cardMaster.collection.addFilters();
		cardMaster.collection.editCard();
		cardMaster.collection.deleteCard();
		cardMaster.collection.selectTab();
		cardMaster.collection.iconBox();
		cardMaster.collection.stickyPanel();
	}
	if(cardMaster.getPage() == "combos"){
		cardMaster.combos.loadComboList(cardMaster.combos.renderComboList);
		cardMaster.combos.toggleNewComboForm();
		cardMaster.combos.resetNewComboForm();
		cardMaster.combos.addNewComboCard();
		cardMaster.combos.createCombo();
	}
};

jQuery(document).ready(function() {
	cardMaster.init();
});