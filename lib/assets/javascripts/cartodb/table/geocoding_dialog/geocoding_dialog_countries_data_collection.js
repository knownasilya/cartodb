
  /**
   *  Geocoding countries data collection
   *
   */

  cdb.admin.GeocodingDialog.Content.CountriesData = Backbone.Collection.extend({

    url: "/api/v1/geocodings/all_country_data/",

    comparator: function(c) {
      return c.get('country')
    },

    parse: function(r) {
      // Object to Array! :(
      var arr = _.map(r, function(c, key){
        return _.extend(c, { country: key });
      });

      // Add world to the array
      arr.unshift({
        country:    "World",
        admin1:     ['polygon'],
        postalcode: [],
        namedplace: []
      })

      return arr;
    }

  });