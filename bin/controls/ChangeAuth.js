/**
 * ChangeAuth for authentication plugin
 *
 * @module package/sequry/auth-keyfile/bin/controls/ChangeAuth
 * @author www.pcsg.de (Patrick Müller)
 *
 * @event onSubmit
 */
define('package/sequry/auth-keyfile/bin/controls/ChangeAuth', [

    'qui/QUI',
    'package/sequry/core/bin/controls/authPlugins/ChangeAuth',
    'package/sequry/auth-keyfile/bin/controls/CreateKeyFileBtn',
    'package/sequry/auth-keyfile/bin/controls/KeyFileUploadForm',
    'Locale',

    'css!package/sequry/auth-keyfile/bin/controls/ChangeAuth.css'

], function (QUI, ChangeAuthBaseClass, CreateKeyFileBtn, KeyFileUploadForm, QUILocale) {
    "use strict";

    var lg = 'sequry/auth-keyfile';

    return new Class({

        Extends: ChangeAuthBaseClass,
        Type   : 'package/sequry/auth-keyfile/bin/controls/ChangeAuth',

        Binds: [
            'getOldAuthData',
            'getNewAuthData'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$UploadForm = null;
            this.$KeyFileBtn = null;

            this.addEvents({
                onInject: this.$onInject
            });
        },

        /**
         * Event: onInject
         *
         * @return {HTMLDivElement}
         */
        $onInject: function () {
            this.$Elm.setProperty('class', 'gpm-auth-keyfile-changeauth');

            this.$Elm.set(
                'html',
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

            this.$UploadForm = new KeyFileUploadForm().inject(
                this.$Elm.getElement('.gpm-auth-keyfile-changeauth-upload-new')
            );

            return this.$Elm;
        },

        /**
         * Enable the element for authentication data input
         */
        enable: function () {
            this.$KeyFileBtn.enable();
        },

        /**
         * Disable the element for authentication data input
         */
        disable: function () {
            this.$KeyFileBtn.disable();
        },

        /**
         * Return new authentication information
         *
         * @return {string}
         */
        getAuthData: function () {
            return this.$UploadForm.getKeyFileContent();
        }
    });
});
