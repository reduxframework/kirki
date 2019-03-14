<?php
/**
 * Override field methods
 *
 * @package     Kirki
 * @subpackage  Controls
 * @copyright   Copyright (c) 2019, Ari Stathopoulos (@aristath)
 * @license    https://opensource.org/licenses/MIT
 * @since       2.2.7
 */

namespace Kirki\Field;

use Kirki\Core\Field;

/**
 * Field overrides.
 */
class Multicolor extends Field {

	/**
	 * Sets the control type.
	 *
	 * @access protected
	 */
	protected function set_type() {

		$this->type = 'kirki-multicolor';

	}

	/**
	 * Sets the $choices
	 *
	 * @access protected
	 */
	protected function set_choices() {

		// Make sure choices are defined as an array.
		if ( ! is_array( $this->choices ) ) {
			$this->choices = [];
		}

	}

	/**
	 * Sets the $sanitize_callback
	 *
	 * @access protected
	 */
	protected function set_sanitize_callback() {

		// If a custom sanitize_callback has been defined,
		// then we don't need to proceed any further.
		if ( ! empty( $this->sanitize_callback ) ) {
			return;
		}
		$this->sanitize_callback = [ $this, 'sanitize' ];

	}

	/**
	 * The method that will be used as a `sanitize_callback`.
	 *
	 * @param array $value The value to be sanitized.
	 * @return array The value.
	 */
	public function sanitize( $value ) {
		return $value;
	}
}