<?php

use Sequry\Core\Security\HiddenString;
use Sequry\Core\Security\Random;
use Sequry\Core\Security\Hash;

/**
 * Generate a random key file
 *
 * @return string - download url
 * @throws QUI\Exception
 */
\QUI::$Ajax->registerFunction(
    'package_sequry_auth-keyfile_ajax_generateKeyFile',
    function () {
        $randomData   = base64_encode(Random::getRandomData(4096));
        $userId       = QUI::getUserBySession()->getId();
        $fileNameSalt = Random::getRandomData();
        $fileName     = mb_substr(bin2hex(Hash::create(
            new HiddenString($userId), $fileNameSalt)
        ), 0, 32);

        $varDir  = QUI::getPackage('sequry/auth-keyfile')->getVarDir();
        $keyFile = $varDir . $fileName . '.keyfile';

        file_put_contents($keyFile, $randomData);

        if (!file_exists($keyFile)) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.generatekeyfile.could.not.create.keyfile'
            ));
        }

        $saltParam = base64_encode($fileNameSalt);
        $saltParam = urlencode($saltParam);

        return URL_OPT_DIR . 'sequry/auth-keyfile/bin/keyfile.php?salt=' . $saltParam;
    },
    array(),
    'Permission::checkAdminUser'
);
