
var utterance = null;
//var index = 0;
//var length = 0;
//var sheetNamePrefix = "Sheet";
var currentSheet = "";

/**var qData = {
    "Sheet1": {
      "index": 0,
      "length": 0
    }
  }
*/


var qData = {};
var sheetData = [];
var metaData = [];

//var api = "https://opensheet.elk.sh/1j_A7AjZET41o9FyUQb82O96vRsGG3Aa12Rf6MHUQtfs/";
var api = "https://opensheet.elk.sh/1sPsyiGBcuA4TaFB5h0dwDqTmhfi5XEXbHuCgQ3O1XNA/";


/*window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
*/



function registerSpeak(){
    utterance = new SpeechSynthesisUtterance();
    utterance.lang = "en-GB";
    var voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.filter(function(voice) { return voice.name == 'Google UK English Male'; })[0];
}

function speak(text){
    utterance.text = text;
    window.speechSynthesis.speak(utterance);
}



function loadMetaData(){

    var url =  api + "meta_data";
    $.ajax({
        url: url
    }).then(function(data) {

        metaData = data;
        displayPages();
        
        
        loadPage('SHEET_1');

        console.log(data);
        
      
    });
}

function loadQuestions(){

    var url =  api + currentSheet;
    $.ajax({
        url: url
    }).then(function(data) {

        sheetData = data;
        console.log(url); 
        console.log(data);


        qData[currentSheet] = {
                "index": 0,
                "length": data.length
            }

        displayQuestion();

    });


}


function displayPages(){

    


}


function loadPage(sheet){

    //var title = metaData[]
    currentSheet = sheet;
    loadQuestions(sheet);

    $('#pageTitle').html( getPageTitle(sheet + '_TITLE'));
}

function getPageTitle(sheetKey){
    var metadataObj = filterJsonArrayByField(metaData, 'key', sheetKey, false);
    if(metadataObj.value){
        return metadataObj.value;
    }
    return "";
}


function displayQuestion(){

    
    //localStorage.setItem("qData", JSON.stringify(qData));


    var question = sheetData[qData[currentSheet].index];


    var htmlTxt = "";

    htmlTxt +='<div class="d-flex justify-content-center row">';
    htmlTxt +=         '<div class="col-md-10 col-lg-10">';
    htmlTxt +=                  '<div class="border">';
    htmlTxt +=                           '<div class=" bg-white p-2 border-bottom">';
    htmlTxt +=                                    '<div class="d-flex flex-row justify-content-between align-items-center mcq">';
    htmlTxt +=                                             '<h3 class="text-primary mb-0">Q ' + question['id'] + '</h3>';
    htmlTxt +=                                             '<span>(' + (qData[currentSheet].index + 1) + ' of ' + qData[currentSheet].length + ')</span>';
    htmlTxt +=                                    '</div>';
    htmlTxt +=                           '</div>';
    htmlTxt +=                           '<div class="question bg-white border-bottom">';
    htmlTxt +=                                    '<div class=" question-title">';
    htmlTxt +=                                             '<h5 class="mt-1 ml-2">' + question['text_si'] + '</h5>';
    htmlTxt +=                                    '</div>';
    htmlTxt +=                                    '<div class=" show-ans mb-4 mt-3"><a class="show-ans-link"href="javascript:void(0)">Answer >></a></div>';
    htmlTxt +=                                    '<div class="ans ml-2 mb-4 clearfix" style="display:none">';
    htmlTxt +=                                             '<div class="speak bi bi-volume-up-fill float-start"></div>';
    htmlTxt +=                                             '<div class="ans-txt">' + question['text_en'] + '</div>';
    htmlTxt +=                                    '</div>';
    htmlTxt +=                           '</div>';
    htmlTxt +=                           '<div class="d-flex flex-row justify-content-between align-items-center p-3 bg-white">';
    htmlTxt +=                                    '<button id="btnPrev" class="btn btn-dark d-flex align-items-center " type="button" onclick="prev()">';
    htmlTxt +=                                    'Previous';
    htmlTxt +=                                    '</button>';
    htmlTxt +=                                    '<button id="btnNext" class="btn btn-danger  align-items-center" type="button" onclick="next()">Next';
    htmlTxt +=                                    '</button>';
    htmlTxt +=                           '</div>';
    htmlTxt +=                  '</div>';
    htmlTxt +=         '</div>';
    htmlTxt +='</div>';
   


    $('#question-container').html(htmlTxt);

    $(".show-ans-link").click(function(){
		
		if($(this).parents().find('.question').children('.ans').is(':hidden')){
			$(this).parents().find('.question').children('.ans').show();
		}else{
			$(this).parents().find('.question').children('.ans').hide();
		}
		
		
	});
	
	$(".speak").click(function(){
		
		var ansTxt = $(this).parents().parents().find('.question').children('.ans').find('.ans-txt').text();
		speak(ansTxt);
	});

    if(qData[currentSheet].index == qData[currentSheet].length -1){
        $('#btnNext').prop('disabled',true);
    }
    if(qData[currentSheet].index == 0){
        $('#btnPrev').prop('disabled',true);
    }
}

function prev(){
    qData[currentSheet].index--;
    displayQuestion();
    
}

function next(){

    qData[currentSheet].index++;
    displayQuestion();
}


/**
 * Filter json array with objects
 * @param array
 * @param {string} fieldName
 * @param value
 * @isAsList {Boolean} - if true returns filterd object/s as a list if not found return empty array
 *			 if returns multiple objects, this value should be 'true'	
 * @return  if found retunrs filterd object, if not returns undefined
 */
function filterJsonArrayByField(array, fieldName, value, isAsList){
	var list  =  jQuery.grep(array, function (element, index) {
					return element[fieldName] == value;
				});
	if(isAsList){
		return  list;
	}else{
		return list[0];
	}
}


$(document).ready(function(){
	
	registerSpeak();
    loadMetaData();
    //loadQuestions(1);

});


	