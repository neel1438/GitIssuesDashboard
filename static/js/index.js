$(function () {
	'use strict';
	$(".dataRow").hide();
	//submit click handler 
	$('[data-action="submit"]').click( function (e) {
		e.preventDefault();

		//parsing the url for owner name and repository name
		var link = $('#repoLink').val();
		//empty input handling
		if(link === ""){
			Materialize.toast('Please fill in the url and press submit', 5000, 'danger');
			return;
		}

		//stripping unncessary things from url
		link =link.replace("https://","");
		link =link.replace("http://","");
		link =link.replace(".git","");
		var repoOwner = link.split("/")[1];
		var repoName = link.split("/")[2];

		//checking if repository is from github (hack,better solutions exist!) 
		if(link.split("/")[0].indexOf("github.com") <0){
			Materialize.toast('Only works with github.com repos', 5000, 'danger');
			return;
		}

		//helper variables and functions for rendering fetched data
		var last24Hours=moment().subtract(1,'day');
		var last7DayEnd = moment().subtract(7,'day');
		function setHtml(selector,data) {
			var html= "<ul>";
			_.each(data,function(item){
				html+='<li class="listItem"><a class="issueLink" target="_blank" href="'+item.html_url+'">'+item.title+'</a><div class="agoText">Last Updated '+ moment(item.updated_at).fromNow()+'</div></li>'
			});
		    html +=	"</ul>";
		    $(selector).html(html);	
		};

		//getting the data from github puclic api.
		$.get('https://api.github.com/repos/'+repoOwner+"/"+repoName+"/issues?state=open&per_page=100" ,function (data){
			$(".dataRow").show();
			$('.repoTitle').html(repoName);

			//removing pull requests as github treats pull requests as issues as well
			var allData =_.filter(data,function(item){
				return !item.pull_request ;
			});

			//rendering all the data in all tab
			$('.all').html('All ('+allData.length+")");
			setHtml("#all",allData);

			//filtering data for different time frames and rendering the data
			var last24hoursData =_.filter(allData,function(item){
				return moment(item.created_at).isAfter(last24Hours);
			});
			$('.24h').html('Last 24 hours ('+last24hoursData.length+")");
			setHtml("#24h",last24hoursData);

			var lastWeekData =_.filter(allData,function(item){
				return moment(item.created_at).isBefore(last24Hours) && moment(item.created_at).isAfter(last7DayEnd);
			});
			$('.7d').html('Last 7 days ('+lastWeekData.length+")");
			setHtml("#7d",lastWeekData);

			var greaterThanWeekData =_.filter(allData,function(item){
				return moment(item.created_at).isBefore(last7DayEnd);
			});
			$('.gt7d').html("More Than 7 days Older ("+greaterThanWeekData.length+")");
			setHtml("#gt7d",greaterThanWeekData);
			
		}).fail( function(){  //handling error from api.
			Materialize.toast('Some error occured please try again later!', 5000, 'danger');
		});
	});
});