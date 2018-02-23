$(document).ready(function() {
    //*******************//
    //**** Variables ****//
    //*******************//

    var apiKey = '&apiKey=8ae3145ae848419daac961e5bb96b441',
        xhr = null, // Global reference to current AJAX request
        results; // Makes the results globally available

    //*******************//
    //**** Functions ****//
    //*******************//

    // Resets the results to their initial value
    function resetResults() {
        results = {
            pageNumber: 1,
            perPage: parseInt($('#resultsNumber').val()),
            total: null,
            showing: null
        };
    }

    // Performs the ajax request and handles the before, after, and error outcomes
    function getData(url, callback) {
        if (xhr !== null && xhr.readyState != 4) {
            xhr.abort();
        }
        
        xhr = $.ajax({
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
                container.append($('<img id=\'loadingGif\' src=\'img/ripple.svg\' style=\'position: absolute; left: 50%; transform: translateX(-50%);\' alt=\'Loading GIF\'>'));
            },
            success: function(data) {
                // If a callback has been defined, call it and pass through the data receieved from the request
                if (callback) callback(data);
            },
            error: function(err) {
                // If request is aborted exit the scope
                if (err.statusText == 'abort') {
                    return;
                } else {
                    // Otherwise, throw an error
                    throw new Error('Unhandled AJAX Error');
                }
            }
        })
        .always(function() {
            // Once the AJAX request has finished (successfully or not), remove the loader GIF
            $('#loadingGif').remove();
        });
    }

    function populateResultsDisplay() {
        // Populates the text below the Previous and Next buttons
        if (results.showing === null) {
            $('#resultMin').text('1');
            $('#resultMax').text(results.perPage);
            results.showing = results.perPage;
        } else {
            $('#resultMin').text(results.showing - results.perPage + 1);
            $('#resultMax').text(results.showing);
        }

        if (results.showing > results.total) {
            $('#resultMax').text(results.total);
        }

        $('#totalResults').text(results.total);
    }

    // Handler for populating #articleContainer with articles
    function populateArticles(data) {
        var container = $('#articleContainer'),
            childElements = [];

        // Assigning the remaining results properties
        if (results.total === null) {
            results.total = data.totalResults;
        }

        if (results.total === 0) {
            container.append($('<p>There were no results</p>'));
            $('#paginationDiv').hide();
            return;
        }

        populateResultsDisplay();

        $('#paginationDiv').show();

        // Loops through each article and adds a DOM node to the childElements array
        for (var i = 0; i < data.articles.length; i++) {
            var article = data.articles[i],
                parent = $('<div class=\'col-sm-12 col-md-6 col-lg-4\'></div>'),
                card = $('<div class=\'card mt-4 boxShadowHover\'></div>'),
                body = $('<div class=\'card-body\'></div>');

            // Only appends an image if it exists in the article
            if (article.urlToImage !== null) {
                card.append($('<img class=\'card-img-top\'>').attr('src', article.urlToImage));
            } else {
                // otherwise appends a stock image
                card.append($('<img class=\'card-img-top\'>').attr('src', 'img/no-image.jpg'));
            }

            // Appends a date to the card and uses moment.js as a date parser
            body.append($('<small></small>').text(moment(article.publishedAt).format('MMM DD YYYY')));

            // Appends an element to the body element
            body.append($('<h5 class=\'card-title\'></h5>').text(article.title));
            
            // Appends a description to the body element if one exists
            if (article.description) {
                body.append($('<p class=\'card-text\'></p>').text(article.description));
            }

            // Appends an a element to the body element
            body.append($('<a href=\'' + article.url + '\' target=\'_blank\'></a>').text('View article on ' + article.source.name));

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

    // Builds the URL to be queried
    function buildSearchURL() {
        // Building the URL
        var baseURL = 'https://newsapi.org/v2/everything',
            searchValue = $('#searchTerm').val(),
            searchTerm = '?q=' + searchValue,
            resultsPerPage = '&pageSize=' + results.perPage,
            language = '&language=en',
            sortedBy = '&sortBy=' + $('#sortedBy').val();
        
        // If a searchValue isn't specified, show a message on the page and exit the scope
        if (searchValue === '') {
            $('.alert').show();
            return;
        }

        $('.alert').hide();

        // constructs the URL and calls the getData function
        var url = baseURL + searchTerm + resultsPerPage + language + sortedBy + '&page=' + results.pageNumber + apiKey;
        getData(url, populateArticles);
    }

    //************************//
    //**** Event Handlers ****//
    //************************//

    // #searchButton event handler
    $('#searchButton').on('click', function(e) {
        e.preventDefault();

        resetResults();
        buildSearchURL();
    });

    // Pagination event listeners
    $('.page-link').on('click', function(e) {
        e.preventDefault();

        switch (this.dataset.pagination) {
            case 'decrement':
                // Makes sure if you're trying to access a page that doesn't exist it will stop you
                if (results.pageNumber <= 1) {
                    return;
                }
                results.pageNumber--;
                results.showing = results.pageNumber * results.perPage;
                break;
            case 'increment':
                if (results.showing > results.total) {
                    return;
                }
                results.pageNumber++;
                results.showing = results.pageNumber * results.perPage;
                break;
            default: 
                throw new Error('Something went wrong with pagination');
        }

        buildSearchURL();
    });

    // Event listener for change of results per page
    $('#resultsNumber').on('change', function() {
        results.perPage = parseInt($('#resultsNumber').val());
    });

    //**************************************//
    //**** Functions to run on DOM Load ****//
    //**************************************//

    resetResults();
});