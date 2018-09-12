/* global ajaxurl */
var kirki = kirki || {};
kirki = jQuery.extend( kirki, {

	/**
	 * A collection of utility methods.
	 *
	 * @since 3.0.17
	 */
	util: {

		/**
		 * A collection of utility methods for webfonts.
		 *
		 * @since 3.0.17
		 */
		webfonts: {

			/**
			 * Google-fonts related methods.
			 *
			 * @since 3.0.17
			 */
			google: {

				/**
				 * An object containing all Google fonts.
				 *
				 * to set this call this.setFonts();
				 *
				 * @since 3.0.17
				 */
				fonts: {},

				/**
				 * Init for google-fonts.
				 *
				 * @since 3.0.17
				 * @returns {null}
				 */
				initialize: function() {
					var self = this;

					self.setFonts();
				},

				/**
				 * Set fonts in this.fonts
				 *
				 * @since 3.0.17
				 * @returns {null}
				 */
				setFonts: function() {
					var self = this;

					// No need to run if we already have the fonts.
					if ( ! _.isEmpty( self.fonts ) ) {
						return;
					}

					// Make an AJAX call to set the fonts object (alpha).
					jQuery.post( ajaxurl, { 'action': 'kirki_fonts_google_all_get' }, function( response ) {

						// Get fonts from the JSON array.
						self.fonts = JSON.parse( response );
					} );
				},

				/**
				 * Gets all properties of a font-family.
				 *
				 * @since 3.0.17
				 * @param {string} family - The font-family we're interested in.
				 * @returns {Object}
				 */
				getFont: function( family ) {
					var self = this,
						fonts = self.getFonts();

					if ( 'undefined' === typeof fonts[ family ] ) {
						return false;
					}
					return fonts[ family ];
				},

				/**
				 * Gets all properties of a font-family.
				 *
				 * @since 3.0.17
				 * @param {string} order - How to order the fonts (alpha|popularity|trending).
				 * @param {int}    number - How many to get. 0 for all.
				 * @returns {Object}
				 */
				getFonts: function( order, category, number ) {
					var self        = this,
						ordered     = {},
						categorized = {},
						plucked     = {};

					// Make sure order is correct.
					order  = order || 'alpha';
					order  = ( 'alpha' !== order && 'popularity' !== order && 'trending' !== order ) ? 'alpha' : order;

					// Make sure number is correct.
					number = number || 0;
					number = parseInt( number, 10 );

					// Order fonts by the 'order' argument.
					if ( 'alpha' === order ) {
						ordered = jQuery.extend( {}, self.fonts.items );
					} else {
						_.each( self.fonts.order[ order ], function( family ) {
							ordered[ family ] = self.fonts.items[ family ];
						} );
					}

					// If we have a category defined get only the fonts in that category.
					if ( '' === category || ! category ) {
						categorized = ordered;
					} else {
						_.each( ordered, function( font, family ) {
							if ( category === font.category ) {
								categorized[ family ] = font;
							}
						} );
					}

					// If we only want a number of font-families get the 1st items from the results.
					if ( 0 < number ) {
						_.each( _.first( _.keys( categorized ), number ), function( family ) {
							plucked[ family ] = categorized[ family ];
						} );
						return plucked;
					}

					return categorized;
				},

				/**
				 * Gets the variants for a font-family.
				 *
				 * @since 3.0.17
				 * @param {string} family - The font-family we're interested in.
				 * @returns {Array}
				 */
				getVariants: function( family ) {
					var self = this,
						font = self.getFont( family );

					// Early exit if font was not found.
					if ( ! font ) {
						return false;
					}

					// Early exit if font doesn't have variants.
					if ( _.isUndefined( font.variants ) ) {
						return false;
					}

					// Return the variants.
					return font.variants;
				}
			},

			/**
			 * Standard fonts related methods.
			 *
			 * @since 3.0.17
			 */
			standard: {

				/**
				 * An object containing all Standard fonts.
				 *
				 * to set this call this.setFonts();
				 *
				 * @since 3.0.17
				 */
				fonts: {},

				/**
				 * Init for google-fonts.
				 *
				 * @since 3.0.17
				 * @returns {null}
				 */
				initialize: function() {
					var self = this;

					self.setFonts();
				},

				/**
				 * Set fonts in this.fonts
				 *
				 * @since 3.0.17
				 * @returns {null}
				 */
				setFonts: function() {
					var self = this;

					// No need to run if we already have the fonts.
					if ( ! _.isEmpty( self.fonts ) ) {
						return;
					}

					// Make an AJAX call to set the fonts object.
					jQuery.post( ajaxurl, { 'action': 'kirki_fonts_standard_all_get' }, function( response ) {

						// Get fonts from the JSON array.
						self.fonts = JSON.parse( response );
					} );
				},

				/**
				 * Gets the variants for a font-family.
				 *
				 * @since 3.0.17
				 * @returns {Array}
				 */
				getVariants: function() {
					return [ 'regular', 'italic', '700', '700italic' ];
				}
			},

			/**
			 * Figure out what this font-family is (google/standard)
			 *
			 * @since 3.0.20
			 * @param {string} family - The font-family.
			 * @returns {string|false} - Returns string if found (google|standard)
			 *                           and false in case the font-family is an arbitrary value
			 *                           not found anywhere in our font definitions.
			 */
			getFontType: function( family ) {
				var self = this;

				// Check for standard fonts first.
				if (
					'undefined' !== typeof self.standard.fonts[ family ] || (
						'undefined' !== typeof self.standard.fonts.stack &&
						'undefined' !== typeof self.standard.fonts.stack[ family ]
					)
				) {
					return 'standard';
				}

				// Check in googlefonts.
				if ( 'undefined' !== typeof self.google.fonts.items[ family ] ) {
					return 'google';
				}
				return false;
			}
		},

		validate: {
			cssValue: function( value ) {

				var validUnits = [ 'fr', 'rem', 'em', 'ex', '%', 'px', 'cm', 'mm', 'in', 'pt', 'pc', 'ch', 'vh', 'vw', 'vmin', 'vmax' ],
					numericValue,
					unit;

				// Early exit if value is undefined.
				if ( 'undefined' === typeof value ) {
					return true;
				}

				// Whitelist values.
				if ( 0 === value || '0' === value || 'auto' === value || 'inherit' === value || 'initial' === value ) {
					return true;
				}

				// Skip checking if calc().
				if ( 0 <= value.indexOf( 'calc(' ) && 0 <= value.indexOf( ')' ) ) {
					return true;
				}

				// Get the numeric value.
				numericValue = parseFloat( value );

				// Get the unit
				unit = value.replace( numericValue, '' );

				// Allow unitless.
				if ( ! value ) {
					return;
				}

				// Check the validity of the numeric value and units.
				return ( ! isNaN( numericValue ) && -1 < jQuery.inArray( unit, validUnits ) );
			}
		},
		
		helpers: {
			media_query: function( control, init_enabled, callbacks )
			{
				if ( _.isUndefined( control.params.choices.media_queries ) )
				{
					return;
				}
				var container = control.container,
					desktop_btn = container.find( '.kirki-respnsive-switchers li.desktop' ),
					tablet_btn = container.find( '.kirki-respnsive-switchers li.tablet' ),
					mobile_btn = container.find( '.kirki-respnsive-switchers li.mobile' ),
					preview_desktop = jQuery( 'button.preview-desktop' ),
					preview_tablet = jQuery( 'button.preview-tablet' ),
					preview_mobile = jQuery( 'button.preview-mobile' ),
					active_device = 0,
					enabled = init_enabled;
				desktop_btn.click( function(e)
				{
					e.preventDefault();
					e.stopImmediatePropagation();
					if ( !tablet_btn.hasClass( 'active' ) && !mobile_btn.hasClass( 'active' ) )
					{
						desktop_btn.toggleClass( 'multiple' );
						if ( desktop_btn.hasClass( 'multiple' ) )
						{
							enabled = true;
							tablet_btn.removeClass( 'hidden' );
							mobile_btn.removeClass( 'hidden' );
						}
						else
						{
							enabled = false;
							tablet_btn.addClass( 'hidden' );
							mobile_btn.addClass( 'hidden' );
							callbacks.device_change( active_device, enabled );
						}
					}
					else
					{
						active_device = 0;
						tablet_btn.removeClass( 'active' );
						mobile_btn.removeClass( 'active' );
						callbacks.device_change( active_device, enabled );
					}
					preview_desktop.click();
					//$( '.kirki-respnsive-switchers li.desktop' ).not( desktop_btn ).click();
				});
				tablet_btn.click( function(e)
				{
					e.preventDefault();
					e.stopImmediatePropagation();
					active_device = 1;
					mobile_btn.removeClass( 'active' );
					tablet_btn.addClass( 'active' );
					preview_tablet.click();
					//$( '.kirki-respnsive-switchers li.tablet' ).not( tablet_btn ).click();
					callbacks.device_change( active_device, enabled );
				});
				mobile_btn.click( function(e)
				{
					e.preventDefault();
					e.stopImmediatePropagation();
					active_device = 2;
					mobile_btn.addClass( 'active' );
					tablet_btn.removeClass( 'active' );
					preview_mobile.click();
					//$( '.kirki-respnsive-switchers li.mobile' ).not( mobile_btn ).click();
					callbacks.device_change( active_device, enabled );
				});
				if ( init_enabled )
					desktop_btn.click();
			},
			input_sync: function( control, inputs, events, callback, input_sanitize )
			{
				$( inputs ).on( events, function( e )
				{
					var input = $( this ),
						val = null;
					if ( input_sanitize )
					{
						input_sanitize( input, inputs );
					}
					else
					{
						var val = input.val();
						inputs.val ( val );
					}
					callback();
				});
			}
		},

		/**
		 * Parses HTML Entities.
		 *
		 * @since 3.0.34
		 * @param {string} str - The string we want to parse.
		 * @returns {string}
		 */
		parseHtmlEntities: function( str ) {
			var parser = new DOMParser,
				dom    = parser.parseFromString(
					'<!doctype html><body>' + str, 'text/html'
				);

			return dom.body.textContent;
		}
	}
} );
