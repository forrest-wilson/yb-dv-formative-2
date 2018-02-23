console.log('i am working');

var ClientId = '2Osl6xc1DVNMd4BRRioCCOgITqZqSLOMimmcwUdo';

$.ajax({
	url: 'https://images-api.nasa.gov/search?q=apollo&media_type=image',
	dataType: 'json',
	success: function(nasaData) {
		if (nasaData) {
			console.log(nasaData.collection.items);
			var imgList = "";
		    $.each(nasaData.collection.items, function () {
      			imgList += '<li><img src= "' + this.links["0"].href + '"></li>';
    		});
   			$('#wrapper').append(imgList);
		}
	},
	error: function(error) {
		console.log('error');
	}
})