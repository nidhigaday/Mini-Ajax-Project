# Mini-Ajax-Project
Used API keys to pull data from Same and Cross origin requests.
<br>Language used - Javascript

##Synopsis

This is a small project to practice with API keys to pull data from another source using .ajax and .getJson requests. Also, error handling if in some case request fails. The steps and instructions are given in Udacity 'Intro to Ajax' course.

##How the script works?

There are two script files - script.js and config.js.Script.js contain the function and script that requests the data from the sources using API Keys. Since, API keys/Secret keys are sensetive data, they are preferred to be saved separately. (Please replace the sample keys with your own keys).
<br><br>For this project, I used 3 sources to display data:- 
####New York Times - API not required  (<a href="https://developer.nytimes.com/" target="_blank">Documentation</a>)
<br>NYT allows Cross-domain requests and data can be requested using .getJason()
####Wikipedia - API not required (<a href="https://www.mediawiki.org/wiki/API:Main_page" target="_blank">Documentation</a>)
<br> Wikioedia does not allowcross-domain requests, As a work around we can make a jsonp request. We can request using .ajax() with required parameters - Datatype: jsonp and a callback function to receive the data.
####Google Map Street view - API required (<a href="https://developers.google.com/maps/documentation/streetview/" target="_blank">Documentation</a>)
<br> Allows Cross-domain request(CORS) and can be implemented fairly easy
####Yelp - Consumer key required (<a href="https://www.yelp.com/developers/documentation/v2/overview" target="_blank">Documentation</a>)
<br> Yelp is bit tricky. You need all the parameters listed in documentation. Most important of them is Oauth_signature, which is unique to each submitted request. There are many ways to do it, I used Node.js to generate it. Please see the section on Oauth_signaute for details.
##Oauth_signature
I used oauthSignature.generate() to generate the signature which is unique to each CORS request. This function requires Server environment. Nofde.js would be the easiest way to do so.
<br>You can download Node.js from <a href="https://nodejs.org/en/" target="_blank">here</a>. <a href="https://github.com/bettiolo/oauth-signature-js" target="_blank">Steps</a> to install Node on local machine 
<br>Make sure to put oauth_signature_method: "HMAC-SHA1" (capital case)
<br>Token and Oauth_signautre are different.  These parameters used to generate a signature - 
<br>    Generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
<br>    encodedSignature = oauthSignature.generate(Method, url, parameters, consumer_Secret, token_Secret);  
<br>    Generates a BASE64 encode HMAC-SHA1 hash
<br>    var signature = oauthSignature.generate(Method, url, parameters, consumerSecret, tokenSecret, { encodeSignature: true});    
<br>    Method: GET
<br>    Url: where request is being sent
<br>    Parameters: Oauth_nounce (randomly generated string), Oauth_timestamp (unique timestamp for each request),see Yelp documentation for remaing parameters
####Error: 
You may receive Invalid Signature or location error with the Yelp API. Error message is important and tells you which information is faulty.
<br>I used this link to test my API requests and to locate the fault - <a href="http://bettiolo.github.io/oauth-reference-page/" target="_blank">Reference page</a>
##Error Handling
There can be many causes an error occurs like data not available. In those cases, we need to implement a request failure message.To achive this, I used setTimeout() and clearTimeout()
###API Keys
API Keys are sensetive information. While working with Javascript, there is no robust way to hide the information. There are ways to ignore the file by putting keys containing file informaiton in .gitignore and they needs to be outside Version control. 
