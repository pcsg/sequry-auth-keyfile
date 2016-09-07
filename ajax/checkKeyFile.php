<?php

use Pcsg\GroupPasswordManager\Security\SymmetricCrypto;
use Pcsg\GroupPasswordManager\Security\Random;
use Pcsg\GroupPasswordManager\Security\Hash;

/**
 * Checks key file for validity
 *
 * @return string - download url
 *
 * @throws QUI\Exception
 */
function package_pcsg_gpmauthkeyfile_ajax_checkKeyFile($File)
{
    $RandomKey    = SymmetricCrypto::generateKey();
    $userId       = QUI::getUserBySession()->getId();
    $fileNameSalt = Random::getRandomData();
    $fileName     = mb_substr(base64_encode(Hash::create($userId, $fileNameSalt)), 0, 32);

    $varDir  = QUI::getPackage('pcsg/gpmauthkeyfile')->getVarDir();
    $keyFile = $varDir . $fileName . '.keyfile';

    file_put_contents($keyFile, $RandomKey->getValue());

    if (!file_exists($keyFile)) {
        throw new QUI\Exception(array(
            'pcsg/gpmauthkeyfile',
            'exception.generatekeyfile.could.not.create.keyfile'
        ));
    }

    $saltParam = base64_encode($fileNameSalt);
    $saltParam = urlencode($saltParam);

    return URL_OPT_DIR . 'pcsg/gpmauthkeyfile/bin/keyfile.php?salt=' . $saltParam;
}

\QUI::$Ajax->register(
    'package_pcsg_gpmauthkeyfile_ajax_checkKeyFile',
    array('File'),
    'Permission::checkAdminUser'
);
