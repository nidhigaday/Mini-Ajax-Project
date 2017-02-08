function loadData() {

    var $banner = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $yelpElem = $('#yelp-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytHeaderElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ", " + cityStr;

    $greeting.text("So, you would like to move to " + address + "?");


    var apiKey = config.apiKey;
    var streetViewUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + address + "&key=" + apiKey;

    //append images to backgroung and div
    $banner.append('<img class="bgimg" alt="streetview" src="' + streetViewUrl + '">');

    if ($('#image-header').html().length !== 0) {
        $('#image-header img').attr("src", streetViewUrl);
        // length is 0
    } else {
        $('#image-header').append('<a class="fancybox" href="' + streetViewUrl + '"><img class="imgLink" alt="streetview" src="' + streetViewUrl + '"></a>');
    }


    //-----------------------------------------load NYT Arlicle Search---------------------------------------------


    var NYTapiKey = config.NYTapiKey;
    var NYTurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr + "&sort=newest&api-key=" + NYTapiKey + ";

    $nytHeaderElem.text('New York Times Articles About ' + cityStr);

    $.getJSON(NYTurl, function(data) {
        var articles = data.response.docs;
        //console.log(articles);
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            var snippet = article.snippet;
            if (snippet !== null) {
                $nytElem.append('<li class="articles">' +
                    '<a target="_blank" href="' + article.web_url + '">' +
                    '<h3>' + article.headline.main + '</h3>' +
                    '</a>' +
                    '<p>' + snippet + '</p>' +
                    '</li>');
            } else {
                $nytElem.append('<li class="articles">' +
                    '<a target="_blank" href="' + article.web_url + '">' +
                    '<h3>' + article.headline.main + '</h3>' +
                    '</a>' +
                    '</li>');
            }
        }
    }).fail(function() {
        $nytHeaderElem.text('Unable to load NYT articles');
    });


    //-----------------------------------------load Wiki Arlicle Search-------------------------------------------

    var Wikiurl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityStr + "&format=json&callback=wikiCallback";
    // console.log(Wikiurl);

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('Failed to get Wikipedia Resources');
    }, 6000);

    $.ajax({
        url: Wikiurl,
        dataType: 'jsonp'
    }).done(function(data) {
        for (i = 0; i < data.length; i++) {
            var wikiTitle = data[1][i];
            var wikiUrl = data[3][i];
            $wikiElem.append('<li>' +
                '<a target="_blank" href="' + wikiUrl + '">' +
                '<h3>' + wikiTitle + '</h3>' +
                '</a>' +
                '</li>');
        }
        clearTimeout(wikiRequestTimeout);
    });


    //---------------------------------------------Load Yelp API-------------------------------------------------

    var n = new Date().getTime();
    var generateNonce = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    var nounceString = generateNonce(16);
    // location value to generate a signature
    var yLocation = cityStr.replace(" ", "+");

    //values required generate signature
    var Method = 'GET',
        yurl = 'https://api.yelp.com/v2/search',
        parameters = { // following parameters are required to obtain a oauth_signature for our request
            oauth_consumer_key: config.Consumer_Key,
            oauth_token: config.Token,
            oauth_nonce: nounceString,
            oauth_timestamp: n,
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0',
            location: yLocation, //optional but required if not using 'term': (value) for search. else will get error
            callback: 'cb' //callback is required as Yelp follows CORS.
        },
        consumer_Secret = config.Consumer_Secret, // unique key to each api account - must include
        token_Secret = config.Token_Secret, // unique key to each api account - must include
        // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash-------------oauth_signature
        encodedSignature = oauthSignature.generate(Method, yurl, parameters, consumer_Secret, token_Secret);
    console.log(encodedSignature);
    parameters['oauth_signature'] = encodedSignature; // added oauth_signature value to the set of data - parameters
    console.log(parameters);
    // generates a BASE64 encode HMAC-SHA1 hash
    // var signature = oauthSignature.generate(Method, yurl, parameters, consumerSecret, tokenSecret, { encodeSignature: true});
    // console.log(signature);*/

    var yelpRequestTimeout = setTimeout(function() { // function incase request fails.
        $yelpElem.text('Failed to get Yelp Resources');
    }, 6000);

    $.ajax({
        // values required to make ajax request
        method: Method, //The HTTP method to use for the request
        url: yurl, //URL to which the request is sent.
        data: parameters, //data to be sent to server, to be converted to query string by appending to the url for GET-request
        consumerSecret: consumer_Secret, //Consumer and Token secret authenticate and validae the request, it must be unique
        tokenSecret: token_Secret,
        dataType: 'jsonp', //tells server what format of data to send in response
        cache: true // cache is crucial. It prevents jQuery from adding on a cache-buster parameter"_=23489489749837",
            // which invalidats our oauth-signature
    }).done(function(results) { //since success property of ajax request is depricated, used done function once request is successful
        var restaurants = results['businesses'];
        for (var x = 0; x < restaurants.length; x++) {
            var yelpTitle = restaurants[x]['name'];
            var yelpUrl = restaurants[x]['url'];
            $yelpElem.append('<li>' +
                '<a target="_blank" href="' + yelpUrl + '">' +
                '<h3>' + yelpTitle + '</h3>' +
                '</a>' +
                '</li>');
        }
        clearTimeout(yelpRequestTimeout); // to stop Timeout sunction if request is successful
    });

    return false;
}

$('#form-container').submit(loadData); // function call to load data from all APIs


/*--------------------------------------right column functionality script--------------------------------------*/

$('h2#yelp-header').click(function() {
    $('#yelp-links').toggle();
    $('.yelpBox').toggleClass('active');
});

$('h2#wikipedia-header').click(function() {
    $('#wikipedia-links').toggle();
    $('.wikiBox').toggleClass('active');
});

$(document).ready(function() {
    $(".fancybox").fancybox({
        beforeRender: function() {
            this.href = this.href + "?v=" + new Date().getTime();
        },
        'type': "image"
    });
});
