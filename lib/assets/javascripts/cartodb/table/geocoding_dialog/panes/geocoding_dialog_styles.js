  
  /**
   *  View to select the type of the geometry (points or polygons)
   *  for the geocoder selected.
   *
   */

  cdb.admin.GeocodingDialog.Content.Styles = cdb.core.View.extend({

    tagName:    "ul",
    className:  "geocoding-pane-styles",

    events: {
      "click .opt": "_onGeometryTypeClick"
    },

    initialize: function() {
      this.template = cdb.templates.getTemplate('table/views/geocoding_dialog/geocoding_dialog_styles');
      this.countries_data = this.options.countries_data;
      this._initBinds();
    },

    render: function() {
      this.clearSubViews();
      this.$el.empty();

      this.$el.append(
        this.template({
          point:    this._validGeometry('point'),
          polygon:  this._validGeometry('polygon')
        })
      );

      this._initViews();

      return this;
    },

    _initBinds: function() {
      _.bindAll(this, '_onGeometryTypeClick');
      this.model.bind('change:country_code',  this.render, this);
      this.model.bind('change:geometry_type', this._onGeometryChange, this);
      this.model.bind('change:step',          this._onStepChange, this);
    },

    _initViews: function() {
      // Tipsy?
      var tooltip = new cdb.common.TipsyTooltip({
        el: this.$("span em"),
        title: function() {
          return $(this).attr("data-title")
        }
      })
      this.addView(tooltip);
    },

    _onStepChange: function() {
      var step = this.model.get('step');
      var self = this;

      if (step !== 0) {
        // Set first available type
        if (this._validGeometry('point')) {
          this.model.set('geometry_type', 'point');
        } else if (this._validGeometry('polygon')) {
          this.model.set('geometry_type', 'polygon');
        }
      }

      setTimeout(function() {
        self.$('li.selected')[step === 0 ? 'removeClass' : 'addClass' ]('animated');
      }, 500)
    },

    _onGeometryChange: function() {
      var geometry_type = this.model.get("geometry_type");

      this.$("li").removeClass("selected");
      
      if (geometry_type)  {
        this.$("li." + geometry_type).addClass("selected");
      }
    },

    // Get if a geometry is valid for that country code
    _validGeometry: function(geometry) {
      var country_code = this.model.get('country_code');
      
      if (country_code) {
        var country = _.first(this.countries_data.where({ country: country_code }));
        
        if (country) {
          var values = country.get(this.model.get('kind'));
          return _.contains(values, geometry);

        } else if (country_code === "the World") {
          return geometry === "point" ? true : false
        }
      }

      return false;
    },

    _onGeometryTypeClick: function(e) {
      if (e) this.killEvent(e);

      var $option = $(e.target).closest("a");
      var geometry_type = $option.attr("href").replace('#/', '');

      if (this._validGeometry(geometry_type)) {
        this.model.set("geometry_type", geometry_type);
      }
    }

  });