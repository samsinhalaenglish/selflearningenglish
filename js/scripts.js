/*!
* Start Bootstrap - New Age v6.0.6 (https://startbootstrap.com/theme/new-age)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
*/
//
// Scripts
// 

var accessKey = "AKIAV2C4FPQRTBI2OVWP";
var secretAccessKey = "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";

var brian = null;

var api = "https://opensheet.elk.sh/1j_A7AjZET41o9FyUQb82O96vRsGG3Aa12Rf6MHUQtfs/Sheet2";

window.addEventListener('DOMContentLoaded', event => {

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




function registerSpeak(){

    var awsCredentials = new AWS.Credentials(accessKey, secretAccessKey);
    var settings = {
        awsCredentials: awsCredentials,
        awsRegion: "us-west-2",
        pollyVoiceId: "Brian",
        cacheSpeech: true
    }
    brian = ChattyKathy(settings);
    
   // brian.Speak("Test");
  

    if (brian.IsSpeaking()) {
        brian.ShutUp(); 
    }

    //brian.ForgetCachedSpeech();


}

function speak(text){
	brian.Speak(text);
}


$(document).ready(function(){
	
	registerSpeak();
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
	
});


	