/**
 * Authentication for keyfile auth plugin
 *
 * @module package/sequry/auth-keyfile/bin/controls/Authentication
 * @author www.pcsg.de (Patrick Müller)
 *
 * @event onSubmit
 */
define('package/sequry/auth-keyfile/bin/controls/Authentication', [

    'package/sequry/core/bin/controls/authPlugins/Authentication',
    'package/sequry/auth-keyfile/bin/controls/KeyFileUploadForm',
    'Locale',

    'css!package/sequry/auth-keyfile/bin/controls/Authentication.css'

], function (AuthenticationBaseClass, KeyFileUploadForm, QUILocale) {
    "use strict";

    var lg = 'sequry/auth-keyfile';

    return new Class({

        Extends: AuthenticationBaseClass,
        Type   : 'package/sequry/auth-keyfile/bin/controls/Authentication',

        Binds: [
            'getAuthData'
        ],

        initialize: function (options) {
            this.parent(options);
            this.$UploadForm = null;
            this.$Content    = null;
        },

        /**
         * Event: onImport
         */
        $onImport: function () {
            this.parent();

            this.$Content = new Element('div', {
                html: '<div class="gpm-auth-keyfile-authentication-upload">' +
                '<label>' +
                '<span class="gpm-auth-keyfile-authentication-title">' +
                QUILocale.get(lg, 'authentication.upload.label') +
                '</span>' +
                '<div class="gpm-auth-keyfile-upload"/></div>' +
                '</label>' +
                '</div>'
            }).inject(this.$Input, 'before');

            this.$UploadForm = new KeyFileUploadForm().inject(
                this.$Content.getElement('.gpm-auth-keyfile-upload')
            );
        },

        /**
         * Focus the element for authentication data input
         */
        focus: function () {
            this.$UploadForm.getElm().focus();
        },

        /**
         * Enable the element for authentication data input
         */
        enable: function () {
            this.$Input.disabled = false;
        },

        /**
         * Disable the element for authentication data input
         */
        disable: function () {
            this.$Input.disabled = true;
        },

        /**
         * Show the element for authentication data input
         */
        show: function () {
            this.$Content.setStyle('display', '');
        },

        /**
         * Hide the element for authentication data input
         */
        hide: function () {
            this.$Content.setStyle('display', 'none');
        },

        /**
         * Return authentication information
         *
         * @return {string}
         */
        getAuthData: function () {
            return this.$UploadForm.getKeyFileContent();
        }
    });
});
