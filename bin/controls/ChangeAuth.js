/**
 * ChangeAuth for authentication plugin
 *
 * @module package/pcsg/gpmauthkeyfile/bin/controls/ChangeAuth
 * @author www.pcsg.de (Patrick Müller)
 *
 * @require qui/controls/Control
 * @require Locale
 * @require css!package/pcsg/gpmauthkeyfile/bin/controls/ChangeAuth.css
 *
 * @event onSubmit
 */
define('package/pcsg/gpmauthkeyfile/bin/controls/ChangeAuth', [

    'qui/QUI',
    'qui/controls/Control',
    'package/pcsg/gpmauthkeyfile/bin/controls/CreateKeyFileBtn',
    'package/pcsg/gpmauthkeyfile/bin/controls/KeyFileUploadForm',
    'Locale',

    'css!package/pcsg/gpmauthkeyfile/bin/controls/ChangeAuth.css'

], function (QUI, QUIControl, CreateKeyFileBtn, KeyFileUploadForm, QUILocale) {
    "use strict";

    var lg = 'pcsg/gpmauthkeyfile';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/pcsg/gpmauthkeyfile/bin/controls/ChangeAuth',

        Binds: [
            'getOldAuthData',
            'getNewAuthData'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$UploadFormOld = null;
            this.$UploadFormNew = null;
            this.$KeyFileBtn    = null;
        },

        /**
         * create the domnode element
         *
         * @return {HTMLDivElement}
         */
        create: function () {
            this.$Elm = this.parent();

            this.$Elm.setProperty('class', 'gpm-auth-keyfile-changeauth');

            this.$Elm.set(
                'html',
                '<div class="gpm-auth-keyfile-changeauth-upload-old">' +
                '<label>' +
                '<span class="gpm-auth-keyfile-changeauth-title">' +
                QUILocale.get(lg, 'changeauth.upload.old.label') +
                '</span>' +
                '<div class="gpm-auth-keyfile-upload"/></div>' +
                '</label>' +
                '</div>' +
                '<div class="gpm-auth-keyfile-changeauth-generate">' +
                '<label>' +
                '<span class="gpm-auth-keyfile-changeauth-title">' +
                QUILocale.get(lg, 'changeauth.generate.label') +
                '</span>' +
                '<div class="gpm-auth-keyfile-changeauth-btn"/></div>' +
                '</label>' +
                '</div>' +
                '<div class="gpm-auth-keyfile-changeauth-upload-new">' +
                '<label>' +
                '<span class="gpm-auth-keyfile-changeauth-title">' +
                QUILocale.get(lg, 'changeauth.upload.new.label') +
                '</span>' +
                '<div class="gpm-auth-keyfile-upload"/></div>' +
                '</label>' +
                '</div>'
            );

            this.$KeyFileBtn = new CreateKeyFileBtn().inject(
                this.$Elm.getElement('.gpm-auth-keyfile-changeauth-btn')
            );

            this.$UploadFormOld = new KeyFileUploadForm().inject(
                this.$Elm.getElement('.gpm-auth-keyfile-changeauth-upload-old')
            );

            this.$UploadFormNew = new KeyFileUploadForm().inject(
                this.$Elm.getElement('.gpm-auth-keyfile-changeauth-upload-new')
            );

            return this.$Elm;
        },

        /**
         * Checks if all necessary form fields are filled
         *
         * @return {boolean}
         */
        check: function () {
            if (!this.$UploadFormOld.getKeyFileContent()) {
                QUI.getMessageHandler(function (MH) {
                    MH.addAttention(
                        QUILocale.get(lg, 'changeauth.upload.old.keyfile')
                    );
                });

                return false;
            }

            if (!this.$KeyFileBtn.isKeyGenerated()) {
                QUI.getMessageHandler(function (MH) {
                    MH.addAttention(
                        QUILocale.get(lg, 'changeauth.generate.keyfile')
                    );
                });

                return false;
            }

            if (!this.$UploadFormNew.getKeyFileContent()) {
                QUI.getMessageHandler(function (MH) {
                    MH.addAttention(
                        QUILocale.get(lg, 'changeauth.upload.new.keyfile')
                    );
                });

                return false;
            }

            return true;
        },

        /**
         * Return old authentication information
         *
         * @return {string}
         */
        getOldAuthData: function () {
            return this.$UploadFormOld.getKeyFileContent();
        },

        /**
         * Return new authentication information
         *
         * @return {string}
         */
        getNewAuthData: function () {
            return this.$UploadFormNew.getKeyFileContent();
        }
    });
});
