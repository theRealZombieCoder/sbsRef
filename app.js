var questionManager = (function() {

	var NO_MATCHES_MSG = "No properties in Shrewsbury matched your search. Try again?";

	var qNum = 1;

	var initPage = function() {
		attachEvents();
	};

	var attachEvents = function() {
		$("#qFilter").on('keypress', function(ev) {
			if (ev.which === 13) {
				doFilter();
			}
		});

		$(".qInput").on('keypress', function(ev) {
			if (ev.which === 13) {
				nextQuestion();
			}
		});
	};

	var doFilter = function () {
		var filterText = $("#qFilter").val().toLowerCase().trim();
		console.log ("Searched for: " + filterText);
		if (filterText) {
			var matches = d.filter(function(a) {
				return a.toLowerCase().indexOf(filterText) >= 0;
			});
			console.log ("Found matches: " + matches.length);
			if (matches.length <= 0) {
				$("#matchesContainer").html(NO_MATCHES_MSG);
			} else {
				var htmlMatches = matches.map(fnTemplateAddress).join("");
				console.log("HTML = " + htmlMatches);
				$("#matchesContainer").html(htmlMatches);			
			}
		}

		$("#q1").slideUp(300, function() {
			$("#q2").show();
		});		
	};

	var nextQuestion = function() {
		$("#q" + qNum).slideUp(300, function() {
			qNum += 1;
			console.log ("to = " + qNum);
			$("#q" + qNum).show();			
		});
	};

	var fnTemplateAddress = function (o) {
		var ar = o.split("~");
		return "<div class='row addressLine' onclick='questionManager.doSelectAddress(this); return false;' data-address-id='" + ar[1] + "'>" + 
			_formatOneAddress(ar) + 
			"</div>";
	};

	var _formatOneAddress = function (addressArray) {
		return "<div class='col col-md-4'>Owner(s): <b>" + addressArray[0] + "</b></div>" +
		"<div class='col col-md-1'>&nbsp;</div>" +
		"<div class='col col-md-4 addressesLabel'>Address: <b>" + addressArray[1] + "</b></div>";
	};

	var fnTemplateInfo = function (o) {
		var ar = o.split("~");
		var totalA = parseFloat(ar[4]);
		return "<div>Your current assessment is: $" + totalA.toLocaleString() + "</div>" + 
		"<div> If all 4 Questions pass, your property taxes would go up: " +
		"<div class='increaseTotal'>" + getTaxIncreaseAsStr(totalA, 1, 4) + " per year, or " +
		getTaxIncreaseAsStr(totalA, 20, 4) + " over 20 years</div>" +
		"<div class='increaseOthers'>" + getTaxIncreaseAsStr(totalA, 1, 1) + " per year if only Question 1 passes;</div>" + 
		"<div class='increaseOthers'>" + getTaxIncreaseAsStr(totalA, 1, 2) + " per year if only Questions 1 and 2 pass;</div>" + 
		"<div class='increaseOthers'>" + getTaxIncreaseAsStr(totalA, 1, 3) + " per year if only Questions 1, 2 and 3 pass;</div>" + 
		"</div>";
	};

	var getTaxIncreaseAsStr = function(n, years, refQuestions) {
		console.log ("Amt in = " + n);
		var inc = getTaxIncrease(n, refQuestions) * years;
		console.log ("Increase = " + inc);
		inc = Math.round(inc * 100) / 100;
		console.log ("Rounded = " + inc);
		return "$" + inc.toLocaleString();
	}

	var getTaxIncrease = function(n, refQuestions) {
		var rate = 0.0;
		console.log("Questions sent = " + refQuestions);
		switch(refQuestions) {
			case 4:
				console.log ("matched 4");
				rate = .001395;
				break;
			case 3: 
				rate = .001264;
				break;
			case 2:
				rate = .001197;
				break;
			case 1:
				rate = .000533;
				break;
			default:
				rate = 0;
				break;
		}
		//return .001395 * n;
		return rate * n;
	};

	var doSelectAddress = function(o) {
		var id = $(o).attr("data-address-id");
		var thisAddress = d.filter(function(o) { return o.indexOf(id) > 0; })[0];
		var htmlInfo = fnTemplateInfo(thisAddress);
		$("#currentAssessment").html(htmlInfo);
		$("#q2").slideUp(300, function() {
			$("#q3").show();
		});
	};

	return {
		initPage: initPage,
		nextQuestion: nextQuestion,
		doSelectAddress: doSelectAddress
	};

}) ();


