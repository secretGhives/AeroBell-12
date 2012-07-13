$(function() {
	sessionStorage.setItem('success', 'no');
});

$("#main_screen").live('pageinit', function() {

    if(!html5sql.database){
	
        html5sql.openDatabase("FlightBoard", "AeroBell Flight Board", 5*1024*1024);
		
		$.get('setup.sql',function(sqlStatements){
			html5sql.process(
				sqlStatements,
				function(){

				},
				function(error, statement){
					console.error("Error: " + error.message + " when processing " + statement);
				}
			);
		});
		
    }
    
	html5sql.logInfo = true;
	html5sql.logErrors = true;
	html5sql.putSelectResultsInArray = true;

});


$('#main_screen').live('pageshow', function(event, ui) {
	
		if (sessionStorage.getItem('success') == 'yes' ) {
			alert('Flight added sucessfully');
			sessionStorage.setItem('success', 'no');
		}

});

$("#new_person").live('pageinit', function() {

	$("form").submit(function(event) {
	
		event.stopPropagation();
		event.preventDefault();

		var id = $('#flightId').val();
		var flightStatus = $('nf-status').val();  
		var flightAircraft = $('nf-aircraft').val();  
		var flightDate = $('nf-date').val();  
		var flightDeparture = $('nf-departure').val();  
		var flightArrival = $('nf-arrival').val();  
		var flightPilot = $('nf-pilot').val();  
		var flightCopilot = $('nf-copilot').val();  
		var flightPassangers = $('nf-pax').val();
		var flightRoute = $('nf-route').val();
		var flightNotes = $('nf-notes').val();


		html5sql.process(
			[
				"INSERT INTO Flights (flightStatus, flightAircraft, flightDate, flightDeparture, flightArrival, flightPilot, flightCopilot, flightPassangers, flightRoute, flightNotes) VALUES ('" + flightStatus + "','" + flightAircraft + "','" + flightDate + "','" + flightDeparture + "','" + flightArrival + "','" + flightPilot + "','" + flightCopilot + "','" + flightPassangers + "','" + flightRoute + "','" + flightNotes + "')"
			],
			function(){
				
				// success flag using session storage
				// useful becuase index.html can display a nice message to use on success
				
				sessionStorage.setItem('success', 'yes');
				
				console.log("saved");
				
			},
			function(error, statement){
				console.error("Error: " + error.message + " when processing " + statement);
			}        
		);

		return false;
		});
	
	
	
});


$("#saved_people").live('pageinit', function() {

	html5sql.putSelectResultsInArray = true;
	html5sql.process(
		[
		    "SELECT * FROM Flights ORDER BY flightDeparture"
		],
		function(transaction, results, rowArray) {
		
			var html = '';

			$.each(rowArray, function(index, value) { 
			
			  html += 
            '<tr class="' + item['flightStatus'] + '">' + 
            '<td class="first"><label class="status">' + value.flightStatus + '</label></td>' + 
            '<td class=""><label class="aircraft">' + value.flightAircraft + '</label></td>' + 
            '<td class=""><label class="aircraft">' + value.flightDeparture + '</label></td>' + 
            '<td class=""><label class="aircraft">' + value.flightArrival + '</label></td>' + 
            '<td class=""><label class="aircraft">' + value.flightPilot + '</label></td>' +
            '<td class=""><label class="aircraft">' + value.flightCopilot + '</label></td>' +
            '<td class=""><label class="aircraft">' + value.flightPassangers + '</label></td>' +
            '<td class=""><label class="route">' + value.flightRoute + '</label></td>' +
            '<td class=""><label class="aircraft">' + value.flightNotes + '</label></td>' +
            '</tr>';
			  
			});
			
			html += '</ul>';
			
			$('#people_list').append(html);
			$('#people_list').listview('refresh');
			
		},
		function(error, statement){
			console.error("Error: " + error.message + " when processing " + statement);
		}        
	);

});
