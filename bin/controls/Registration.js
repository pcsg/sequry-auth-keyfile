/**
 * Registration for authentication plugin
 *
 * @module package/sequry/auth-keyfile/bin/controls/Registration
 * @author www.pcsg.de (Patrick Müller)
 *
 * @event onSubmit
 */
define('package/sequry/auth-keyfile/bin/controls/Registration', [

    'package/sequry/core/bin/controls/authPlugins/Registration',

    'package/sequry/auth-keyfile/bin/controls/CreateKeyFileBtn',
    'package/sequry/auth-keyfile/bin/controls/KeyFileUploadForm',

    'Mustache',
    'Locale',

    'text!package/sequry/auth-keyfile/bin/controls/Registration.html',
    'css!package/sequry/auth-keyfile/bin/controls/Registration.css'

], function (RegistrationBaseClass, CreateKeyFileBtn, KeyFileUploadForm, Mustache, QUILocale, template) {
    "use strict";

    var lg = 'sequry/auth-keyfile';

    return new Class({

        Extends: RegistrationBaseClass,
        Type   : 'package/sequry/auth-keyfile/bin/controls/Registration',

        Binds: [
            'getAuthData'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$UploadForm = null;

            this.addEvents({
                onInject: this.$onInject
            });
        },

        /**
         * event : on inject
         */
        $onInject: function () {
            var lgPrefix = 'controls.Registration.template.';

            var Content = new Element('div', {
                'class': 'sequry-auth-keyfile-registration',
                html   : Mustache.render(template, {
                    labelGenerate: QUILocale.get(lg, lgPrefix + 'labelGenerate'),
                    labelUpload  : QUILocale.get(lg, lgPrefix + 'labelUpload')
                })
            }).inject(this.$Elm);

            new CreateKeyFileBtn().inject(
                Content.getElement('.sequry-auth-keyfile-registration-generate')
            );

            this.$UploadForm = new KeyFileUploadForm().inject(
                Content.getElement('.sequry-auth-keyfile-registration-upload')
            );
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
