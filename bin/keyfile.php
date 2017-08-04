<?php

use Pcsg\GroupPasswordManager\Security\Hash;
use Pcsg\GroupPasswordManager\Security\HiddenString;

define('QUIQQER_SYSTEM', true);

require dirname(dirname(dirname(dirname(__FILE__)))) . '/header.php';

if (!isset($_REQUEST['salt'])
    || empty($_REQUEST['salt'])
) {
    exit;
}

$userId   = QUI::getUserBySession()->getId();
$fileName = mb_substr(base64_encode(Hash::create(
    new HiddenString($userId), base64_decode($_REQUEST['salt']))
), 0, 32);

$varDir  = QUI::getPackage('pcsg/gpmauthkeyfile')->getVarDir();
$keyFile = $varDir . $fileName . '.keyfile';

if (file_exists($keyFile)) {
    \QUI\Utils\System\File::send($keyFile, 0, 'pwm.keyfile');
    unlink($keyFile);
}

exit;
