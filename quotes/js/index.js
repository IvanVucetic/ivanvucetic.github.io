function getQuote(){
  // using $.ajax instead of $getJSON because we need to pass API key as a header   
  $.ajax({
      url: "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous",
      headers: {"X-Mashape-Key": "vbjbSWXlRsmshIxi4FNe1E9txNvSp1m4dFsjsnAzfWWmIcTRvy",
              "Accept": "application/json"},
      method: "GET",
      success: function(jsonData) {
        // we don't want quotation marks around author's name
        var author = JSON.stringify(jsonData["author"]).replace(/\"/gi, '');
        $("blockquote p").text(JSON.stringify(jsonData["quote"]));
        $("blockquote footer").text(author);
        prepareTweet()
      },
      error: function () { alert('Error!')}
    });
};

// change the tweet link's params to reflect the current tweet;
// for some reason tweeter breaks text at ";"
function prepareTweet () {
  var tweetText = $("blockquote p").text() + " - " + $("blockquote footer").text();
  $(".twitter-share-button").attr("href", "https://twitter.com/intent/tweet?text=" + tweetText);
}

$(document).ready(function(){
  
  getQuote();
  
  $("#new-quote").on("click", function(){
    getQuote();
  })

})