/**
 * Registration for authentication plugin
 *
 * @module package/pcsg/gpmauthkeyfile/bin/controls/Registration
 * @author www.pcsg.de (Patrick Müller)
 *
 * @require qui/controls/Control
 * @require Locale
 * @require css!package/pcsg/gpmauthkeyfile/bin/controls/Registration.css
 *
 * @event onSubmit
 */
define('package/pcsg/gpmauthkeyfile/bin/controls/Registration', [

    'qui/controls/Control',
    'package/pcsg/gpmauthkeyfile/bin/controls/CreateKeyFileBtn',
    'Locale'

    //'css!package/pcsg/gpmauthkeyfile/bin/controls/Registration.css'

], function (QUIControl, CreateKeyFileBtn, QUILocale) {
    "use strict";

    var lg = 'pcsg/gpmauthkeyfile';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/pcsg/gpmauthkeyfile/bin/controls/Registration',

        Binds: [
            'getAuthData'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$Categories = null;

            //this.addEvents({
            //    onInject: this.$onInject
            //});
        },

        /**
         * create the domnode element
         *
         * @return {HTMLDivElement}
         */
        create: function () {
            this.$Elm = this.parent();

            this.$Elm.set(
                'html',
                '<label>' +
                '<span class="gpm-auth-keyfile-title">' +
                QUILocale.get(lg, 'registration.label') +
                '</span>' +
                '<div class="gpm-auth-keyfile-btn"/></div>' +
                '</label>'
            );

            new CreateKeyFileBtn().inject(
                this.$Elm.getElement('.gpm-auth-keyfile-btn')
            );

            return this.$Elm;
        },

        /**
         * Return authentication information
         *
         * @return {string}
         */
        getRegistrationData: function () {
            return this.$Elm.getElement('.gpm-auth-keyfile-input').value;
        }
    });
});
