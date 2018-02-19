$(document).ready(function() {
    //*******************//
    //**** Variables ****//
    //*******************//

    var baseURL = 'https://newsapi.org/v2/top-headlines',
        apiKey = '&apiKey=8ae3145ae848419daac961e5bb96b441';

    //*******************//
    //**** Functions ****//
    //*******************//

    // Performs the ajax request and handles the before, after, and error outcomes
    function getData(url, callback) {
        $.ajax({
            method: 'GET',
            dataType: 'json',
            url: url,
            beforeSend: function() {
                var container = $('#articleContainer');

                // Checks the container to see whether there are any child elements
                // If child elements exist, get rid of them
                if (container.children()) {
                    container.empty();
                }

                // Show a loading GIF
                $('#articleContainer').append($('<img id=\'loadingGif\' src=\'img/ripple.svg\' style=\'position: absolute; left: 50%; transform: translateX(-50%);\' alt=\'Loading GIF\'>'));
            },
            success: function(data) {
                // If a callback has been defined, call it and pass through the data receieved from the request
                if (callback) callback(data);
            },
            error: function(err) {
                // Throw an error if something went wrong with the AJAX request
                throw new Error('An AJAX error occurred: ', err);
            }
        })
        .always(function() {
            // Once the AJAX request has finished (successfully or not), remove the loader GIF
            $('#loadingGif').remove();
        });
    }

    // Handler for populating #articleContainer with articles
    function populateArticles(data) {
        console.log(data);

        var container = $('#articleContainer'),
            childElements = [];

        // Loops through each article and adds a DOM node to the childElements array
        for (var i = 0; i < data.articles.length; i++) {
            var article = data.articles[i],
                parent = $("<div class=\'col-sm-12 col-md-6 col-lg-4\'></div>"),
                card = $('<div class=\'card mt-4\'></div>'),
                body = $('<div class=\'card-body\'></div>');

            // Only appends an image if it exists in the article
            if (article.urlToImage != null) {
                card.append($('<img class=\'card-img-top\'>').attr('src', article.urlToImage));
            } else {
                // otherwise appends a stock image
                card.append($('<img class=\'card-img-top\'>').attr('src', 'img/no-image.jpg'));
            }

            // Appends a date to the card and uses moment.js as a date parser
            body.append($('<small></small>').text(moment(article.publishedAt).format("MMM DD YYYY")));

            // Appends an element to the body element
            body.append($('<h5 class=\'card-title\'></h5>').text(article.title));
            
            // Appends a description to the body element if one exists
            if (article.description) {
                body.append($('<p class=\'card-text\'></p>').text(article.description));
            }

            // Appends an a element to the body element
            body.append($('<a href=\'' + article.url + '\' target=\'_blank\'></a>').text("View article on " + article.source.name));

            // Appends the body to the card element
            card.append(body);

            // Appends the card element to the parent element
            parent.append(card);

            // Pushes the newly created elements to the childElements array
            childElements.push(parent);
        }

        // Populates the DOM with the elements from the childElements array
        container.append(childElements);
    }

    //************************//
    //**** Event Handlers ****//
    //************************//

    // #submitButton event handler
    $('#submitButton').on('click', function(e) {
        e.preventDefault();

        // Building the URL to pass to getData()
        var countryCode = '?country=' + $('#country').val(),
            url = baseURL + countryCode + apiKey;

        // Calls the getData method passing in the constructed url and populateArticles as the callback
        getData(url, populateArticles);
    });
});