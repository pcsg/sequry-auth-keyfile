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

    'qui/controls/Control',
    'package/pcsg/gpmauthkeyfile/bin/controls/KeyFileUploadForm',
    'Locale',

    'css!package/pcsg/gpmauthkeyfile/bin/controls/Authentication.css'

], function (QUIControl, KeyFileUploadForm, QUILocale) {
    "use strict";

    var lg = 'pcsg/gpmauthkeyfile';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/pcsg/gpmauthkeyfile/bin/controls/Authentication',

        Binds: [
            'getAuthData'
        ],

        initialize: function (options) {
            this.parent(options);
            this.$UploadForm = null;
        },

        /**
         * create the domnode element
         *
         * @return {HTMLDivElement}
         */
        create: function () {
            this.$Elm = this.parent();

            this.$Elm.setProperty('class', 'gpm-auth-keyfile-authentication');

            this.$Elm.set(
                'html',
                '<div class="gpm-auth-keyfile-authentication-upload">' +
                '<label>' +
                '<span class="gpm-auth-keyfile-authentication-title">' +
                QUILocale.get(lg, 'authentication.upload.label') +
                '</span>' +
                '<div class="gpm-auth-keyfile-upload"/></div>' +
                '</label>' +
                '</div>'
            );

            this.$UploadForm = new KeyFileUploadForm().inject(
                this.$Elm.getElement('.gpm-auth-keyfile-upload')
            );

            return this.$Elm;
        },

        focus: function () {
            this.$UploadForm.getElm().focus();
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
