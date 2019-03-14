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
class Editor extends Field {

	/**
	 * Sets the control type.
	 *
	 * @access protected
	 */
	protected function set_type() {
		global $wp_version;

		if ( version_compare( $wp_version, '4.8' ) >= 0 ) {
			$this->type = 'kirki-editor';
			return;
		}

		// Fallback for older WordPress versions.
		$this->type = 'kirki-generic';
		if ( ! is_array( $this->choices ) ) {
			$this->choices = [];
		}
		$this->choices['element'] = 'textarea';
		$this->choices['rows']    = '5';
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
		$this->sanitize_callback = 'wp_kses_post';
	}
}