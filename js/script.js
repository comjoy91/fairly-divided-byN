
const grandProvince_gap = 8;
const width_nation = $("#horizontalBar_total").innerWidth() - grandProvince_gap * ($(".grand_province").length-1);
const grdp_dividingCoeffcient = 45 * 45 * 2;

const horizontalBar_grdpBoxGap = 4;
const horizontalBar_grdpPerUnitGap = 8;

const num_province = json_data_province.length;

var recent_menuIndex = null;
var recent_grdpIndex = null;


function return_nationName() { return json_data_nation.province_name; }
function return_grdp_nation() { return json_data_nation.grdp; }
function return_number_n_nation(_menuIndex) { return json_data_nation.n_array[_menuIndex]; }
function return_grdp_perUnit_nation(_menuIndex) { return return_grdp_nation() * 1000000 / return_number_n_nation(_menuIndex); }

function return_provinceName(_grdpIndex) { return json_data_province[_grdpIndex].province_name; }
function return_grdp(_grdpIndex) { return json_data_province[_grdpIndex].grdp; }
function return_number_n(_grdpIndex, _menuIndex) { return json_data_province[_grdpIndex].n_array[_menuIndex]; }
function return_grdp_perUnit(_grdpIndex, _menuIndex) { return return_grdp(_grdpIndex) * 1000000 / return_number_n(_grdpIndex, _menuIndex); }

function print_number_n_nation(_menuIndex) { 
	if (recent_menuIndex != -1) return "전국 합산: " + d3.format(",")(return_number_n_nation(_menuIndex)) + return_unitWord(_menuIndex); 
	else return "각 사각형에 마우스를 올려보세요.";
}
function print_number_n(_grdpIndex, _menuIndex) { 
	if (recent_menuIndex != -1) return d3.format(",")(return_number_n(_grdpIndex, _menuIndex)) + return_unitWord(_menuIndex); 
	else return return_provinceName(_grdpIndex) + "</br>" + d3.format(",")(return_grdp(_grdpIndex)) + "백만원";
}
function print_grdp_perUnit_nation(_menuIndex) {
	if (recent_menuIndex != -1) return return_nationName() + ":</br>" + d3.format(",d")(return_grdp_perUnit_nation(_menuIndex)) + unitWord_grdpPerUnit + "/" + return_unitWord(_menuIndex);
	else return "";
}
function print_grdp_perUnit(_grdpIndex, _menuIndex) {
	if (recent_menuIndex != -1) return return_provinceName(_grdpIndex) + ":</br>" + d3.format(",d")(return_grdp_perUnit(_grdpIndex, _menuIndex)) + unitWord_grdpPerUnit + "/" + return_unitWord(_menuIndex);
	else return "";
}


function print_quote(_menuIndex) { 
	if (recent_menuIndex != -1) return "&#8220;모든 <highlight>" + buttonName_array[_menuIndex] + "</highlight>" + sentence_array[_menuIndex] + "&#8221;"; 
	else return "&#8220;지역내총생산은 <br>그 지역에서 생산되어 분배할 수 있는 경제자원의 총량이다.&#8221;"; 
}
function print_staticsName(_menuIndex) {
	if (recent_menuIndex != -1) return staticsName_array[_menuIndex] + "¹ 1" + return_unitWord(_menuIndex) + "당 지역내총생산(GRDP, 2016)²";
	else return "2016년 광역시·도별 지역내총생산(GRDP¹, 당해년가격 기준)²"
}
function print_staticsCredit(_menuIndex) {
	if (recent_menuIndex != -1) return "<b>¹</b> " + staticsCredit_phase1_array[_menuIndex] 
			+ ", <a href=\"" + staticsCreditLink_array[_menuIndex] + "\" target=\"_blank\">" + staticsCredit_phase2_array[_menuIndex] + "</a>"
			+ staticsCredit_phase3_array[_menuIndex];
	else return "¹Gross Regional Domestic Product";
}


