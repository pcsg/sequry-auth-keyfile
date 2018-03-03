/**
 * Registration for authentication plugin
 *
 * @module package/sequry/auth-keyfile/bin/controls/Registration
 * @author www.pcsg.de (Patrick Müller)
 *
 * @event onSubmit
 */
define('package/sequry/auth-keyfile/bin/controls/Registration', [

    'qui/controls/Control',
    'package/sequry/auth-keyfile/bin/controls/CreateKeyFileBtn',
    'package/sequry/auth-keyfile/bin/controls/KeyFileUploadForm',
    'Locale',

    'css!package/sequry/auth-keyfile/bin/controls/Registration.css'

], function (QUIControl, CreateKeyFileBtn, KeyFileUploadForm, QUILocale) {
    "use strict";

    var lg = 'sequry/auth-keyfile';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/auth-keyfile/bin/controls/Registration',

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

            this.$Elm.setProperty('class', 'gpm-auth-keyfile-registration');

            this.$Elm.set(
                'html',
                '<div class="gpm-auth-keyfile-registration-generate">' +
                '<label>' +
                '<span class="gpm-auth-keyfile-registration-title">' +
                QUILocale.get(lg, 'registration.generate.label') +
                '</span>' +
                '<div class="gpm-auth-keyfile-btn"/></div>' +
                '</label>' +
                '</div>' +
                '<div class="gpm-auth-keyfile-registration-upload">' +
                '<label>' +
                '<span class="gpm-auth-keyfile-registration-title">' +
                QUILocale.get(lg, 'registration.upload.label') +
                '</span>' +
                '<div class="gpm-auth-keyfile-upload"/></div>' +
                '</label>' +
                '</div>'
            );

            new CreateKeyFileBtn().inject(
                this.$Elm.getElement('.gpm-auth-keyfile-btn')
            );

            this.$UploadForm = new KeyFileUploadForm().inject(
                this.$Elm.getElement('.gpm-auth-keyfile-upload')
            );

            return this.$Elm;
        },

        /**
         * Return authentication information
         *
         * @return {string}
         */
        getRegistrationData: function () {
            return this.$UploadForm.getKeyFileContent();
        }
    });
});
