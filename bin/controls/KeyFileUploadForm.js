/**
 * Upload form for authentication key files
 *
 * @module package/sequry/auth-keyfile/bin/controls/KeyFileUploadForm
 * @author www.pcsg.de (Patrick Müller)
 *
 * @event onSubmit
 */
define('package/sequry/auth-keyfile/bin/controls/KeyFileUploadForm', [

    'qui/controls/Control',

    'Ajax',
    'Locale',

    'css!package/sequry/auth-keyfile/bin/controls/KeyFileUploadForm.css'

], function (QUIControl, QUIAjax, QUILocale) {
    "use strict";

    var lg = 'sequry/auth-keyfile';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/sequry/auth-keyfile/bin/controls/KeyFileUploadForm',

        Binds: [
            'getKeyFileContent'
        ],

        initialize: function (options) {
            this.parent(options);
            this.$fileContent = null;
        },

        /**
         * create the domnode element
         *
         * @return {HTMLDivElement}
         */
        create: function () {
            var self = this;

            this.$Elm = this.parent();

            this.$Elm.set({
                'class': 'pcsg-gpm-auth-keyfile-uploadform',
                html   : '<label>' +
                '<input type="file" class="gpm-auth-keyfile-upload-input">' +
                '</label>'
            });

            var InputElm = this.$Elm.getElement('.gpm-auth-keyfile-upload-input');

            if (typeof FileReader === 'undefined') {
                InputElm.disabled = true;
                InputElm.setStyle('display', 'none');

                new Element('div', {
                    'class': 'pcsg-gpm-password-error',
                    html   : QUILocale.get(lg, 'keyfileuploadform.not.available')
                }).inject(
                    InputElm, 'before'
                );

                return this.$Elm;
            }

            InputElm.addEvents({
                change: function (event) {
                    var File = event.target.files[0];
                    var Reader = new FileReader();

                    Reader.addEventListener(
                        'loadend',
                        function(event) {
                            self.$fileContent = event.target.result;
                        }
                    );

                    Reader.readAsText(File);
                }
            });

            return this.$Elm;
        },

        /**
         * Return content of uploaded key file
         *
         * @returns {String}
         */
        getKeyFileContent: function()
        {
            return this.$fileContent;
        }
    });
});
