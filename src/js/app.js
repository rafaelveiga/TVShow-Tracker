// =====================================
// API VARS
// =====================================
var api = {
	showID: 369, //2105
	key: "rKaf87VbXLvtXCNhYAjDHZcJfP7QYjvL"
}
var baseURL = "https://api-public.guidebox.com/v1.43/US/" + api.key +"/show/" + api.showID + "/";

var showTracker = {
	// =====================================
	// INIT
	// =====================================
	init: function() {
		console.log("Initializing app (init)");

		// Set Timeout to delay each function call because
		// we're working with an API that limits us to 1 request per second
		window.setTimeout( this.updateShowTitle, 1000 );
		window.setTimeout( this.listSeasons, 2000 );
		window.setTimeout( this.listEpisodes, 3000 );
		

		//this.updateShowTitle();
		//this.listSeasons();
		//this.listEpisodes();
	},

	// =====================================
	// UTILITY
	// =====================================
	// Formats dates into DD/MM/YYYY format
	formatDate: function(targetDate) {
		console.log("Formatting dates from API (formatDate)");

		var d;
		var m;
		var y;

		targetDate = new Date(targetDate);
		d = targetDate.getDate();
		m =  targetDate.getMonth();
		y = targetDate.getFullYear();

		m += 1;

		targetDate = d + "/" + m + "/" + y;

		return targetDate;
	},

	resetEpisodeTable: function() {
		console.log("Resetting episode table (resetEpisodeTable)");

		var thead = "<thead><tr><th>Thumb</th><th>Episódio</th><th>Descrição</th><th>Assistido</th></tr></thead>";
		$("#episodes").html(thead);

		var loading = '<img src="img/loading.gif" class="loader" width="20" alt="">'
		$("#episodes").parent().append(loading);
	},

	markEpisodeAsWatched: function(targetCheckbox) {
		console.log("Marking episode as Watched (markEpisodeAsWatched)");
		$(targetCheckbox).parent().parent().toggleClass("watched");
	},

	// =====================================
	// UPDATE TITLES
	// =====================================
	// UPDATES SHOW TITLE ON PAGE TITLE
	updateShowTitle: function() {
		console.log("Updating Show Title (updateShowTitle)");

		$.getJSON(baseURL, function(response) {
			$("h1").text(response.title);
		});
	},

	updateSeasonTitle: function(targetSeason) {
		console.log("Updating Season Title (updateSeasonTitle)");

		$("h3").text(targetSeason + "ª Temporada");
	},

	// =====================================
	// LIST ALL SEASONS
	// =====================================
	listSeasons: function() {
		console.log("Creating Season List (listSeasons)");

		//Imports formatDate utility
		var formatDate = showTracker.formatDate;
		//Creates URL for API query
		var seasonsURL = baseURL + "seasons";

		//API Query
		$.getJSON(seasonsURL, function(response) {
			var season = response.results;

			// Removes the loading icon from #seasons
			$("#seasons img.loader").remove();

			//Iterate through results
			$.each(season, function(index) {
				var seasonNumber  = this.season_number;
				var seasonAirDate = formatDate(this.first_airdate);

				//Creates the necessary HTML elements for each season list item
				var listItem = $("<li></li>");
				var link = $("<a>Link</a>");

				//Adds the attributes and the inner text for our created HTML item
				listItem.attr("data-season", seasonNumber);
				link.attr("href", "#");
				link.text(seasonNumber + "ª Temporada - " + seasonAirDate);

				//Appends the anchor link to the parent LI
				listItem.append(link);

				//Binds the listEpisodes(season) function to our HTML element 
				showTracker.bindSeasonEvents(listItem);

				//Appends the HTML element to the parent UL #seasons
				$("#seasons").append(listItem);
			});

			// Sets the first item on #seasons as active, since we're loading Season 1 first.
			$("#seasons").children().first().addClass("active");
		});
	},

	// =====================================
	// LIST ALL EPISODES
	// =====================================
	listEpisodes: function(season) {
		console.log("Creating Episode List (listEpisodes)");

		// If no parameter is passed, season value becomes 1
		// This is necessary for initialization, when no season list link was clicked
		season = season || 1;

		// URL for API Query
		var episodesURL = baseURL + "episodes/" + season + "/1/30";
		
		// API Query
		$.getJSON(episodesURL, function(response) {
			var episode = response.results;

			// Removes the loading icon from #episodes
			$("img.loader").remove();

			$.each(episode, function(i) {
				episodeNumber   = episode[i].episode_number;
				episodeTitle    = episode[i].title;
				episodeOverview = episode[i].overview;
				episodeThumb    = episode[i].thumbnail_208x117;

				//Creates the table row and all the necessary columns and its children
				var episodeRow        = $("<tr></tr>");

				var thumbColumn    = $("<td>");
				var episodeColumn  = $("<td>");
				var overviewColumn = $("<td>");
				var watchedColumn  = $("<td>");

				var thumbnail       = $("<img>");
				var watchedCheckbox = $("<input>");

				//Adding attributes and values to our created HTML elements
				thumbnail.attr("src", episodeThumb);
				episodeColumn.attr("width", "20%");
				watchedCheckbox.attr("type", "checkbox");

				episodeColumn.text(episodeNumber + ' - ' + episodeTitle);
				overviewColumn.text(episodeOverview);

				//Appending all elements together and under episodeRow
				thumbColumn.append(thumbnail);
				watchedColumn.append(watchedCheckbox);

				episodeRow.append([thumbColumn, episodeColumn, overviewColumn, watchedColumn]);

				//Binds the markEpisodeAsWatched() function to the click event on checkbox
				showTracker.bindEpisodeEvents(watchedCheckbox);

				$("#episodes").prepend(episodeRow);
			});
		});
	},

	// =====================================
	// BIND CLICK EVENTS TO SEASON BUTTONS
	// =====================================
	//Binds the listEpisodes function() to our targetListItem...
	//...and changes its class to active...
	bindSeasonEvents: function(targetListItem) {
		console.log("Binding events to Season List (bindSeasonEvents)");
		
		$(targetListItem).click(function() {
			$(this).addClass("active");
			$(this).siblings().removeClass("active");

			var targetSeason = $(this).attr("data-season");

			showTracker.resetEpisodeTable();
			showTracker.updateSeasonTitle(targetSeason);
			showTracker.listEpisodes(targetSeason);
		});
	},

	//Binds the markEpisodeAsWatched() to the episode checkbox
	bindEpisodeEvents: function(targetListItem) {
		console.log("Binding events to Episode List (bindEpisodeEvents)");

		$(targetListItem).click(function() {
			showTracker.markEpisodeAsWatched(this);
		});
	}
}


showTracker.init();	
		
//When episode checkbox is clicked
	//Add .watched class to it's table row