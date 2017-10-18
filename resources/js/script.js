window.cardMaster = window.cardMaster || {};

//namespaces
cardMaster.collection = {};
cardMaster.combos = {};
cardMaster.sidedeck = {};
cardMaster.sandbox = {};
cardMaster.animation = {};

//element lists
cardMaster.cardList = [];
cardMaster.comboList = [];
cardMaster.summary = [];
cardMaster.sidedeck.cards = [];
cardMaster.sandbox.elements = [];

//literal elements
cardMaster.classes = [];
cardMaster.archetypes = [];
cardMaster.types = [];
cardMaster.flags = [];
cardMaster.categories = [];
cardMaster.triggers = [];
cardMaster.attributes = [];
cardMaster.editMode = false;


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
	this.flags = options.flags || "";
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
	this.has_flag = function(flag){
		//check all card flags with filter flags
		if(this.flags != ""){
			var jFlags = JSON.parse(this.flags);
			var found = false;
			jFlags.forEach(function(jFlag){
				if(jFlag["index"] == flag && jFlag["value"] == 1) found = true;
			});
			return found;
		}
		else return false;
	}
	this.is = function(category){
		category = category.toLowerCase();
		var testText = this.getDescription().split("|");
		if(testText.length > 1){
			testText = testText[0].toLowerCase();
			if(testText.indexOf(category) > -1) return true;
			else return false;
		}
		else return false;
	}
	this.has = function(selector){
		selector = selector.toLowerCase();
		var testText = this.getDescription().split("|");
		if(testText.length > 1){
			testText = testText[1].toLowerCase();
		}
		else{
			testText = testText[0].toLowerCase();
		}
		if(testText.indexOf(selector) > -1) return true;
		else return false;
	}
}

function _imageLoader(){
	this.page = 0;
}

function _comboFilter(){
	this.active="1";
	this.lemma="";
	this.orderBy="";
	this.class = "";
	this.card = "";
	this.showArchive = function(){
		this.active="0";
	}
	this.reset = function(){
		this.lemma="";
		this.orderBy="";
		this.class = "";
		this.card = "";
	}
	this.toQueryString = function(){
		var str = [];
		for(var p in this){
			if (cardMaster.comboFilter.hasOwnProperty(p)) {
				//add exception for flags
				if(typeof cardMaster.comboFilter[p] !== "function"){
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(cardMaster.comboFilter[p]));
				}
			}
		}
		return str.join("&");
	}
}

function _combo(options){
	this.id = options.id || 0;
	this.name = options.name || "no name";
	this.description = options.description || "no description";
	this.class = options.class || 1;
	this.cards = options.cards || [];
	this.getName = function(){
		return this.name;
	}
	this.getDescription = function(){
		return this.description;
	}
	this.getCardImages = function(){
		var imageString = "";
		this.cards.forEach(function(card){

			var addedCard = $("<div>", {
				class: "added-card",
				"data-index": card
			});
			var addedCardImg = $("<img>", {
				class: "cardZoom",
				src: "./resources/img/cardRenders/"+card+".png"
			});
			var removeCardControl = $("<div>", {
				class: "remove-inline-card",
				html: "<i class='fa fa-remove'></i> Remove card"
			});

			addedCard.append(addedCardImg);
			addedCard.append(removeCardControl);

			imageString = imageString + addedCard[0].outerHTML;
		});
		return imageString;
	}
	this.cardsIdToString = function(){
		return this.cards.join("|");
	}
}

function _block(){
	this.types = {};
	this.flags = {};
	this.categories = {};
	this.triggers = {};
	this.attributes = {};
	this.getTotal = function(){
		var total = 0;
		for(t in this.types){
			total+=parseInt(this.types[t]);
		}
		return total;
	}
}

function _token(options){
	this.type = options.type || "token";
	this.value = options.value || 0;
}

function _sandboxItem(options){
	this.id = options.id || "none";
	this.type = options.type || undefined;
	this.x = options.x || 0;
	this.y = options.y || 0;
	this.value = options.value || "No value";
	this.z = options.z || 1;
	this.width = options.width || undefined;
	this.linked_elements = options.linked_elements || [];
	this.addLinkedElement = function(ID){
		var checkID = this.linked_elements.indexOf(ID);
		if (checkID <= -1) this.linked_elements.push(ID);
	};
	this.removeLinkedElement = function(ID){
		var checkID = this.linked_elements.indexOf(ID);
		if (checkID > -1) this.linked_elements.splice(checkID, 1);
	}
}

cardMaster.getPage = function(){
	return document.title;
}

cardMaster.cardZoom = function(){
	var selector = ".cardZoom";
	var target = $("<div>",{
						id: "cardPreview"
					})
	var targetImg = $("<img>");
	target.append(targetImg);

	//add exception if too close to edge

	$(document).on("mouseenter", selector, function(event){
		target.removeClass("active");
		var source = $(this).attr("src");
		if(source=="" || source === undefined) source = $(this).find("img").attr("src");
		if(source=="" || source === undefined) source = $(this).data("img");
		targetImg.attr("src",source);
		targetImg.on("error", function(){
			targetImg.attr("src", "./resources/img/card_parts/normal.png");
		});
		$("body").append(target);
		setTimeout(function(){
			target.addClass("active");
		},50);

		if(event.pageX > ($(window).width() / 2)) target.addClass("right");
		else target.removeClass("right");
		if(event.pageY > ($(window).height() / 2)) target.addClass("bottom");
		else target.removeClass("bottom");
		//console.log(event);
	})
	$(document).on("mouseleave", selector, function(){
		target.remove();
		target.removeClass("active");
	})
	$( document ).on( "mousemove", function( event ) {
		var xOffset = event.pageX+20;
		var yOffset = event.pageY-40;
		if(target){
			if(target.hasClass("right")){
				xOffset = event.pageX-270
			}
			if(target.hasClass("bottom")){
				yOffset = event.pageY-310
			}
			target.css({
				top:yOffset,
				left:xOffset
			});
		}
	});
};

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
		//console.log(selector.serialize());
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
				cardMaster.animation.newCardCreated();
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

cardMaster.getRandomCardDataByClass = function(_class){
	var foundCard = "none";
	for(var i = 0; i < cardMaster.cardList.length; i++){
		var randomIndex = Math.floor(Math.random() * cardMaster.cardList.length);
		//console.log(randomIndex);
		var card = cardMaster.cardList[randomIndex];
		if(card.class == _class || _class == "none"){
			foundCard = card;
			break;
		}
		c++;
	}
	return foundCard;
};

cardMaster.getComboDataById = function(id){
	var foundCombo = "none";
	cardMaster.comboList.forEach(function(combo){
		var testId = parseInt(combo.id);
		if(testId == id){
			foundCombo = combo;
		}
	});
	return foundCombo;
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
				cardMaster.collection.removeCardPreview();
				cardMaster.collection.loadList(cardMaster.collection.renderList);
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
	selector.removeClass('error').removeClass('confirm');
	selector.addClass(type);
	selector.find("span").text(msg+" - "+cardMaster.getTimeStamp());
	console.log(msg+" - "+cardMaster.getTimeStamp());
	cardMaster.showToast(msg+" - "+cardMaster.getTimeStamp(), type);
};

