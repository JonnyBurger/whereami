      //
      // Streetview Map
      //

      function svinitialize() {
        GUESSMADE = false;
        // Get Coords
        socket.emit('get-random-coordinates');
        socket.once('random-coordinates', function(data) {
          coordinatesCallback(data);
        });
      };
      var updateInterval
      function coordinatesCallback(data) {
          var randCoord = data.coordinates;
          setTimeout(timeup, data.remaining);
          $('.round b').text(data.round+'/5');
          if (updateInterval != undefined) {
            clearInterval(updateInterval);
          }
          updateInterval = setInterval(function() {
            data.remaining -= 1000;
            $('#timeleft').text(Math.floor(data.remaining/1000));
          }, 1000)
          coordArrayLatLongs = randCoord.replace(/[\])}[{(]/g,'').split(',');

          window.locLL = coordArrayLatLongs[0]+","+coordArrayLatLongs[1];

          // Do streetview
          var whoamiLocation = new google.maps.LatLng(coordArrayLatLongs[0],coordArrayLatLongs[1]);
          var streetViewService = new google.maps.StreetViewService();
          var STREETVIEW_MAX_DISTANCE = 99999999;

          streetViewService.getPanoramaByLocation(whoamiLocation, STREETVIEW_MAX_DISTANCE, function (streetViewPanoramaData, status) {
            console.log(streetViewPanoramaData, status);
              if (status === google.maps.StreetViewStatus.OK) {

                // We have a streetview pano for this location, so let's roll
                var panoramaOptions = {
                  position: whoamiLocation,
                  addressControl: false,
                  linksControl: false,
                  pov: {
                    heading: 270,
                    zoom: 1,
                    pitch: -10
                  },
                  visible: true
                };
                var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);

              } else {
                  // no street view available in this range, or some error occurred
                  alert('Streetview is not available for this location :(');
              }
          });

      }
      function timeup() {
          svinitialize();
          mminitialize();
      }
      setInterval(function() {

      }, 1000)