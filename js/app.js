/*
  GA SF JSD6
  Angela Tam
*/
$(document).ready(function(){
  	$("#popUp.loader").removeClass("hidden");
  	var loader = function(){
    	$("#popUp.loader").addClass("hidden");
    };
	function addReddit(info){
		$.each(info, function(i){
	      var $newImg = info[i].data.preview.images[0].source.url;
	      var $title = info[i].data.title;
	      var $impressions = info[i].data.ups;
	      var $category = info[i].data.subreddit;
	      var $link = info[i].data.url;
	      var $id = "redditNews";
	      var $description;
	      var $author = info[i].data.author;
	      var $date = new Date(info[i].data.created);
	      addToFeed($newImg, $title, $impressions, $category, $link, $id, $description, $author, $date);
		})	
	}
	function addDailyWtf(info){
		$.each(info, function(i){ 
	      var $newImg = info[i].Author.ImageUrl;
	      var $title = info[i].Title;
	      var $impressions = info[i].CachedCommentCount;
	      var $category = info[i].Series.Title;
	      var $link = info[i].Url;
	      var $id = "dailyWtfNews";
	      var $description = info[i].SummaryHtml;
	      var $author = info[i].Author.Name;
	      var $date = new Date(info[i].DisplayDate);
	      addToFeed($newImg, $title, $impressions, $category, $link, $id, $description, $author, $date);
		})
	}
  function addHacker(info){
      var $newImg = "https://news.ycombinator.com/favicon.ico";
      var $title = info.title;
      var $impressions = info.score;
      var $category = info.type;
      var $link = info.url;
      var $id = "hackerNewsNews";
      var $description = info.text;
      var $author = info.by;
      var $date = new Date(info.time);
      addToFeed($newImg, $title, $impressions, $category, $link, $id, $description, $author, $date);
	}
  function addToFeed(image, title, impressions, category, link, id, description, author, date){
  	$("#popUp.loader").addClass("hidden");
    var newClearfix = $("<div>").addClass("clearfix");
    var newImg = $("<img>").error(function(){
      $(this).attr("src", "https://repo.spydar007.com/packages/images/Reddit.png");
    }).attr("src", image);
		var newSection = $("<section>").append(newImg).addClass("featuredImage");
    var newH = $("<h3>").text(title).attr("data-url", link).attr("data-description", description).attr("data-author", author);
    var newImpressions = $("<section>").addClass("impressions").text(impressions);
    var newCategory = $("<h6>").text(category);
    var newLink = $("<a>").attr("href", "#").append(newH);
		var newContent = $("<section>").addClass("articleContent").append(newLink).append(newCategory);
    var newArticle = $("<article>").addClass("article").append(newSection, newContent, newImpressions, newClearfix).addClass(id).attr("data-date", date);
		$("#main").append(newArticle);
  }
  function sortDescending(a,b){
  	return new Date($(a).attr("data-date")) > new Date($(b).attr("data.date"));
  }
  function search(){
    var input, filter, article, a, i;
    input = $("input");
    article = $("article");
    articleTitle = $("article h3");
    filter = input.val().toUpperCase();
    for (i=0;i<article.length;i++){
      a = article[i].getElementsByTagName("a")[0];
      if(a.innerHTML.toUpperCase().indexOf(filter)>-1){
        article[i].style.display="";
      } else {
        article[i].style.display="none";
      }
    }
  }
	$.ajax("https://www.reddit.com/.json", {
		data: "jsonp",
		success: function(response){
			addReddit(response.data.children);
			}, 
		error: function(jqXHR, textStatus, errorThrown){
	      alert("An error has occured while loading the Reddit Feed. \nStatus code: " + jqXHR.status + "\nError thrown: " + errorThrown)
	    }
	});

  $.ajax("https://accesscontrolalloworiginall.herokuapp.com/http://thedailywtf.com/api/articles/recent/15", {
		data: "jsonp",
		success: function(response){
	      addDailyWtf(response);
			}, 
      error: function(jqXHR, textStatus, errorThrown){
	      alert("An error has occured while loading the Daily WTF feed. \nStatus code: " + jqXHR.status + "\nError thrown: " + errorThrown)
	    }
  });
  $.ajax("https://accesscontrolalloworiginall.herokuapp.com/https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty", {
		data: "jsonp",
		success: function(response){ 
	      for(var i=0;i<10;i++) {
	        $.ajax("https://accesscontrolalloworiginall.herokuapp.com/https://hacker-news.firebaseio.com/v0/item/" + response[i] + ".json?print=pretty", {
	          data: "jsonp",
	          success: function(nextResponse){
	            addHacker(nextResponse);
	          }, 
	          error: function(jqXHR, textStatus, errorThrown){
	      alert("An error has occured while loading the Hacker News feed. \nStatus code: " + jqXHR.status + "\nError thrown: " + errorThrown)
	        }
      	})
      }
		} 
	});
  
  // News Source Filter
  $("#source li a").on("click", function(){
  	$("#popUp.loader").removeClass("hidden");
    $("article").hide();
    var source = "." + $(this).attr("id") + "News";
    $(source).show();
    setTimeout(loader, 500);
    var sourceName = $(this).text();
    $("section.container span").text(sourceName);
  });
  // Article Popup Overlay
  $(document.body).on("click", ".articleContent a h3", function(){
    var title = $(this).text();
    var url = $(this).attr("data-url");
    var description = $(this).attr("data-description");
    var author = $(this).attr("data-author");
    $("#popUp").removeClass("hidden loader");
    $("#popUp h1").text(title);
    if (description) {
      $("#popUp p").html(description);
    } else {
      $("#popUp p").text("This story is by " + author );
    }
    $(".popUpAction").attr("href", url);
  })
  // Close popup 
  $(".closePopUp").on("click",function(){
    $("#popUp").addClass("hidden");
  })
  // Toggle Search
  $("#search img").on("click", function(){
  	$("section #search").toggleClass("active");
  })
  // Loading window 
  $("section.container a h1").on("click", function(){
  	setTimeout(loader, 500);
  	$("section.container span").text("Source Name");
  	$("article").show();
  })
  // Sort articles by date  
  $("article").sort(sortDescending);
  $("input").on("keyup", search);
})
