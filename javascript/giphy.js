$(document).ready(function() {

//****************Start Page *********************

//Gobal Variable

var userSelectedRating = "";

function startApp(){
	$('.picPage').hide();	
};
// once the rating is selected the first page is hidden
//picPage is shown

$('.firstPage  .btn').on('click',function(){
	userSelectedRating = $(this).attr('data-rate');
	$('.firstPage').hide();
	$('.picPage').show();
}); //rating election

startApp();

//*************************start Page ends************

//change the first letter after space to capital
function changetoCapitol(pharse){
	pharse= pharse.split(" ");
	for (var i=0; i < pharse.length; i++){
	//console.log(pharse[i][0].toUpperCase());
		pharse[i] = pharse[i].split("");
		pharse[i][0] = pharse[i][0].toUpperCase();
		pharse[i] = pharse[i].join("");
	}
	pharse=pharse.join(" ");
	return pharse;
}


//Creating an object for each topic
function topic(topic, noOfPic){
	//trim empty spaces in the topic and replace 
	topic = topic.trim();
	topic = topic.replace( /\s\s+/g, ' ' );
	topic = topic.replace(/ +/g,"+");
	this.topic = topic.toLowerCase();
	this.noOfPic = noOfPic;

	this.createButton = function(){
		var buttonTag = $('<button>');
		buttonTag.addClass('btn btn-lg btn-success topicButton');
		buttonTag.attr('data-topic', this.topic);
		buttonTag.attr('data-totalpic', this.noOfPic);
		var buttonText = this.topic.replace(/(\+)+/g," "); 
		buttonText= changetoCapitol(buttonText);
		buttonTag.text(buttonText);
		return(buttonTag);
	};

	this.buttonTag= this.createButton();

}

//Gobal Variable

topics = [];
topics.push(new topic(" physical reaction ", 10));
topics.push(new topic("Bill Nye", 15));
topics.push(new topic("   chemical reaction   ", 15));
topics.push(new topic("   space 			ship   ", 10));

function initDisplay(){
	$(".picDiv").empty();
	for(var i =0; i < topics.length; i++){
		$(".picDiv").append(topics[i].buttonTag);
		//console.log(topics[i].buttonTag);
	}
}


function displayPics(){

	//Ajax the giphy API for the details
	console.log("displayPics");
	//console.log($(this).parent().hasClass('picDiv'));

	var selectTopic = $(this).data('topic');
	var totalpic = $(this).data('totalpic');

	//console.log(selectTopic + "   "+ totalpic);
	var queryURL = "http://api.giphy.com/v1/gifs/search?q="+selectTopic+"&api_key=dc6zaTOxFJmzC";
	queryURL += "&limit="+totalpic+"&rating="+userSelectedRating;

	//console.log(queryURL);

	if(! $(this).parent().hasClass('arrButtonDiv')){
	    $(".arrButtonDiv").empty();
		for(var i =(topics.length-1); i >= 0 ; i--){
	    console.log('printing tag');

			$(".arrButtonDiv").append(topics[i].buttonTag);
		}
	}

	//querying the API 
	$.ajax({
            url: queryURL,
            method: 'GET'
        })
        .done(function(response) {
        	$('.picDiv').empty();
			for(var j = 0; j < response.data.length; j++){
				var imgTab = $('<img>');
				imgTab.addClass('img img-thumbnail picture');
				imgTab.attr('data-still', response.data[j].images.fixed_height_still.url);
				imgTab.attr('data-gif', response.data[j].images.fixed_height.url);
				imgTab.attr('data-rate', response.data[j].rating);
				imgTab.attr('src',response.data[j].images.fixed_height_still.url);
				$('.picDiv').append(imgTab);
				//console.log(imgTab);
			}
        	//$(".picDiv").append(JSON.stringify(response));

	});//ajax done

}; //displayPics

initDisplay();

//Clicking on the button the first time
$('.picDiv').on('click', 'button', displayPics);

//Clicking the button from the side display
$('.arrButtonDiv').on('click','button', displayPics);

 //changes still to gif and gif to still on click
	$('.picDiv').on('click', '.img-thumbnail', function(){
		if($(this).attr('src') == $(this).data('still')){
			$(this).attr('src', $(this).data('gif'));
		} else {
			$(this).attr('src', $(this).data('still'));
		}
	}); //changes still to gif on click


//changes to gif if you hover over the pic 

$('.picDiv').on('mouseover', '.img-thumbnail', function(){
	$(this).attr('src', $(this).data('gif'));
	$(this).css({
		"width":"320px", "height":"320px","marin":"-5px"});		
}); 

$('.picDiv').on('mouseout', '.img-thumbnail', function(){
	$(this).attr('src', $(this).data('still'));	
	$(this).css({
		"width":"300px", "height":"300px","margin":"20px"});	
});



//Adding a new topic
$('#newTopic').on('click', function(){

		// This line of code will grab the input from the textbox
		var addedTopic = $('#newtopic').val().trim();
		var NoofPic = parseInt($('#noOfPic').val().trim());

		console.log("no of pic" + NoofPic);

		// The topic from the textbox is then added to our array
		topics.push(new topic(addedTopic, NoofPic));
		
		// Our array then runs which handles the processing
		initDisplay();

		// We have this line so that users can hit "enter" instead of clicking on ht button and it won't move to the next page
		return false;
	});


}); //document ready

