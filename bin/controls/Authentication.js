/**
 * Authentication for keyfile auth plugin
 *
 * @module package/pcsg/gpmauthkeyfile/bin/controls/Authentication
 * @author www.pcsg.de (Patrick Müller)
 *
 * @require qui/controls/Control
 * @require Locale
 * @require css!package/pcsg/gpmauthkeyfile/bin/controls/Authentication.css
 *
 * @event onSubmit
 */
define('package/pcsg/gpmauthkeyfile/bin/controls/Authentication', [

    'package/pcsg/grouppasswordmanager/bin/controls/authPlugins/Authentication',
    'package/pcsg/gpmauthkeyfile/bin/controls/KeyFileUploadForm',
    'Locale',

    'css!package/pcsg/gpmauthkeyfile/bin/controls/Authentication.css'

], function (AuthenticationBaseClass, KeyFileUploadForm, QUILocale) {
    "use strict";

    var lg = 'pcsg/gpmauthkeyfile';

    return new Class({

        Extends: AuthenticationBaseClass,
        Type   : 'package/pcsg/gpmauthkeyfile/bin/controls/Authentication',

        Binds: [
            'getAuthData'
        ],

        initialize: function (options) {
            this.parent(options);
            this.$UploadForm = null;
        },

        /**
         * Event: onImport
         */
        $onImport: function () {
            this.parent();

            var Content = new Element('div', {
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
                Content.getElement('.gpm-auth-keyfile-upload')
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
         * Return authentication information
         *
         * @return {string}
         */
        getAuthData: function () {
            return this.$UploadForm.getKeyFileContent();
        }
    });
});