function grdpBox_widthHeight(_grdpIndex, _menuIndex) {
	if (_menuIndex < 0) {

		var sum_sqrt_grdp = 0;
		var sqrt_grdp_array = [];
		for (var province of json_data_province) {
			var grdp_area = province.grdp / grdp_dividingCoeffcient;
			var sqrt_grdp = Math.sqrt(grdp_area);
			sum_sqrt_grdp += sqrt_grdp;
			sqrt_grdp_array.push(sqrt_grdp);
		}
		var ratio = width_nation / sum_sqrt_grdp;

		var width = sqrt_grdp_array[_grdpIndex] * ratio, 
			height = return_grdp(_grdpIndex) / grdp_dividingCoeffcient / width;

	} 

	else {
		var grdp_area = return_grdp(_grdpIndex) / grdp_dividingCoeffcient;

		var n_nation = return_number_n_nation(_menuIndex);
		var n_province = return_number_n(_grdpIndex, _menuIndex);
		var width =  n_province / n_nation * width_nation;
		if (width < 1) width = 1;

		var height = grdp_area / width;
		if (height > 3000) height = 3000;
	}

	return {"width": width, "height":height};
};


function gridBox_cssChange() {

	$("#quote").html( print_quote(recent_menuIndex) );
	$("#staticsName").html( print_staticsName(recent_menuIndex) );
	$("#staticsCredit").html ( print_staticsCredit(recent_menuIndex) );

	if (recent_menuIndex != -1) $("#horizontalBar_total").css({ display: "" });
	else $("#horizontalBar_total").css({ display: "none" });
	$("#number_n_total").html( print_number_n_nation(recent_menuIndex) );
	$("#number_n_total").css({ left: ( $("#horizontalBar_total").innerWidth() - $("#number_n_total").innerWidth() )/2 });

	if (recent_menuIndex != -1) $("#grdp_button").css({ display: "" });
	else $("#grdp_button").css({ display: "none" });

	var _grandProvinceIndex = 0;
	var leftValue = 0;
	var count_1pxs = 0;

	$(".grdpBox").each( function(_grdpIndex) {
		if ($(this).parent().index(".grand_province") != _grandProvinceIndex) {
			leftValue += grandProvince_gap;
			_grandProvinceIndex++;
		}
		var widthHeight = grdpBox_widthHeight(_grdpIndex, recent_menuIndex);
		var width = widthHeight.width,
			height = widthHeight.height;
		if (width <= 1) count_1pxs++;

		$(this).css({ width: width, height: height });

		$(".number_n").eq(_grdpIndex)
						.html( print_number_n(_grdpIndex, recent_menuIndex) )
						.css({ left: ( width - $(".number_n").eq(_grdpIndex).innerWidth() )/2 });

		if (recent_menuIndex != -1) $(".number_n").eq(_grdpIndex).removeClass("rotate45");
		else $(".number_n").eq(_grdpIndex).addClass("rotate45");

		var verticalBar_this = $(".verticalBar").eq(_grdpIndex);
		verticalBar_this.css({ top: ($("#grdpBox_cover").innerHeight()-height)/2, height: height, left: leftValue });
		if (verticalBar_this.hasClass("heightOnRight")) {
			verticalBar_this.css({ left: leftValue + count_1pxs + width + horizontalBar_grdpBoxGap });
		}
		else {
			verticalBar_this.css({ left: leftValue - count_1pxs - verticalBar_this.outerWidth() - horizontalBar_grdpBoxGap });
		}


					// $("#number_grdpPerUnit").html( print_grdp_perUnit_nation(recent_menuIndex) );

		leftValue += width;
	});
}



