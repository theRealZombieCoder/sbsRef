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
		var filterText = $("#qFilter").val().toLowerCase();
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
		var totalA = parseFloat(ar[4]);;
		return "<div>Your current assessment is: $" + totalA.toLocaleString() + "</div>" + 
		"<div> If all 4 Questions pass, your property taxes would go up: " +
		"<div class='increaseTotal'>" + getTaxIncreaseAsStr(totalA, 1) + " per year, or </div>" +
		"<div class='increaseTotal'>" + getTaxIncreaseAsStr(totalA, 20) + " over 20 years</div>" +
		"</div>";
	};

	var getTaxIncreaseAsStr = function(n, years) {
		console.log ("Amt in = " + n);
		var inc = getTaxIncrease(n) * years;
		console.log ("Increase = " + inc);
		inc = Math.round(inc * 100) / 100;
		console.log ("Rounded = " + inc);
		return "$" + inc.toLocaleString();
	}

	var getTaxIncrease = function(n) {
		return .001395 * n;
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