cardMaster.showToast = function(msg,type){
	if($(".message-toast-wrapper").size() > 0) $(".message-toast-wrapper").remove();
	type = type || "confirm";
	var wrapper = $("<div>",{
		class:"message-toast-wrapper "
	});
	var toast = $("<div>",{
		class:"message-toast "+type,
		text: msg
	});
	var close = $("<div>",{
		class:"message-toast__close",
		text: "Close"
	});

	close.on("click", function(){
		wrapper.fadeOut('300', function() {
			wrapper.remove();
		});
	});

	toast.append(close);
	wrapper.append(toast);
	$("body").append(wrapper);
	wrapper.fadeIn('300');
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

cardMaster.collection.loadList = function(callback){

	$(".card-content").removeClass("loaded");
	var filters = cardMaster.cardFilter.toQueryString();
	//console.log(filters);

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
		//console.dir(cardMaster.cardList);
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

cardMaster.collection.switchView = function(mode){
	localStorage.collection_viewMode = mode;
	if(mode == "grid"){
		cardMaster.collection.renderGrid();
	}
	else{
		cardMaster.collection.renderList();
	}
}

cardMaster.collection.switchViewCommands = function(){
	var selector = $(".view-switch");
	var container = $(".card-list, .card-grid");
	selector.on("click", function(e){
		e.stopImmediatePropagation();
		if(!$(this).hasClass("active")){
			selector.removeClass('active');
			container.removeClass('active');
			cardMaster.collection.switchView($(this).data("view"));
		}
	});
}

cardMaster.collection.render = function(){
	$(".card-content").removeClass("loaded");
	if(localStorage.collection_viewMode == "grid"){
		cardMaster.collection.renderGrid();
	}
	else{
		cardMaster.collection.renderList();
	}
}

cardMaster.collection.renderGrid = function(){
	$(".view-switch[data-view='grid']").addClass('active');
	$(".card-grid").addClass('active');
	var selector = $("#cardGrid");
	//wipe cardGrid before render
	selector.html("");
	var pageSize = 15;
	var cardNumber = cardMaster.cardList.length;
	var pages = Math.ceil(cardNumber / pageSize);
	console.log(pages);
	var book = $("<div>", {
		class:"book"
	}).css({
		opacity: 0
	});
	book.page = $("<div>", {
		class:"book__page panel"
	});
	book.obscurer = $("<div>", {
		class:"book__obscurer"
	});
	book.page_tracker = $("<div>", {
		class:"book__tracker"
	});
	book.page.card = $("<div>", {
		class:"book__card"
	});
	book.page.card.image = $("<img>", {
		class:"book__card__image cardZoom"
	});
	var arrow = $("<div>",{
		class: "page-arrow"
	})
	book.page.height = 0;
	//keeps track of browsing pages
	book.pageNumber = 0;
	//will store last image for load callback
	var lastImg;
	for(var i = 0; i < pages; i++){
		var newPage = book.page.clone();
		var newObscurer = book.obscurer.clone();
		var newTopTracker = book.page_tracker.clone();
		newTopTracker.text((i+1) +" of "+pages);
		var newBottomTracker = newTopTracker.clone();
		newBottomTracker.addClass('bottom');
		newPage.attr("data-page", i);
		newObscurer.attr("data-page", i);
		newPage.css({
			"z-index": (pages - i)
		});
		newObscurer.css({
			"z-index": (pages - i)
		});
		if(i == 0){
			newObscurer.addClass('show');
		}
		newPage.append(newTopTracker);
		for(var c = 0; c < pageSize; c++){
			var el_index = pageSize*i + c;
			var el = cardMaster.cardList[el_index];
			if(el !== undefined){
				var card = book.page.card.clone();
				var img = book.page.card.image.clone();
				//img.attr("title", el.getName());
				img.attr("src", "./resources/img/cardRenders/"+el.id+".png?n="+Date.now());
				card.append(img);
				newPage.append(card);
				img.on("error", function(){
					$(this).attr("src", "./resources/img/card_parts/normal.png");
				});
				lastImg = img;
				card.attr("data-id", el.id);
				img.on("click", function(){
					cardMaster.collection.renderCard($(this));
					cardMaster.collection.startEdit($(this));
				});
				if(cardMaster.getPage()!= "archive"){
					img.on("dblclick", function(){
						var cardID = $(this).parent().data("id");
						cardMaster.sidedeck.addCard(cardID);
					});
				}
			}
		}
		newPage.append(newBottomTracker);
		book.append(newPage);
		book.append(newObscurer);
	}
	selector.append(book);

	var prevArrow = arrow.clone();
	prevArrow.addClass('prev');
	prevArrow.html("<i class='fa fa-chevron-left'></i>");
	selector.append(prevArrow);
	prevArrow.on("click",function(){
		if(book.pageNumber>0){
			flipPage(-1);
		}
		updateArrows();
	});

	var nextArrow = arrow.clone();
	nextArrow.addClass('next');
	nextArrow.html("<i class='fa fa-chevron-right'></i>");
	selector.append(nextArrow);
	nextArrow.on("click",function(){
		if(book.pageNumber<pages){
			flipPage(1);
		}
		updateArrows();
	});

	updateArrows();

	lastImg.on("load", function(){
		pageHeightSetter();
		$(".card-content").addClass("loaded");
	})

	function pageHeightSetter(){
		book.find(".book__page").each(function(i,el){
			if($(el).outerHeight() > book.page.height) book.page.height = $(el).outerHeight();
		});
		//console.log(book.page.height);
		book.css({
			height: book.page.height,
			opacity:1
		})
	}

	function flipPage(displace){
		if(displace < 0) book.pageNumber+=displace;

		var selector = $(".book__page[data-page='"+book.pageNumber+"']");
		var o_selector = $(".book__obscurer[data-page='"+book.pageNumber+"']");
		var o_selector_next = $(".book__obscurer[data-page='"+(book.pageNumber+1)+"']");
		if(displace >= 0){
			selector.addClass('flipped');
			o_selector.addClass('flipped');
			o_selector.removeClass('show');
			o_selector_next.addClass('show');
		}
		else{
			selector.removeClass('flipped');
			o_selector.removeClass('flipped');
			o_selector.addClass('show');
			o_selector_next.removeClass('show');
		}
		if(displace >= 0) book.pageNumber+=displace;
		console.log(book.pageNumber);
	}

	function updateArrows(){
		if(book.pageNumber<=0) prevArrow.addClass('hidden');
		else prevArrow.removeClass('hidden');

		if(book.pageNumber>=(pages-1)) nextArrow.addClass('hidden');
		else nextArrow.removeClass('hidden');
	}
}

cardMaster.collection.renderList = function(){
	$(".view-switch[data-view='list']").addClass('active');
	$(".card-list").addClass('active');
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
		"flags",
		"to_sidedeck"
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
				case "to_sidedeck":
					if(cardMaster.getPage()!= "archive"){
						var cardField= $("<span>", {
							class: "card__"+el
						});
						var toSidedeck= $("<i>", {
							class: "fa fa-external-link",
							title: "Add to SideDeck"
						});
						toSidedeck.bind("click", function(){
							//adds card to sidedeck
							var cardID = $(this).closest(".row").data("id");
							cardMaster.sidedeck.addCard(cardID);
						});
						cardField.append(toSidedeck);
					}
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
		$(".card-content").addClass("loaded");
	});
};