function gridBox_mouseOverChange(_grdpIndex) {
	var recent_grdpBox = $(".grdpBox").eq(_grdpIndex);

	// $("#horizontalBar_total").css({ width: recent_grdpBox.css("width"), left: recent_grdpBox.position().left });
	// $("#number_n_total").html( print_number_n(_grdpIndex, recent_menuIndex) );
	// $("#number_n_total").css({ left: recent_grdpBox.position().left + ( recent_grdpBox.innerWidth() - $("#number_n_total").innerWidth() )/2 });

	if (recent_menuIndex != -1) $(".horizontalBar").eq(_grdpIndex).css({ display: "" });
	$(".number_n").eq(_grdpIndex).css({ display: "" });
	$("#horizontalBar_total").css({ display: "none" });
	$("#number_n_total").css({ display: "none" });

	var verticalBar_recent_grdpBox = $(".verticalBar").eq(_grdpIndex)
	if (recent_menuIndex != -1) verticalBar_recent_grdpBox.css({ display: "" });
	$("#number_grdpPerUnit").html( print_grdp_perUnit(_grdpIndex, recent_menuIndex) );
	if (recent_grdpBox.hasClass("heightOnRight")) {
		$("#number_grdpPerUnit").css({ display: "", 'text-align': 'left', left: verticalBar_recent_grdpBox.position().left + verticalBar_recent_grdpBox.innerWidth() + horizontalBar_grdpPerUnitGap });
	}
	else {
		$("#number_grdpPerUnit").css({ display: "", 'text-align': 'right', left: verticalBar_recent_grdpBox.position().left - $("#number_grdpPerUnit").innerWidth() - horizontalBar_grdpPerUnitGap });
	}
	
	$(".grdpBox").addClass("grayColour");
	recent_grdpBox.removeClass("grayColour");
}

function gridBox_mouseLeaveChange(_grdpIndex) {
	// $("#horizontalBar_total").css({ width: "100%", left: 0 });
	// $("#number_n_total").html( print_number_n_nation(recent_menuIndex) );
	// $("#number_n_total").css({ left: ( width_nation - $("#number_n_total").innerWidth() )/2 });

	$(".horizontalBar").eq(_grdpIndex).css({ display: "none" });
	$(".number_n").eq(_grdpIndex).css({ display: "none" });
	if (recent_menuIndex != -1) $("#horizontalBar_total").css({ display: "" });
	$("#number_n_total").css({ display: "" });

	$(".verticalBar").eq(_grdpIndex).css({ display: 'none' });
	// $("#number_grdpPerUnit").html( print_grdp_perUnit_nation(recent_menuIndex) );
	$("#number_grdpPerUnit").css({ display: 'none' });

	$(".grdpBox").removeClass("grayColour");
}



(function($){

	$(window).on("load", function() {//먼저 JSON 파일 로드를 한 뒤, langSearch 변수를 이용한 작업을 진행.

		recent_menuIndex = -1; //초기 initialize
		gridBox_cssChange();

		$("#menuIcon_container").html("");
		for (var menuName of buttonName_array) {
			$("#menuIcon_container").append( "<div class=\"menuIcon\">" + menuName + "</div>" );
		}

		// $(".menuIcon").eq(0).addClass("selected");
		// recent_menuIndex = 0;
		// gridBox_cssChange();


		$(".menuIcon").each( function(_menuIndex) {
			$(this).on("click", function() {
				recent_menuIndex = _menuIndex;
				$(".selected").removeClass("selected");
				$(this).addClass("selected");

				gridBox_cssChange();
			});
		});

		$("#grdp_button").on("click", function() {
			recent_menuIndex = -1;
			$(".selected").removeClass("selected");
			gridBox_cssChange();
		})

		$(".grdpBox").each( function(_grdpIndex) {
			$(this).mouseover( function() {
				recent_grdpIndex = _grdpIndex;
				gridBox_mouseOverChange(_grdpIndex);
				$("#horizontalBar_total, #number_n_total").mouseover( gridBox_mouseOverChange(recent_grdpIndex) );
			});

			$(this).mouseout( function() {
				recent_grdpIndex = null;
				gridBox_mouseLeaveChange(_grdpIndex);
				// $("#horizontalBar_total, #number_n_total").mouseout( gridBox_mouseLeaveChange(recent_grdpIndex) );
			});
		});
		// $("#horizontalBar_total").hover( 
		// 	function() { // mouse ON
		// 		$("#horizontalBar_total").css({ width: $(this).css("width"), left: $(this).position().left });
		// 	}
		// );

	});
	
})(jQuery);