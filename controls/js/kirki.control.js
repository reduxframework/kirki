var kirki = kirki || {};
kirki.control = {

	'kirki-background': {},

	'kirki-code': {},

	'kirki-color': {

		/**
		 * Get the HTML for the control.
		 *
		 * @since 3.1.0
		 * @param {object} [args] The control arguments.
		 * @returns {string}
		 */
		template: function( args ) {
			var html = '';

			html += '<label>';
				html += ( '' !== args.label ) ? '<span class="customize-control-title">' + args.label + '</span>' : '';
				html += ( '' !== args.description ) ? '<span class="description customize-control-description">' + args.description + '</span>' : '';

				html += kirki.input.color.template( args );
			html += '</label>';

			return html;
		},

		/**
		 * Init the control.
		 *
		 * @since 3.1.0
		 * @param {object} [args] The arguments.
		 * @returns {void}
		 */
		init: function( args ) {
			kirki.input.color.init( args );
		}
	},

	'kirki-colol-palette': {},

	'kirki-custom': {},

	'kirki-dashicons': {},

	'kirki-date': {},

	'kirki-dimension': {},

	'kirki-dimensions': {},

	'kirki-editor': {},

	'kirki-fontawesome': {},

	'kirki-generic': {},

	'kirki-image': {},

	'kirki-multicheck': {},

	'kirki-multicolor': {},

	'kirki-number': {},

	'kirki-palette': {},

	'kirki-preset': {},

	'kirki-radio': {

		/**
		 * Get the HTML for the control.
		 *
		 * @since 3.1.0
		 * @param {object} [args] The control arguments.
		 * @returns {string}
		 */
		template: function( args ) {
			var html = '';
			args = _.defaults( args, {
				choices: {},
				label: '',
				description: ''
			} );

			html += ( '' !== args.label ) ? '<span class="customize-control-title">' + args.label + '</span>' : '';
			html += ( '' !== args.description ) ? '<span class="description customize-control-description">' + args.description + '</span>' : '';
			html += kirki.input.radio.template( args );

			return html;
		},

		/**
		 * Init for radio control.
		 *
		 * @since 3.1.0
		 * @param {object} [args] The arguments.
		 * @returns {void}
		 */
		init: function( args ) {
			kirki.input.radio.init( args );
		}
	},

	'kirki-radio-buttonset': {},

	'kirki-radio-image': {},

	'kirki-repeater': {},

	'kirki-select': {},

	'kirki-slider': {},

	'kirki-sortable': {},

	'kirki-switch': {},

	'kirki-toggle': {},

	'kirki-typography': {},

	/**
	 * An object containing template-specific functions.
	 *
	 * @since 3.1.0
	 */
	template: {

		/**
		 * Gets the HTML for control headers.
		 *
		 * @since 3.1.0
		 * @param {object} [control] The control object.
		 * @return {string}
		 */
		header: function( control ) {
			var html = '';

			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			if ( control.params.description && '' !== control.params.description ) {
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			}
			return html;
		}
	},

	setValue: function() {}

};