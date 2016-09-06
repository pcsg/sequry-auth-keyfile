/**
 * Creates a random key file for authentication purposes
 *
 * @module package/pcsg/gpmauthkeyfile/bin/controls/CreateKeyFileBtn
 * @author www.pcsg.de (Patrick Müller)
 *
 * @require qui/controls/Control
 * @require Locale
 * @require css!package/pcsg/gpmauthkeyfile/bin/controls/CreateKeyFileBtn.css
 *
 * @event onSubmit
 */
define('package/pcsg/gpmauthkeyfile/bin/controls/CreateKeyFileBtn', [

    'qui/controls/buttons/Button',
    'Locale'

    //'css!package/pcsg/gpmauthkeyfile/bin/controls/CreateKeyFileBtn.css'

], function (QUIButton, QUILocale) {
    "use strict";

    var lg = 'pcsg/gpmauthkeyfile';

    return new Class({

        Extends: QUIButton,
        Type   : 'package/pcsg/gpmauthkeyfile/bin/controls/CreateKeyFileBtn',

        Binds: [
            '$onInject',
            'getAuthData',
            '$onClick'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$Categories = null;

            this.addEvents({
                onInject: this.$onInject,
                onClick: this.$onClick
            });
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

            new QUIButton({
                textimage: 'fa fa-key',
                text     : QUILocale.get(lg, 'registration.btn.text'),
                alt      : QUILocale.get(lg, 'registration.btn.text'),
                title    : QUILocale.get(lg, 'registration.btn.text'),
                events: {
                    onClick: this.$onCreateKeyBtnClick
                }
            }).inject(
                this.$Elm.getElement('.gpm-auth-keyfile-btn')
            );

            return this.$Elm;
        },

        $onClick: function () {
            console.log("click btn");
        },

        /**
         * event : on inject
         */
        $onInject: function () {
            this.setAttributes({
                textimage: 'fa fa-key',
                text     : QUILocale.get(lg, 'registration.btn.text'),
                alt      : QUILocale.get(lg, 'registration.btn.text'),
                title    : QUILocale.get(lg, 'registration.btn.text')
            });
        }
    });
});
