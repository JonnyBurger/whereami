      //
      // End of round map
      //

      function rminitialize() {
        locLatLongs = window.locLL.toString();
        guessLatLongs = window.guessLatLng.toString();
        var currentLLArr = locLatLongs.replace(/[\])}[{(]/g,'').split(',');
        var GuessLLArr = guessLatLongs.replace(/[\])}[{(]/g,'').replace(/\s/g, "").split(',');
        var actualLtLng = new google.maps.LatLng(currentLLArr[0],currentLLArr[1]);
        var guessLtLng = new google.maps.LatLng(GuessLLArr[0],GuessLLArr[1]);

        var mapOptions = {
          zoom: 2,
          center: actualLtLng,
          mapTypeControl: false,
          streetViewControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(document.getElementById("roundMap"), mapOptions);

        var actualMarker = new google.maps.Marker({
            position: actualLtLng,
            title:"Actual Location",
            icon: 'img/actual.png'
        });

        var guessMarker = new google.maps.Marker({
            position: guessLtLng,
            title:"Your Guess",
            icon: 'img/guess.png'
        });

        // To add the marker to the map, call setMap();
        actualMarker.setMap(minimap);
        guessMarker.setMap(minimap);
        // All markers should be visible
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(actualLtLng);
        bounds.extend(guessLtLng);
        minimap.fitBounds(bounds);
      };