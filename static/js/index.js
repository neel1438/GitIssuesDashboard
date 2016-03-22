$(function () {
	'use strict';
	$('[data-action="submit"]').click( function (e) {
		e.preventDefault();
		var link = $('#repoLink').val();
		if(link === ""){
			Materialize.toast('Please fill in the url and press submit', 5000, 'danger');
			return;
		}
		link =link.replace("https://","");
		link =link.replace("http://","");
		link =link.replace(".git","");
		var repoOwner = link.split("/")[1];
		var repoName = link.split("/")[2];
		if(link.split("/")[0].indexOf("github") <0){
			Materialize.toast('Only works with github.com repos', 5000, 'danger');
			return;
		}

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
		$.get('https://api.github.com/repos/'+repoOwner+"/"+repoName+"/issues?state=open&per_page=100" ,function (data){
			var allData =_.filter(data,function(item){
				return !item.pull_request ;
			});
			$('.all').html('All('+allData.length+")");
			setHtml("#all",allData);
			var last24hoursData =_.filter(allData,function(item){
				return moment(item.created_at).isAfter(last24Hours);
			});
			$('.24h').html('Last 24 hours('+last24hoursData.length+")");
			setHtml("#24h",last24hoursData);
			var lastWeekData =_.filter(allData,function(item){
				return moment(item.created_at).isBefore(last24Hours) && moment(item.created_at).isAfter(last7DayEnd);
			});
			$('.7d').html('Last 7 days('+lastWeekData.length+")");
			setHtml("#7d",lastWeekData);
			var greaterThanWeekData =_.filter(allData,function(item){
				return moment(item.created_at).isBefore(last7DayEnd);
			});
			$('.gt7d').html("More Than 7 days Older ("+greaterThanWeekData.length+")");
			setHtml("#gt7d",greaterThanWeekData);
			
		}).fail( function(){
			Materialize.toast('Some error occured please try again later!', 5000, 'danger');
		});
	});
});