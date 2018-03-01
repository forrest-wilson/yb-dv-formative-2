$(document).ready(function(){

	var ClientId 			= '2Osl6xc1DVNMd4BRRioCCOgITqZqSLOMimmcwUdo';
	var searchInputValue	= document.getElementById('text');
	var emptyDiv 			= document.getElementById('noResult');
	var api 				= 'https://images-api.nasa.gov/search?q=';
	var units				= '&media_type=image';

	$('#search').click(function(){ 
		event.preventDefault();
		$('#wrapper').children('li').remove();
			$.ajax({
				url: api + searchInputValue.value + units,
				dataType: 'json',
				success: function(nasaData) {
					if (nasaData) {
						console.log(nasaData.collection.items);
						console.log(nasaData.collection.items["0"].data["0"].description);
						console.log(nasaData.collection.items["1"].data["0"].description);
						var imgList = '';
					    $.each(nasaData.collection.items, function () {
			      			imgList += '<li><img src= "' + this.links['0'].href + '">' + '<figcaption>' + this.data['0'].description + '</figcaption>' + '</li>';
			    		});
			   			$('#wrapper').append(imgList);
					}
					if (searchInputValue.value == '') {
						$('#wrapper').children("li").remove();
						emptyDiv.innerHTML = "No results found, try again";
					}
				},
				error: function(error) {
					console.log('error');
				}
			})
	})

	$('#search').one('click', function() {
	    $('#logo, #formSearch').animate({
	      	left: '-=650',
	      	top: '-=90'
	     }, 900);
	});
	// ["0"].data["0"].description

});
