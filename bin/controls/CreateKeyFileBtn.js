/**
 * Creates a random key file for authentication purposes
 *
 * @module package/sequry/auth-keyfile/bin/controls/CreateKeyFileBtn
 * @author www.pcsg.de (Patrick Müller)
 *
 * @event onSubmit
 */
define('package/sequry/auth-keyfile/bin/controls/CreateKeyFileBtn', [

    'qui/controls/buttons/Button',

    'Ajax',
    'Locale'

], function (QUIButton, QUIAjax, QUILocale) {
    "use strict";

    var lg = 'sequry/auth-keyfile';

    return new Class({

        Extends: QUIButton,
        Type   : 'package/sequry/auth-keyfile/bin/controls/CreateKeyFileBtn',

        Binds: [
            '$onInject',
            'getAuthData',
            '$onClick',
            'isKeyGenerated'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onInject: this.$onInject,
                onClick: this.$onClick
            });

            this.$keyGenerated = false;
        },

        /**
         * event: on generate key btn click
         */
        $onClick: function () {
            var self = this;

            QUIAjax.get('package_sequry_auth-keyfile_ajax_generateKeyFile', function(downloadUrl) {
                new Element('iframe', {
                    src   : downloadUrl,
                    id    : 'pcsg-gpm-auth-keyfile-download-' + String.uniqueID(),
                    styles: {
                        position: 'absolute',
                        top     : -200,
                        left    : -200,
                        width   : 50,
                        height  : 50
                    }
                }).inject(document.body);

                self.disable();
                self.$keyGenerated = true;
            }, {
                'package': 'sequry/auth-keyfile'
            });
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
        },

        /**
         * Checks if a key has already been generated
         *
         * @return {boolean}
         */
        isKeyGenerated: function()
        {
            return this.$keyGenerated;
        }
    });
});
