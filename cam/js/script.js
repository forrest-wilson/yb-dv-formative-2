console.log('i am working');

var ClientId = '2Osl6xc1DVNMd4BRRioCCOgITqZqSLOMimmcwUdo';

var searchInputValue = document.getElementById('search');
console.log(searchInputValue);
// var userQuery = 





$('#formSearch').submit(function(){ 
	event.preventDefault();
	console.log(searchInputValue);
		$.ajax({
			url: 'https://images-api.nasa.gov/search?q=+userQuery+&media_type=image',
			dataType: 'json',
			success: function(nasaData) {
				if (nasaData) {
					console.log(nasaData.collection.items);
					var imgList = "";
				    $.each(nasaData.collection.items, function () {
		      			imgList += '<li><img src= "' + this.links['0'].href + '"></li>';
		    		});
		   			$('#wrapper').append(imgList);
				}
			},
			error: function(error) {
				console.log('error');
			}
		})
})