cardMaster.collection.orderList = function(){
	var selector = $(".header > .sortable");
	selector.on("click", function(){
		if($(this).hasClass("sorted")){
			$(this).removeClass("sorted");
			cardMaster.cardFilter.orderBy = "";
			cardMaster.collection.loadList(cardMaster.collection.render);
		}
		else{
			selector.removeClass('sorted');
			$(this).addClass("sorted");
			cardMaster.cardFilter.orderBy = $(this).data("sort");
			cardMaster.collection.loadList(cardMaster.collection.render);
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
	var sortHeaders = $(".header > .sortable");
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
	});
	submit.on("click", function(){
		cardMaster.collection.loadList(cardMaster.collection.render);
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
		sortHeaders.removeClass("sorted");
		cardMaster.collection.loadList(cardMaster.collection.render);
	});
}

cardMaster.collection.iconBox = function(){
	var selector = $("#imageList");
	close = selector.find(".close");

	function changePage(newPage){
		cardMaster.imageLoader.page = newPage;
		$.ajax({
			url: "resources/php_scripts/getImageList.php",
			type: "GET",
			data: {page: cardMaster.imageLoader.page },
			dataType: 'html'
		})
		.done(function(data) {
			cardMaster.showMessage("Icon page loaded", "confirm");
			var pageData = JSON.parse(data);
			var header = selector.find(".header");
			var imgList = selector.find(".images");
			var commands = selector.find(".commands");
			//use data.image here
			header.html(pageData.header);
			imgList.html(pageData.list);
			commands.html(pageData.commands);
			selector.find(".iconImage").on("click", function(){
				cardMaster.collection.setImageToCard(imgList.data("row"), $(this).data("id"), $(this).prop("src"));
			});
			selector.find(".page:not(.current)").on("click", function(){
				var newPage = $(this).data("index");
				changePage(newPage);
			});
		})
		.fail(function() {
			cardMaster.showMessage("Error retrieving icon page", "error");
		})
	}

	close.on("click", function(){
		cardMaster.collection.hideIconBox();
	});
	changePage(1);
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

cardMaster.stickyPanel = function(){
	var selector = $(".control-area");
	var container = $(".card-content");
	$(document).on("scroll", function(){
		var tallContent = (container.outerHeight() > $(window).height());
		if(tallContent && $(document).scrollTop()>60){
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
	$image.on("error", function(){
		$image.prop("src", "./resources/img/card_parts/normal.png");
	});
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

cardMaster.collection.removeCardPreview = function(){
	var $selector = $("#updateCard");
	var $image = $selector.parent().find(".card_render");
	$image.prop("src", "");
}

cardMaster.combos.loadList = function(callback){

	var filters = cardMaster.comboFilter.toQueryString();
	//console.log(filters);

	$.ajax({
		url: "resources/php_scripts/getComboList.php",
		type: "GET",
		data: filters,
		dataType: 'json'
	})
	.done(function(data) {
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
			cardMaster.comboList.push(combo);
		});
		//console.dir(cardMaster.comboList);
		cardMaster.combos.updateCount();
		if(typeof callback === "function") callback();
	})
	.fail(function() {
		cardMaster.showMessage("Error retrieving combo list", "error");
	})

}

cardMaster.combos.renderList= function(){
	var selector = $("#comboList");
	//move edit box before wiping list
	$("#editComboBox").insertAfter(selector);
	//wipe cardList before render
	selector.html("");
	var tabFields = [
		"name",
		"card_number",
		"class",
		"commands",
		"content"
	];
	$.each(cardMaster.comboList, function(i,row){

		var comboRow = $("<div>", {
			class: "row combo",
			"data-id": row.id
		})
		var topComboRow = $("<div>", {
			class: "top"
		})
		var bottomComboRow = $("<div>", {
			class: "bottom"
		})
		//generate other rows and append them
		tabFields.forEach(function(el) {
			var textValue = row[el];
			switch(el){
				case "name":
					var name = row.getName().replace(/\\'/g, "'");
					var description = row.getDescription().replace(/\\'/g, "'");
					var comboField= $("<span>", {
						class: "combo__"+el,
						text: name,
						title: description
					});
					comboField.bind("click", function(){
						cardMaster.combos.cancelNewComboForm();
						cardMaster.combos.startEdit($(this));
					});
					topComboRow.append(comboField);
					break;
				case "card_number":
					var comboField= $("<span>", {
						class: "combo__"+el,
						text: row.cards.length+" cards"
					});
					topComboRow.append(comboField);
					break;
				case "class":
					var comboField= $("<span>", {
						class: "combo__"+el,
						text: cardMaster.classes[textValue].name,
						"data-index": textValue
					});
					topComboRow.append(comboField);
					break;
				case "commands":

					var show = $("<i>", {
						class: "fa fa-eye control show",
						title: "Show"
					});

					var toSideDeck = $("<i>", {
						class: "fa fa-external-link control sidedeck",
						title: "Add to SideDeck"
					});

					var duplicate = $("<i>", {
						class: "fa fa-files-o control duplicate",
						title: "Duplicate"
					});

					var remove = $("<i>", {
						class: "fa fa-remove control remove",
						title: "Delete"
					});

					var comboField= $("<span>", {
						class: "combo__"+el
					});

					show.on("click", function(){
						cardMaster.combos.startEdit($(this));
					});

					toSideDeck.on("click", function(){
						cardMaster.combos.cardsToSidedeck($(this));
					});

					duplicate.on("click", function(){
						cardMaster.combos.duplicateCombo($(this));
					});

					remove.on("click", function(){
						cardMaster.combos.deleteCombo($(this));
					});

					comboField.append(show);
					comboField.append(toSideDeck);
					comboField.append(duplicate);
					comboField.append(remove);
					topComboRow.append(comboField);
					break;
				case "content":
					var combo_content = "";
					var comboField= $("<div>", {
						class: "combo__"+el,
						html: combo_content
					});
					bottomComboRow.append(comboField);
					break;
				default:
					var comboField= $("<span>", {
						class: "combo__"+el,
						text: textValue
					});
					topComboRow.append(comboField);
			}

		});
		comboRow.append(topComboRow);
		comboRow.append(bottomComboRow);
		selector.append(comboRow);
	});
}

cardMaster.combos.updateCount = function(){
	var selector = $("#comboCount");
	var comboCount = cardMaster.comboList.length;
	selector.text(comboCount);
}

cardMaster.combos.toggleNewComboFormStatus = function(){
	var target = $(".new-combo");
	target.toggleClass('active');
}

cardMaster.combos.cancelNewComboForm = function(){
	var target = $(".new-combo");
	target.removeClass('active');
}

cardMaster.combos.toggleNewComboForm = function(){
	var target = $(".new-combo");
	var trigger = target.find(".new-combo__trigger");
	trigger.on("click", function(){
		cardMaster.combos.toggleNewComboFormStatus();
		cardMaster.combos.cancelEdit();
	});
}

cardMaster.combos.resetComboFormStatus = function(formSelector){
	var target = $(formSelector);
	var id = target.find("input[name='id']");
	var name = target.find("input[name='name']");
	var _class = target.find("select[name='class']");
	var cards = target.find("input[name='cards']");
	var description = target.find("textarea[name='description']");
	var select = target.find("select[name='newComboCard']");
	id.val("");
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
		cardMaster.combos.resetComboFormStatus("#newCombo");
		cardMaster.combos.toggleNewComboFormStatus();
	});
}

cardMaster.combos.addNewComboCard = function(){
	var trigger = $(".new-card-to-combo .btn");
	trigger.on("click", function(){
		var newCardForm = $(this).closest(".new-card-to-combo");
		var cardValue = newCardForm.find("select").val();
		var container = newCardForm.parent();
		var addedCard = $("<div>", {
						class: "added-card",
						"data-index": cardValue
					});
		var addedCardImg = $("<img>", {
						class: "cardZoom",
						src: "./resources/img/cardRenders/"+cardValue+".png"
					});
		var removeCardControl = $("<div>", {
						class: "remove-inline-card",
						html: "<i class='fa fa-remove'></i> Remove card"
					});
		addedCard.append(addedCardImg);
		addedCard.append(removeCardControl);
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

cardMaster.combos.removeComboCard = function(){
	var trigger = ".remove-inline-card";

	$(document).on("click", trigger, function(){
		var form = $(this).closest("form");
		var cardsField = form.find("input[name='cards']");
		var value = cardsField.val();
		if(value != ""){
			var valueArray = value.split("|");
			var target = $(this).parent().data("index");
			var removeIndex;
			valueArray.forEach(function(v,i){
				if(v == target) removeIndex = i;
			});
			if(removeIndex > -1){
				valueArray.splice(removeIndex,1);
				cardsField.val(valueArray.join("|"));
				$(this).parent().remove();
			}
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
				cardMaster.combos.resetComboFormStatus("#newCombo");
				cardMaster.combos.toggleNewComboFormStatus();
				cardMaster.combos.loadList(cardMaster.combos.renderList);
				cardMaster.showMessage(res, "confirm");
			}
		})
		.fail(function() {
			cardMaster.showMessage("Connection error", "error");
		})
	});
}

cardMaster.combos.startEdit = function(selRow){
	cardMaster.editMode = true;
	var row_selector = $("#comboList .combo");
	var base = selRow.closest(".row.combo");
	var rowID = base.data("id");
	var editBox = $("#editComboBox");
	var rowBottom = base.find(".combo__content");
	rowBottom.html("");
	editBox.appendTo(rowBottom);
	row_selector.removeClass('active');
	base.addClass("active");
	//console.log(rowID);

	var selectedCombo = cardMaster.getComboDataById(rowID);
	cardMaster.combos.resetComboFormStatus("#editComboBox");

	var id = editBox.find("input[name='id']");
	var name = editBox.find("input[name='name']");
	var _class = editBox.find("select[name='class']");
	var cards = editBox.find("input[name='cards']");
	var description = editBox.find("textarea[name='description']");
	var select = editBox.find("select[name='newComboCard']");
	var cardHolder = editBox.find(".added-cards-row");
	id.val(selectedCombo.id);
	name.val(selectedCombo.getName());
	_class.val(selectedCombo.class);
	cards.val(selectedCombo.cardsIdToString());
	description.val(selectedCombo.getDescription());
	var firstValue = select.find("option:first").val();
	select.val(firstValue);
	cardHolder.prepend(selectedCombo.getCardImages());
}

cardMaster.combos.sendChangeRequest = function(form){
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
				cardMaster.combos.resetComboFormStatus();
				$("#editComboBox").insertAfter("#comboList");
				cardMaster.combos.loadList(cardMaster.combos.renderList);
				cardMaster.showMessage(res, "confirm");
				cardMaster.editMode = false;
			}
		})
		.fail(function() {
			cardMaster.showMessage("Connection error", "error");
		})
};

cardMaster.combos.cancelEdit = function(){
	var row_selector = $("#comboList .combo");
	row_selector.removeClass('active');
	cardMaster.combos.resetComboFormStatus("#editComboBox");
	$("#editComboBox").insertAfter("#comboList");
	cardMaster.editMode = false;
}

cardMaster.combos.editControls = function(){
	var saveSelector = $("#editComboBox .edit-combo__save");
	var cancelSelector = $("#editComboBox .edit-combo__cancel");

	saveSelector.on("click", function(){
		cardMaster.combos.sendChangeRequest($("#editCombo"));
	});

	cancelSelector.on("click", function(){
		cardMaster.combos.cancelEdit();
	});
}

cardMaster.combos.cardsToSidedeck = function(selRow){
	var base = selRow.closest(".row.combo");
	var rowID = base.data("id");
	var cards = cardMaster.getComboDataById(rowID).cards;
	for(var cardID in cards){
		cardMaster.sidedeck.addCard(cards[cardID]);
	}
}

cardMaster.combos.duplicateCombo = function(selRow){
	var base = selRow.closest(".row.combo");
	var rowID = base.data("id");
	$.ajax({
		url: "resources/php_scripts/duplicate_combo.php",
		type: "POST",
		dataType: 'text',
		data: "id="+rowID
	})
	.done(function(res) {
		if(res == "data_error"){
			cardMaster.showMessage("Error updating DB", "error");
		}
		else{
			cardMaster.combos.resetComboFormStatus();
			$("#editComboBox").insertAfter("#comboList");
			cardMaster.combos.loadList(cardMaster.combos.renderList);
			cardMaster.showMessage(res, "confirm");
		}
	})
	.fail(function() {
		cardMaster.showMessage("Connection error", "error");
	})
}

cardMaster.combos.deleteCombo = function(selRow){
	var base = selRow.closest(".row.combo");
	var rowID = base.data("id");
	$.ajax({
		url: "resources/php_scripts/modify_combo.php",
		type: "POST",
		dataType: 'text',
		data: {id: rowID, mode: "delete" },
	})
	.done(function(res) {
		if(res == "data_error"){
			cardMaster.showMessage("Error updating DB", "error");
		}
		else{
			cardMaster.combos.resetComboFormStatus();
			$("#editComboBox").insertAfter("#comboList");
			cardMaster.combos.loadList(cardMaster.combos.renderList);
			cardMaster.showMessage(res, "confirm");
		}
	})
	.fail(function() {
		cardMaster.showMessage("Connection error", "error");
	})
}

cardMaster.combos.orderList = function(){
	var selector = $(".header > .sortable");
	selector.on("click", function(){
		if($(this).hasClass("sorted")){
			$(this).removeClass("sorted");
			cardMaster.comboFilter.orderBy = "";
			cardMaster.combos.loadList(cardMaster.combos.renderList);
		}
		else{
			selector.removeClass('sorted');
			$(this).addClass("sorted");
			cardMaster.comboFilter.orderBy = $(this).data("sort");
			cardMaster.combos.loadList(cardMaster.combos.renderList);
		}
	});
}

cardMaster.combos.addFilters = function(){
	var selector = $("#filterTrigger");
	var textSearch = $("#textSearch");
	var classSearch = $(".filter_panel .card_class");
	var cardSearch = $(".filter_panel [name='checkCard']");
	var sortHeaders = $(".header > .sortable");
	//deselect
	classSearch.val(0);
	cardSearch.val(0);

	submit = $("#submitFilter");
	reset = $("#resetFilter");
	selector.on("click", function(){
		$(this).parent().toggleClass('active');
	});
	textSearch.on("change", function(){
		cardMaster.comboFilter.lemma = $(this).val();
	});
	classSearch.on("change", function(){
		cardMaster.comboFilter.class = $(this).val();
	});
	cardSearch.on("change", function(){
		cardMaster.comboFilter.card = $(this).val();
	});
	submit.on("click", function(){
		cardMaster.combos.loadList(cardMaster.combos.renderList);
	});
	reset.on("click", function(){
		cardMaster.comboFilter.reset();
		textSearch.val("");
		classSearch.val(0);
		cardSearch.val(0);
		sortHeaders.removeClass("sorted");
		cardMaster.combos.loadList(cardMaster.combos.renderList);
	});
}

cardMaster.summary.structureArray = function(callback){
	//base structure
	cardMaster.summary["general"] = {"content": new _block};
	cardMaster.summary["classes"] = {};

	for (var c_key in cardMaster.classes) {
		var archetypeNode = {};
		for (var a_key in cardMaster.archetypes) {
			var classRef = cardMaster.archetypes[a_key];
			if(classRef["class"] == c_key){
				archetypeNode[a_key] = {"name": classRef["name"], "content":new _block};
			}
		}
		if(c_key == 1){
			cardMaster.summary["classes"][c_key] = {"name": cardMaster.classes[c_key]["name"], "content":new _block};
		}
		else{
			cardMaster.summary["classes"][c_key] = {"name": cardMaster.classes[c_key]["name"], "content":new _block, "archetypes":archetypeNode};
		}
	}
	if(typeof callback === "function"){
		callback();
	}
}

cardMaster.summary.populateArray = function(callback){
	var node = cardMaster.summary["general"];
	var classNodes = cardMaster.summary["classes"];
	cardMaster.cardList.forEach(function(card){
		var ctx = node["content"];
		cardMaster.summary.getNodeCounts(ctx, card);
		var class_node = classNodes[card.class];
		var class_ctx = class_node["content"];
		cardMaster.summary.getNodeCounts(class_ctx, card);
		if(card.class != 1){
			//Neutral cards have no archetype
			var arch_node = class_node.archetypes[card.archetype];
			if(arch_node){
				var archetype_ctx = arch_node["content"];
				cardMaster.summary.getNodeCounts(archetype_ctx, card);
			}
		}
	});
	if(typeof callback === "function"){
		callback();
	}
}

cardMaster.summary.renderBoxes = function(){
	console.log("render page");
	function getRow(_class,_archetype){
		var rowType = _class.toLowerCase();
		if(_archetype) rowType += " sub"
		var obj = $("<div>", {
			class: "row "+rowType,
			"data-class" : _class.toLowerCase()
		});
		return obj;
	}
	function getMainBox(options){
		var self = this;
		self.class = options.class.toLowerCase() || "general";
		self.archetype = options.archetype || false;
		self.total = options.total || 0;
		self.types = options.types || [];
		var obj = $("<div>", {
			class: "main_box " + self.class,
		});
		var boxTitle = self.class;
		if(self.archetype) boxTitle = self.archetype;
		obj.title = $("<div>", {
			class: "main_title",
			text: boxTitle
		});
		obj.append(obj.title);
		obj.total = $("<div>", {
			class: "main_total",
			text: self.total
		});
		obj.append(obj.total);
		obj.total_label = $("<div>", {
			class: "main_total_label",
			text: "total"
		});
		obj.append(obj.total_label);
		if(self.class != "general"){
			var cornerName = self.class.toLowerCase();
			obj.corner = {};
			if(self.archetype){
				cornerName=cornerName+"_"+self.archetype;
			}
			else cornerName=cornerName+"_neutral";
			for(var i = 0; i < 4; i++){
				obj.corner[i] = $("<img>", {
					class: "corner corner_"+i,
					src: "resources/img/card_parts/borders/"+cornerName+".png"
				});
				obj.append(obj.corner[i]);
			}
		}
		for(type in self.types){
			var options = {};
			options.icon = false;
			options.name = cardMaster.types[type].name;
			options.count = self.types[type];
			var detailElement = getDetailElem(options);
			obj.append(detailElement);
		}
		if(self.class != "general" && self.class != "neutral" && !self.archetype){
			obj.details = $("<div>", {
				class: "show_more "+self.class.toLowerCase(),
				html: "<i class='fa fa-eye'></i>"
			});
			obj.append(obj.details);
			obj.details.on("click",function(){
				var target = $(this).closest(".row").data("class");
				$(".row."+target+".sub").toggleClass("collapsed");
				$(".row."+target+".sub").each(function(){
					//animation collapse???
					var newH = "0";
					if(!$(this).hasClass("collapsed")){
						newH = $(this).data("height");
					}
					$(this).css({"max-height" : newH});
				});
			})
		}
		return obj;
	}

	function getElemBox(options){
		var self = this;
		self.type = options.type || false;
		self.class = options.class || "general";
		self.archetype = options.archetype || false;
		self.blocks = options.blocks || [];
		var obj = $("<div>", {
			class: "main_detail_box " + self.class,
		});
		obj.title = $("<div>", {
			class: "main_title",
			text: self.type
		});
		obj.append(obj.title);
		if(self.class != "general"){
			var cornerName = self.class.toLowerCase();
			obj.corner = {};
			if(self.archetype){
				cornerName=cornerName+"_"+self.archetype;
			}
			else cornerName=cornerName+"_neutral";
			for(var i = 0; i < 4; i++){
				obj.corner[i] = $("<img>", {
					class: "corner corner_"+i,
					src: "resources/img/card_parts/borders/"+cornerName+".png"
				});
				obj.append(obj.corner[i]);
			}
		}

		for(block in self.blocks){
			var options = {};
			if(self.type){
				if(self.type != "flags"){
					options.icon = self.type+"/"+cardMaster[self.type][block].path;
				}
				var blockName = cardMaster[self.type][block].name;
				if(blockName){
					options.name = blockName;
					options.count = self.blocks[block];
				}
			}
			var detailElement = getDetailElem(options);
			obj.append(detailElement);
		}
		return obj;
	}

	function getDetailElem(options){
		var self = this;
		self.icon = options.icon || false;
		self.name = options.name || "";
		self.count = options.count || 0;
		var obj = $("<div>", {
			class: "detail_box " + self.name.toLowerCase(),
		});
		if(self.icon){
			obj.icon = $("<img>", {
				class: "detail_icon",
				src: "resources/img/card_parts/"+self.icon,
				title: self.name
			});
			obj.append(obj.icon);
			obj.total = $("<div>", {
				class: "detail_total",
				text: self.count
			});
			obj.append(obj.total);
		}
		else{
			obj.total = $("<div>", {
				class: "detail_total",
				text: self.count
			});
			obj.append(obj.total);

			obj.title = $("<div>", {
				class: "detail_title",
				text: self.name
			});
			obj.append(obj.title);
		}
		return obj;
	}

	function generateRow(_class,_archetype,node){
		var row = getRow(_class,_archetype);
		var options = {};
		options.class = _class;
		options.archetype = _archetype;
		options.total = node.getTotal();
		options.types = node.types;
		var generalElement = getMainBox(options);
		row.append(generalElement);
		//detail blocks
		var detailsTypes = ["categories", "triggers", "attributes", "flags"];
		for(dT in detailsTypes){
			var options = {};
			options.type = detailsTypes[dT];
			options.class = _class;
			options.archetype = _archetype;
			options.blocks = node[options.type];
			var detailElement = getElemBox(options);
			row.append(detailElement);
		}
		selector.append(row);
		//set row height
		var maxH = 0;
		row.children(".main_box, .main_detail_box").each(function(){
			var h = $(this).outerHeight();
			if(h>maxH) maxH = h;
		});
		row.children(".main_box, .main_detail_box").css({height:maxH+"px"});
		row.attr("data-height", maxH);
		if(row.hasClass('sub')) row.addClass('collapsed');
	}

	var selector = $(".summary");
	var node = cardMaster.summary.general.content;
	var classNodes = cardMaster.summary.classes;
	//main block
	generateRow("general",false,node);

	for(cn in classNodes){
		var nodeContent = classNodes[cn].content;
		generateRow(classNodes[cn].name,false,nodeContent);
		var archetypeNodes = classNodes[cn].archetypes;
		for(an in archetypeNodes){
			var nodeContent = archetypeNodes[an].content;
			generateRow(classNodes[cn].name,archetypeNodes[an].name,nodeContent);
		}
	}
}

cardMaster.summary.getNodeCounts = function(ctx, card){
			//card type
		if(ctx.types[card.type] || ctx.types[card.type] > 0){
			ctx.types[card.type]++;
		}
		else ctx.types[card.type] = 1;
		//categories
		for( var category in cardMaster.categories){
			var cat = cardMaster.categories[category];
			if(card.is(cat.name)){
				if(ctx.categories[category] || ctx.categories[category] > 0){
					ctx.categories[category]++;
				}
				else ctx.categories[category] = 1;
			}
		}
		//triggers
		for( var trigger in cardMaster.triggers){
			var trig = cardMaster.triggers[trigger];
			if(card.has(trig.selector)){
				if(ctx.triggers[trigger] || ctx.triggers[trigger] > 0){
					ctx.triggers[trigger]++;
				}
				else ctx.triggers[trigger]= 1;
			}
		}
		//attributes
		for( var attribute in cardMaster.attributes){
			var attr = cardMaster.attributes[attribute];
			if(card.has(attr.selector)){
				if(ctx.attributes[attribute] || ctx.attributes[attribute] > 0){
					ctx.attributes[attribute]++;
				}
				else ctx.attributes[attribute]= 1;
			}
		}
		//flags
		for( var flag in cardMaster.flags){
			var fl = flag;
			if(card.has_flag(fl)){
				if(ctx.flags[flag] || ctx.flags[flag] > 0){
					ctx.flags[flag]++;
				}
				else ctx.flags[flag]= 1;
			}
		}
}

cardMaster.sidedeck.syncLocalStorage = function(callback){
	var status = localStorage.sidedeck;
	if(status !== undefined){
		cardMaster.sidedeck.cards = JSON.parse(status);
		if(typeof callback === "function"){
			callback();
		}
	}
	console.log(cardMaster.sidedeck.cards);
}

cardMaster.sidedeck.updateLocalStorage = function(){
	var status = JSON.stringify(cardMaster.sidedeck.cards);
	localStorage.sidedeck = status;
	//console.log(localStorage.sidedeck);
}

cardMaster.sidedeck.addRandomCard = function(_class){
	//console.log(_class);
	var r_card = cardMaster.getRandomCardDataByClass(_class);
	var cardName = r_card .getName();
	//console.log(r_card);
	cardMaster.sidedeck.addCard(r_card.id);
}

cardMaster.sidedeck.addCard = function(cardID){
	var cardID = parseInt(cardID);
	var deck = cardMaster.sidedeck.cards;
	var cardName = cardMaster.getCardDataById(cardID);
	if(typeof cardName === "object") cardName = cardName.getName();
	var index = deck.indexOf(cardID);
	if(index > -1){
		console.log("Card '"+cardName+"' is already in SideDeck");
	}
	else{
		deck.push(cardID);
		console.log("Card '"+cardName+"' has been added to SideDeck!");
		cardMaster.sidedeck.updateLocalStorage();
		cardMaster.animation.cardToSidedeck();
		cardMaster.sidedeck.renderList("#sideDeck .sidedeck-body");
	}
}

cardMaster.sidedeck.removeCard = function(cardID){
	var cardID = parseInt(cardID);
	var deck = cardMaster.sidedeck.cards;
	var cardName = cardMaster.getCardDataById(cardID);
	if(typeof cardName === "object") cardName = cardName.getName();
	var index = deck.indexOf(cardID);
	if(index > -1){
		var index = deck.indexOf(cardID);
		if (index > -1) {
		    deck.splice(index, 1);
			console.log("Card '"+cardName+"' has been removed from SideDeck!");
			cardMaster.sidedeck.updateLocalStorage();
			cardMaster.sidedeck.renderList("#sideDeck .sidedeck-body");
		}
	}
	else{
		console.log("Card '"+cardName+"' is not in SideDeck");
	}
}

cardMaster.sidedeck.empty = function(){
	cardMaster.sidedeck.cards = [];
	cardMaster.sidedeck.updateLocalStorage();
}

cardMaster.sidedeck.sortList = function(){
	cardMaster.sidedeck.cards.sort(function(a,b){
		var a = cardMaster.getCardDataById(a);
		var b = cardMaster.getCardDataById(b);
		if(a.class < b.class) return -1;
		else return 1;
	});
	cardMaster.sidedeck.updateLocalStorage();
	cardMaster.sidedeck.renderList("#sideDeck .sidedeck-body");
}

cardMaster.sidedeck.manualSortList = function(changedIndex){
	var currentListCards = $("#sideDeck .sidedeck-body").find(".sidedeck-card");
	//get original index (changedIndex)
	//check where the row with the changedIndex is now
	//add the element to that index
	//remove element from the original index
	var position;
	$(currentListCards).each(function(i, el) {
		if(el.dataset.index == changedIndex & !position){
			position = i;
		}
	});
	//debugState();
	var movingElement = cardMaster.sidedeck.cards[changedIndex];
	cardMaster.sidedeck.cards.splice(changedIndex,1);
	cardMaster.sidedeck.cards.splice(position,0,movingElement);
	//debugState();
	cardMaster.sidedeck.updateLocalStorage();
	cardMaster.sidedeck.renderList("#sideDeck .sidedeck-body");

	function debugState(){
		console.log("---STATE----------------");
		cardMaster.sidedeck.cards.forEach(function(el) {
			var name = cardMaster.getCardDataById(el).getName();
			console.log(name);
		});
	}
}


cardMaster.sidedeck.renderList = function(ctx){
	var cards = cardMaster.sidedeck.cards;
	$(ctx).html("");
	var originalIndex = 0;
	for(var c_i in cards){
		var c = cardMaster.getCardDataById(cards[c_i]);
		var row = $("<div>",{
			class: "sidedeck-card",
			"data-id": cards[c_i],
			"data-index": originalIndex
		});
		originalIndex++;
		row.class = $("<div>",{
			class: "sidedeck-class"
		}).css({
			background: cardMaster.classes[c.class].color
		});
		row.icon = $("<img>",{
			class: "sidedeck-icon",
			src: c.image,
			alt: c.getName()
		});
		row.name = $("<div>",{
			class: "sidedeck-name",
			text: c.getName().replace(/\\'/g, "'")
		});
		row.show = $("<div>",{
			class: "sidedeck-show sidedeck-command cardZoom",
			html: "<i class='fa fa-eye'></i>",
			"data-img": "./resources/img/cardRenders/"+c.id+".png"
		});
		row.remove = $("<div>",{
			class: "sidedeck-remove sidedeck-command",
			html: "<i class='fa fa-remove'></i>"
		});

		row.append(row.class);
		row.append(row.icon);
		row.append(row.name);
		row.append(row.show);
		row.append(row.remove);
		$(ctx).append(row);

		row.remove.on("click", function(){
			var rowID = $(this).closest(".sidedeck-card").data("id");
			//console.log(rowID);
			cardMaster.sidedeck.removeCard(rowID);
		})

		function addElement(el){
			var elementID = cardMaster.sandbox.generateID(el);
			var typeOffset = {};
				typeOffset.x = 75;
				typeOffset.y = 50;
			var randomDisplace = 20;
			var randomOffset = {};
				randomOffset.x = Math.floor((Math.random() * randomDisplace) + 1);
				randomOffset.y = Math.floor((Math.random() * randomDisplace) + 1);
			var options = {};
				options.id = elementID;
				options.type = "card";
				options.value = el.id;
				options.x = cardMaster.sandbox.spawnPoint.x - typeOffset.x + randomOffset.x;
				options.y = cardMaster.sandbox.spawnPoint.y - typeOffset.y + randomOffset.y;
				options.z = cardMaster.sandbox.getTopZ() + 1;
			cardMaster.sandbox.addElement(options);
		}

		if(cardMaster.getPage() == "sandbox"){
			row.icon.on("click", function(){
				var id = $(this).closest(".sidedeck-card").data("id");
				var c = cardMaster.getCardDataById(id);
				addElement(c);
			});
			row.name.on("click", function(){
				var id = $(this).closest(".sidedeck-card").data("id");
				var c = cardMaster.getCardDataById(id);
				addElement(c);
			});
			row.icon.addClass('clickable');
			row.name.addClass('clickable');
		};
		//console.log(c);
	}
	$(ctx).sortable({
		placeholder: "sidedeck-sort-placeholder",
		stop: function( event, ui ) {
			var changedIndex = ui.item.data("index");
			cardMaster.sidedeck.manualSortList(changedIndex);
		}
	}).disableSelection();
	$("#sideDeck .sidedeck-count").text(cards.length + " cards");
}

cardMaster.sidedeck.toggleLocalStatus = function(){
	var status = (localStorage.sidedeck_isToggled == "true");
	localStorage.sidedeck_isToggled = !status;
	//console.log(localStorage.sidedeck_isToggled);
};

cardMaster.sidedeck.commonElements = {
	"healthToken" : function(value){
		var el = new _token({"type":"health", "value": value});
		el.$ = $("<div>", {
			class: "_token _token_health",
			html: "<i class='fa fa-heart'></i><span>"+value+"</span>",
			"data-value": value,
			"data-type": "token.health",
			title: value + " Health"
		});
		return el;
	},
	"simpleToken" : function(){
		var el = new _token({"type":"token"});
		el.$ = $("<div>", {
			class: "_token _token_simple",
			html: "<i class='fa fa-user'></i>",
			"data-value": "0",
			"data-type": "token.simple",
			title: "Token"
		});
		return el;
	}
};

cardMaster.sidedeck.updateNotes = function(text){
	localStorage.sidedeck_notes = text;
}

cardMaster.sidedeck.init = function(){
	var notes = localStorage.sidedeck_notes || "";
	var sideDeck = $("<div>", {
		id: "sideDeck"
	});
	if(localStorage.sidedeck_isToggled == "true") sideDeck.addClass('active');
	sideDeck.trigger = $("<div>", {
		class: "sidedeck-trigger",
		html: "<i class='fa fa-hand-o-down'></i><i class='fa fa-list-ul'></i>"
	});
	sideDeck.wrapper = $("<div>", {
		class: "sidedeck-wrapper"
	});
	sideDeck.header = $("<div>", {
		class: "sidedeck-header",
		html: "<span class='title'>SideDeck</span>"
	});
	sideDeck.count = $("<span>", {
		class: "sidedeck-count",
		text: "0 cards"
	});
	sideDeck.sort = $("<div>", {
		class: "sidedeck-sort",
		html: "<i class='fa fa-sort'></i>",
		title: "Sort list"
	});
	sideDeck.header.append(sideDeck.count);
	sideDeck.header.append(sideDeck.sort);
	sideDeck.commonElements = $("<div>", {
		class: "sidedeck-commons"
	});
	sideDeck.health_token1 = cardMaster.sidedeck.commonElements.healthToken(1);
	sideDeck.health_token5 = cardMaster.sidedeck.commonElements.healthToken(5);
	sideDeck.simple_token = cardMaster.sidedeck.commonElements.simpleToken();

	sideDeck.body = $("<div>", {
		class: "sidedeck-body"
	});
	sideDeck.caption = $("<div>", {
		class: "sidedeck-caption",
		html: "<span class='title'></span>"
	});
	sideDeck.randomCaption = sideDeck.caption.clone();
	sideDeck.randomCaption.find(".title").text("Add random card");
	sideDeck.randomRow = $("<div>", {
		class: "sidedeck-random-row"
	});
	sideDeck.randomCard = $("<div>", {
		class: "sidedeck-random-card"
	});
	for(c in cardMaster.classes){
		var newRandomCard = sideDeck.randomCard.clone();
		newRandomCard.attr("data-class", c);
		newRandomCard.attr("title", "Add "+cardMaster.classes[c].name + " card");
		newRandomCard.css({
			"background-color": cardMaster.classes[c].color
		});
		sideDeck.randomRow.append(newRandomCard);
	}
	var newRandomCard = sideDeck.randomCard.clone();
	newRandomCard.attr("data-class", "none");
	newRandomCard.attr("title", "Add a random card");
	newRandomCard.html("<i class='fa fa-star'></i>");
	sideDeck.randomRow.append(newRandomCard);

	sideDeck.randomRow.find(".sidedeck-random-card").on("click", function(){
		var classRef = $(this).data("class");
		cardMaster.sidedeck.addRandomCard(classRef);
	})

	sideDeck.footer = sideDeck.caption.clone();
	sideDeck.footer.find(".title").text("Comandi");
	sideDeck.emptyList = $("<div>", {
		class: "sidedeck-command-line sidedeck-empty-list",
		html: "<i class='fa fa-times-circle'></i> Svuota SideDeck"
	});
	sideDeck.wipeBoard = $("<div>", {
		class: "sidedeck-command-line sidedeck-wipe-board",
		html: "<i class='fa fa-ban'></i> Svuota Sandbox"
	});
	sideDeck.confirm = $("<div>", {
		class: "confirm",
		html: "<i class='fa fa-check'></i>"
	});
	sideDeck.cancel = $("<div>", {
		class: "cancel",
		html: "<i class='fa fa-remove'></i>"
	});
	sideDeck.notesCaption = sideDeck.caption.clone();
	sideDeck.notesCaption.find(".title").text("Notes");
	sideDeck.notes = $("<textarea>", {
		class: "sidedeck-notes",
		placeholder: "Notes...",
		text: notes
	});
	sideDeck.append(sideDeck.trigger);
	sideDeck.wrapper.append(sideDeck.header);
	if(cardMaster.getPage() == "sandbox"){
		sideDeck.commonElements.append(sideDeck.health_token1.$);
		sideDeck.commonElements.append(sideDeck.health_token5.$);
		sideDeck.commonElements.append(sideDeck.simple_token.$);
		sideDeck.wrapper.append(sideDeck.commonElements);
	}
	sideDeck.wrapper.append(sideDeck.body);
	if(cardMaster.getPage() == "sandbox"){
		sideDeck.wrapper.append(sideDeck.randomCaption);
		sideDeck.wrapper.append(sideDeck.randomRow);
	}
	sideDeck.wrapper.append(sideDeck.footer);
	sideDeck.emptyList.append(sideDeck.confirm.clone());
	sideDeck.emptyList.append(sideDeck.cancel.clone());
	sideDeck.wrapper.append(sideDeck.emptyList);
	if(cardMaster.getPage() == "sandbox"){
		sideDeck.wipeBoard.append(sideDeck.confirm.clone());
		sideDeck.wipeBoard.append(sideDeck.cancel.clone());
		sideDeck.wrapper.append(sideDeck.wipeBoard);
	}
	sideDeck.wrapper.append(sideDeck.notesCaption);
	sideDeck.wrapper.append(sideDeck.notes);

	sideDeck.append(sideDeck.wrapper);
	$("body").append(sideDeck);

	sideDeck.sort.on("click", function(){
		cardMaster.sidedeck.sortList();
	});

	//shows command row confirm buttons
	$(".sidedeck-command-line").on("click", function(){
		$(this).addClass('active');
	});
	//cancel command row action
	$(".sidedeck-command-line .cancel").on("click", function(event){
		event.stopImmediatePropagation();
		$(this).parent().removeClass('active');
	});
	//confirm empty sidedeck
	sideDeck.emptyList.find(".confirm").on("click", function(event){
		event.stopImmediatePropagation();
		cardMaster.sidedeck.empty();
		$("#sideDeck").find(".sidedeck-body").html("");
		$(this).parent().removeClass('active');
	});
	if(cardMaster.getPage() == "sandbox"){
		//confirm empty sandbox
		sideDeck.wipeBoard.find(".confirm").on("click", function(event){
			event.stopImmediatePropagation();
			cardMaster.sandbox.empty();
			$("#sandbox").find(".element").remove();
			$(this).parent().removeClass('active');
		});
	}
	sideDeck.notes.on("keyup", function(){
		var text = $(this).val();
		cardMaster.sidedeck.updateNotes(text);
	});

	function addElement(el){
		var elementID = cardMaster.sandbox.generateID(el);
		//console.log(elementID);
		var typeOffset = {};
			typeOffset.x = 14;
			typeOffset.y = 14;
		var randomDisplace = 20;
		var randomOffset = {};
			randomOffset.x = Math.floor((Math.random() * randomDisplace) + 1);
			randomOffset.y = Math.floor((Math.random() * randomDisplace) + 1);
		var options = {};
			options.id = elementID;
			options.type = el.type;
			options.value = el.value;
			options.x = cardMaster.sandbox.spawnPoint.x - typeOffset.x + randomOffset.x;
			options.y = cardMaster.sandbox.spawnPoint.y - typeOffset.y + randomOffset.y;
			options.z = cardMaster.sandbox.getTopZ() + 1;
		cardMaster.sandbox.addElement(options);
	}

	sideDeck.health_token1.$.on("click", function(){
		addElement(sideDeck.health_token1);
	});
	sideDeck.health_token5.$.on("click", function(){
		addElement(sideDeck.health_token5);
	});
	sideDeck.simple_token.$.on("click", function(){
		addElement(sideDeck.simple_token);
	});

	sideDeck.trigger.on("click", function(){
		sideDeck.toggleClass('active');
		cardMaster.sidedeck.toggleLocalStatus();
	});

}

cardMaster.sandbox.generateID = function(el){
	var count = cardMaster.sandbox.elements.length+1;
	var id = el.constructor.name +"_"+ count;
	return id;
}

cardMaster.sandbox.init = function(callback){
	cardMaster.sandbox.spawnPoint = {};
	var spawn = cardMaster.sandbox.spawnPoint;
	var sandbox = $("#sandbox");
	spawn.x = sandbox.outerWidth()/2;
	spawn.y = sandbox.outerHeight()/3;

	var visualPoint = $("<div>", {
		class:"debug-point"
	}).css({
		position: "absolute",
		left: spawn.x,
		top: spawn.y,
		background: "grey",
		width: "10px",
		height: "10px",
		"border-radius": "50%",
		transform: "translate(-50%, -50%)"
	});

	sandbox.append(visualPoint);
	if (typeof callback === "function"){
		callback();
	}
}

cardMaster.sandbox.syncLocalStorage = function(callback){
	var status = localStorage.sandbox;
	if(status !== undefined){
		var statusOBJ = JSON.parse(status);
		statusOBJ.forEach(function(obj){
			cardMaster.sandbox.elements.push(new _sandboxItem(obj));
		});
		if(typeof callback === "function"){
			callback();
		}
	}
	console.log(cardMaster.sandbox.elements);
}

cardMaster.sandbox.updateLocalStorage = function(){
	var status = JSON.stringify(cardMaster.sandbox.elements);
	localStorage.sandbox = status;
	//console.log(localStorage.sandbox);
}

cardMaster.sandbox.empty = function(){
	cardMaster.sandbox.elements = [];
	cardMaster.sandbox.updateLocalStorage();
}

cardMaster.sandbox.addElement = function(options){
	var element = new _sandboxItem(options);
	cardMaster.sandbox.elements.push(element);
	cardMaster.sandbox.updateLocalStorage();
	cardMaster.sandbox.renderElement(element);
	//console.log(element);
}

cardMaster.sandbox.removeElement = function(elementID){
	var list = cardMaster.sandbox.elements;
	var removeIndex = false;
	for(var i in cardMaster.sandbox.elements){
		if(cardMaster.sandbox.elements[i].id == elementID){
			var removeIndex = i;
			break;
		}
	}
	if(removeIndex && removeIndex > -1){
		var elName = cardMaster.sandbox.elements[removeIndex];
	    list.splice(removeIndex, 1);
		console.log("Element '"+elName+"' has been removed from Sandbox!");
		cardMaster.sandbox.updateLocalStorage();
	}
}

cardMaster.sandbox.getTopZ = function(){
	var maxZ = 0;
	for( var i in cardMaster.sandbox.elements){
		var z = parseInt(cardMaster.sandbox.elements[i].z);
		if(z > maxZ) maxZ = z;
	}
	return maxZ;
}

cardMaster.sandbox.renderElement = function(el){
	//console.log(el);
	var selector = $("#sandbox");

	var element = $("<div>", {
		class: "element "+el.type,
		"data-id" : el.id,
		"data-value" : el.value
	}).css({
		position:"absolute",
		top: el.y,
		left: el.x,
		"z-index": el.z,
	});
	if(el.width){
		element.addClass(el.width);
	}
	//set also width
	element.commands = $("<div>", {
		class: "commands"
	});
	switch(el.type){
		case "card":
			var obj = cardMaster.getCardDataById(el.value);
			element.content = $("<img>", {
				class: "image",
				src : "./resources/img/cardRenders/"+el.value+".png?n="+Date.now()
			});
			element.thumb = $("<img>", {
				class: "thumb",
				src : "./"+obj.image,
				title : obj.getName()
			});
			element.content.on("error", function(){
				element.content.prop("src", "./resources/img/card_parts/normal.png");
			});
			element.show = $("<div>", {
				class: "show cardZoom",
				html: "<i class='fa fa-eye'></i>",
				"data-img": "./resources/img/cardRenders/"+el.value+".png"
			});
			element.commands.append(element.show);
			break;
		case "health":
			element.content = cardMaster.sidedeck.commonElements.healthToken(el.value).$;
			break;
		case "token":
			element.content = cardMaster.sidedeck.commonElements.simpleToken().$;
			break;
		default:
			console.log("nothing here");
	}
	element.remove = $("<div>", {
		class: "remove",
		html: "<i class='fa fa-remove'></i>"
	});
	element.commands.append(element.remove);
	element.append(element.content);
	if(element.thumb) element.append(element.thumb);
	element.append(element.commands);
	selector.append(element);
	element.remove.on("click", function(){
		var id = $(this).closest(".element").data("id");
		cardMaster.sandbox.removeElement(id);
		$(this).closest(".element").remove();
	});
	element.draggable({
		containment: "parent",
		start: function(event, ui){
			var topZ = cardMaster.sandbox.getTopZ() + 1;
			el.z = topZ;
			element.css({
				"z-index": topZ
			});
			//checks if element has linked elements and set initial offset for them
			el.linked_elements.forEach(function(linkedID){
				topZ = cardMaster.sandbox.getTopZ() + 1;
				var child = cardMaster.sandbox.getElementByID(linkedID);
				if(child){
					child = cardMaster.sandbox.updateElementByID(linkedID, {
						z: topZ,
						offsetX: child.x - ui.position.left,
						offsetY: child.y - ui.position.top
					});
					var childElement = $(".element[data-id='"+linkedID+"']")
					childElement.css({
						"z-index": topZ
					});
				}
				else el.removeLinkedElement(linkedID);
			});
		},
		drag: function(event, ui){
			//checks if element has linked elements and move them as well
			el.linked_elements.forEach(function(linkedID){
				var child = cardMaster.sandbox.getElementByID(linkedID);
				if(child){
					child = cardMaster.sandbox.updateElementByID(linkedID, {
						x : ui.position.left + child.offsetX,
						y : ui.position.top + child.offsetY
					});
					var childElement = $(".element[data-id='"+linkedID+"']")
					childElement.css({
						"left": child.x,
						"top": child.y
					});
				}
			});
		},
		stop: function( event, ui ) {
			el.x = ui.position.left;
			el.y = ui.position.top;
			cardMaster.sandbox.updateLocalStorage();
		}
	});
	if(el.type == "card"){
		element.resizable({
	      grid: 50,
	      maxWidth: 190,
	      stop: function( event, ui ) {
	      	var newSize = ui.size.width;
	      	var element = ui.element;
	      	var sizeClass = getClassName(newSize);
	      	swapSize(element, sizeClass);
	      	cardMaster.sandbox.updateElementSize(el, sizeClass);
	      }
	    });

	    element.droppable({
	    	accept: ".element.token, .element.health",
	    	drop: function(event, ui){
				//console.log("dropped");
				var addID = ui.draggable.data("id");
				el.addLinkedElement(addID);
				//console.log(el.linked_elements);
	    	},
	    	out: function(event, ui){
	    		//console.log("removed");
	    		var removeID = ui.draggable.data("id");
	    		el.removeLinkedElement(removeID);
	    		//console.log(el.linked_elements);
	    	}
	    });

	    function getClassName(size){
	    	var steps= {
	    		40: "thumb",
	    		90: "small",
	    		140: "normal",
	    		190: "big"
	    	};
	    	if(steps[size]) return steps[size];
	    	else return "normal";
	    }

	    function swapSize(el, newSize){
	    	el.removeClass('thumb').removeClass('small').removeClass('normal').removeClass('big');
	    	el.addClass(newSize);
	    }
	}
}

cardMaster.sandbox.getElementByID = function(elemID){
	var found = undefined;
	cardMaster.sandbox.elements.forEach(function(el){
		if(el.id == elemID){
			found = el;
		}
	});
	return found;
}

cardMaster.sandbox.updateElementByID = function(elemID, options){
	var found = undefined;
	cardMaster.sandbox.elements.forEach(function(el){
		if(el.id == elemID){
			if(options.z) el.z = options.z;
			if(options.x) el.x = options.x;
			if(options.y) el.y = options.y;
			if(options.offsetX) el.offsetX = options.offsetX;
			if(options.offsetY) el.offsetY = options.offsetY;
			found = el;
		}
	});
	return found;
}

cardMaster.sandbox.updateElementSize = function(el, sizeClass){
	if(sizeClass) el.width = sizeClass;
	cardMaster.sandbox.updateLocalStorage();
	console.log(el.id+" is now "+sizeClass);
}

cardMaster.sandbox.renderBoard = function(){
	cardMaster.sandbox.syncLocalStorage();
	for(var i in cardMaster.sandbox.elements){
		var el = cardMaster.sandbox.elements[i];
		cardMaster.sandbox.renderElement(el);
	}
}

//animations

cardMaster.animation.newCardCreated = function(){
	$(".new_card_wrapper .flipper").one("oTransitionEnd transitionend webkitTransitionEnd", function(){
		console.log("flip done");
		$(".new_card_wrapper").find(".anim-block").addClass('play');
		$(".new_card_wrapper").find(".anim-block").one("oanimationend animationend webkitAnimationEnd", function(){
			console.log("hammer done");
			setTimeout(function(){
				$(".new_card_wrapper").find(".anim-block").removeClass('play');
				$(".new_card_wrapper").removeClass("done");
			}, 500);
		})
	})
	$(".new_card_wrapper").addClass("done");
}

cardMaster.animation.cardToSidedeck = function(){
	$("#sideDeck").one("oanimationend animationend webkitAnimationEnd", function(){
		$("#sideDeck").removeClass("anim-add");
	})
	$("#sideDeck").addClass("anim-add");
}

cardMaster.init = function(){
	if(cardMaster.getPage() != "index"){
		cardMaster.cardFilter = new _cardFilter();
		cardMaster.comboFilter = new _comboFilter();
		cardMaster.imageLoader = new _imageLoader();
		cardMaster.collection.syncArchetypes();
		cardMaster.collection.generateFlags();
		cardMaster.collection.showServantFields();
		cardMaster.collection.createCard();
		cardMaster.cardZoom();
		cardMaster.stickyPanel();
		
	}

	//page scripts
	console.log(cardMaster.getPage());
	if(cardMaster.getPage() == "archive"){
		cardMaster.cardFilter.showArchive();
		cardMaster.collection.recoverCard();
	}
	if(cardMaster.getPage() == "collection" || cardMaster.getPage() == "archive"){
		cardMaster.collection.switchViewCommands();
		cardMaster.loadLiteralElements(function(){
			cardMaster.collection.loadList(function(){
				cardMaster.collection.render();
				//populate sidedeck on page load. Card list needed
				cardMaster.sidedeck.init();
				cardMaster.sidedeck.syncLocalStorage(function(){
					cardMaster.sidedeck.renderList("#sideDeck .sidedeck-body");
				});
			});
		});
		cardMaster.collection.orderList();
		cardMaster.collection.addFilters();
		cardMaster.collection.editCard();
		cardMaster.collection.deleteCard();
		cardMaster.collection.selectTab();
		cardMaster.collection.iconBox();

	}
	if(cardMaster.getPage() == "combos"){
		cardMaster.loadLiteralElements(function(){
			cardMaster.collection.loadList(function(){
				cardMaster.collection.renderList();
				//populate sidedeck on page load. Card list needed
				cardMaster.sidedeck.init();
				cardMaster.sidedeck.syncLocalStorage(function(){
					cardMaster.sidedeck.renderList("#sideDeck .sidedeck-body");
				});
			});
			cardMaster.combos.loadList(cardMaster.combos.renderList);

		});
		cardMaster.combos.orderList();
		cardMaster.combos.addFilters();
		cardMaster.combos.toggleNewComboForm();
		cardMaster.combos.resetNewComboForm();
		cardMaster.combos.addNewComboCard();
		cardMaster.combos.createCombo();
		cardMaster.combos.editControls();
		cardMaster.combos.removeComboCard();
	}
	if(cardMaster.getPage() == "summary"){
		cardMaster.loadLiteralElements(function(){
			cardMaster.collection.loadList(function(){
				cardMaster.summary.structureArray(function(){
					cardMaster.summary.populateArray(cardMaster.summary.renderBoxes);
				});
				//populate sidedeck on page load. Card list needed
				cardMaster.sidedeck.init();
				cardMaster.sidedeck.syncLocalStorage(function(){
					cardMaster.sidedeck.renderList("#sideDeck .sidedeck-body");
				});
			});
		});
	}
	if(cardMaster.getPage() == "sandbox"){
		cardMaster.loadLiteralElements(function(){
			cardMaster.collection.loadList(function(){
				//populate sidedeck on page load. Card list needed
				cardMaster.sidedeck.init();
				cardMaster.sidedeck.syncLocalStorage(function(){
					cardMaster.sidedeck.renderList("#sideDeck .sidedeck-body");
					cardMaster.sandbox.init(function(){
						cardMaster.sandbox.renderBoard();
					});
				});
			});
		});
	}
};

jQuery(document).ready(function() {
	cardMaster.init();
});