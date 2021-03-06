<?php

use Sequry\Core\Security\Hash;
use Sequry\Core\Security\HiddenString;
use QUI\Utils\System\File;

define('QUIQQER_SYSTEM', true);

require dirname(dirname(dirname(dirname(__FILE__)))).'/header.php';

if (!isset($_REQUEST['salt'])
    || empty($_REQUEST['salt'])
) {
    exit;
}

$userId   = QUI::getUserBySession()->getId();
$hash     = Hash::create(new HiddenString($userId), base64_decode($_REQUEST['salt']));
$fileName = mb_substr(bin2hex($hash), 0, 32);

$varDir  = QUI::getPackage('sequry/auth-keyfile')->getVarDir();
$keyFile = $varDir.$fileName.'.keyfile';

if (file_exists($keyFile)) {
    File::send($keyFile, 0, 'pwm.keyfile');

    QUI::getSession()->set(
        'sequry.auth_keyfile.keyfile_hash',
        hash('sha256', file_get_contents($keyFile))
    );

    unlink($keyFile);
}

exit;
