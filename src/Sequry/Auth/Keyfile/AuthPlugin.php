<?php

/**
 * This file contains \Sequry\Auth\Keyfile\AuthPlugin
 */

namespace Sequry\Auth\Keyfile;

use Sequry\Core\Actors\CryptoUser;
use Sequry\Core\Security\Hash;
use Sequry\Core\Security\KDF;
use Sequry\Core\Security\Keys\Key;
use Sequry\Core\Security\MAC;
use Sequry\Core\Security\Random;
use Sequry\Core\Security\Utils;
use QUI;
use Sequry\Core\Security\Interfaces\IAuthPlugin;
use Sequry\Core\Security\Handler\Authentication;
use Sequry\Core\Security\HiddenString;

/**
 * Class Events
 *
 * @author www.pcsg.de (Patrick Müller)
 */
class AuthPlugin implements IAuthPlugin
{
    const NAME = 'Schlüssel-Datei';
    const TBL  = 'pcsg_gpm_auth_keyfile';

    /**
     * The authentication information for different users
     *
     * @var array
     */
    protected static $authInformation = array();

    /**
     * Return locale data for auth plugin name
     *
     * @return array
     */
    public static function getNameLocaleData()
    {
        return array(
            'sequry/auth-keyfile',
            'plugin.name'
        );
    }

    /**
     * Return locale data for auth plugin description
     *
     * @return array
     */
    public static function getDescriptionLocaleData()
    {
        return array(
            'sequry/auth-keyfile',
            'plugin.description'
        );
    }

    /**
     * Authenticate a user with this plugin
     *
     * @param HiddenString $information
     * @param \QUI\Users\User $User (optional) - if omitted, use current session user
     * @return true - if authenticated
     * @throws QUI\Exception
     */
    public static function authenticate(HiddenString $information, $User = null)
    {
        if (is_null($User)) {
            $User = QUI::getUserBySession();
        }

        if (!self::isRegistered($User)) {
            // @todo eigenen 401 error code
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.user.not.registered'
            ));
        }

        if (self::isAuthenticated($User)) {
            return true;
        }

        if (empty($information->getString())) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.authenticate.information_empty'
            ));
        }

        // get salt
        $result = QUI::getDataBase()->fetch(array(
//            'select' => array(
//                'keyfile_salt'
//            ),
            'from'  => self::TBL,
            'where' => array(
                'userId' => $User->getId()
            )
        ));

        $data = current($result);

        $macData = array(
            $data['userId'],
            $data['keyfile_hash'],
            $data['keyfile_salt'],
            $data['key_salt']
        );

        $macExpected = $data['MAC'];
        $macActual   = MAC::create(
            new HiddenString(implode('', $macData)),
            Utils::getSystemPasswordAuthKey()
        );

        if (!MAC::compare($macExpected, $macActual)) {
            QUI\System\Log::addCritical(
                self::class . ' authenticate() -> Auth data for user #' . $data['userId'] . ' possibly altered.'
                . ' MAC mismatch!'
            );

            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.user.authentication.data.not.authentic'
            ));
        }

        $salt = $data['keyfile_salt'];

        $hashActual   = Hash::create($information, $salt);
        $hashExpected = self::getKeyFileHash($User->getId());

        if (!MAC::compare($hashExpected, $hashActual)) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.user.authentication.data.wrong'
            ));
        }

        self::$authInformation[$User->getId()] = $information;

        return true;
    }

    /**
     * Checks if a user is successfully authenticated for this runtime
     *
     * @param \QUI\Users\User $User (optional) - if omitted, use current session user
     * @return bool
     */
    public static function isAuthenticated($User = null)
    {
        if (is_null($User)) {
            $User = QUI::getUserBySession();
        }

        return isset(self::$authInformation[$User->getId()]);
    }

    /**
     * Get the derived key from the authentication information of a specific user
     *
     * @param \QUI\Users\User $User (optional) - if omitted, use current session user
     * @return Key
     * @throws QUI\Exception
     */
    public static function getDerivedKey($User = null)
    {
        if (is_null($User)) {
            $User = QUI::getUserBySession();
        }

        if (!self::isAuthenticated($User)) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.derive.key.user.not.authenticated'
            ));
        }

        return KDF::createKey(self::$authInformation[$User->getId()], self::getKeySalt($User));
    }

    /**
     * Returns URL QUI\Control that collects authentification information
     *
     * @return string - \QUI\Control URL
     */
    public static function getAuthenticationControl()
    {
        return 'package/sequry/auth-keyfile/bin/controls/Authentication';
    }

    /**
     * Change authentication information
     *
     * @param HiddenString $old - current authentication information
     * @param HiddenString $new - new authentication information
     * @param \QUI\Users\User $User (optional) - if omitted, use current session user
     *
     * @return void
     * @throws QUI\Exception
     */
    public static function changeAuthenticationInformation(HiddenString $old, HiddenString $new, $User = null)
    {
        if (is_null($User)) {
            $User = QUI::getUserBySession();
        }

        if (!self::isRegistered($User)) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.change.auth.user.not.registered'
            ));
        }

        // check old authentication information
        try {
            self::authenticate($old, $User);
        } catch (\Exception $Exception) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.change.auth.old.information.wrong'
            ));
        }

        // check new authentication information
        if (empty($new->getString())) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.change.auth.new.information.empty'
            ));
        }

        // Check if user generated and used the key file provided by Sequry
        $sessionKeyHash = QUI::getSession()->get('sequry.auth_keyfile.keyfile_hash');

        if (empty($sessionKeyHash)) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.register.no_keyfile_generated'
            ));
        }

        $checkHash = hash('sha256', $new->getString());

        if (!hash_equals($checkHash, $sessionKeyHash)) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.register.hash_mismatch'
            ));
        }

        QUI::getSession()->set('sequry.auth_keyfile.keyfile_hash', null);

        // set new user password
        $keyFileSalt = Random::getRandomData();
        $keyFileHash = Hash::create($new, $keyFileSalt);

        $keySalt = Random::getRandomData();

        $macData = array(
            $User->getId(),
            $keyFileHash,
            $keyFileSalt,
            $keySalt
        );

        $macValue = MAC::create(
            new HiddenString(implode('', $macData)),
            Utils::getSystemPasswordAuthKey()
        );

        QUI::getDataBase()->update(
            self::TBL,
            array(
                'keyfile_hash' => $keyFileHash,
                'keyfile_salt' => $keyFileSalt,
                'key_salt'     => $keySalt,
                'MAC'          => $macValue
            ),
            array(
                'userId' => $User->getId()
            )
        );

        self::$authInformation[$User->getId()] = $new;
    }

    /**
     * Get the salt used for key derivation
     *
     * @param \QUI\Users\User $User (optional) - if omitted, use current session user
     * @return string
     */
    protected static function getKeySalt($User = null)
    {
        if (is_null($User)) {
            $User = QUI::getUserBySession();
        }

        $result = QUI::getDataBase()->fetch(array(
            'select' => array('key_salt'),
            'from'   => self::TBL,
            'where'  => array(
                'userId' => $User->getId()
            )
        ));

        // @todo ggf. abfragen ob existent
        $salt = $result[0]['key_salt'];

        return $salt;
    }

    /**
     * Registers a user with this plugin
     *
     * @param HiddenString $information - authentication information given by the user
     * @param \QUI\Users\User $User (optional) - if omitted, use current session user
     * @return string - authentication information
     *
     * @throws QUI\Exception
     */
    public static function register(HiddenString $information, $User = null)
    {
        if (is_null($User)) {
            $User = QUI::getUserBySession();
        }

        if (self::isRegistered($User)) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.user.already.registered'
            ));
        }

        if (empty($information->getString())) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.register.invalid.registration.information'
            ));
        }

        // Check if user generated and used the key file provided by Sequry
        $sessionKeyHash = QUI::getSession()->get('sequry.auth_keyfile.keyfile_hash');

        if (empty($sessionKeyHash)) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.register.no_keyfile_generated'
            ));
        }

        $checkHash = hash('sha256', $information->getString());

        if (!hash_equals($checkHash, $sessionKeyHash)) {
            throw new QUI\Exception(array(
                'sequry/auth-keyfile',
                'exception.register.hash_mismatch'
            ));
        }

        QUI::getSession()->set('sequry.auth_keyfile.keyfile_hash', null);

        $keyFileSalt = Random::getRandomData();
        $keyFileHash = Hash::create($information, $keyFileSalt);
        $keySalt     = Random::getRandomData();

        $macData = array(
            $User->getId(),
            $keyFileHash,
            $keyFileSalt,
            $keySalt
        );

        $macValue = MAC::create(
            new HiddenString(implode('', $macData)),
            Utils::getSystemPasswordAuthKey()
        );

        QUI::getDataBase()->insert(
            self::TBL,
            array(
                'userId'       => $User->getId(),
                'keyfile_hash' => $keyFileHash,
                'keyfile_salt' => $keyFileSalt,
                'key_salt'     => $keySalt,
                'MAC'          => $macValue
            )
        );

        return $information;
    }

    /**
     * Checks if a user is successfully registered with this auth plugin
     *
     * @param QUI\Users\User $User (optional) - if ommitted, use current session user
     * @return bool
     */
    public static function isRegistered($User = null)
    {
        if (is_null($User)) {
            $User = QUI::getUserBySession();
        }

        $result = QUI::getDataBase()->fetch(array(
            'count' => 1,
            'from'  => self::TBL,
            'where' => array(
                'userId' => $User->getId()
            )
        ));

        if (current(current($result)) == 0) {
            return false;
        }

        return true;
    }

    /**
     * Get list of User IDs of users that are registered with this plugin
     *
     * @return array
     */
    public static function getRegisteredUserIds()
    {
        $userIds = array();

        $result = QUI::getDataBase()->fetch(array(
            'select' => array(
                'userId'
            ),
            'from'   => self::TBL
        ));

        foreach ($result as $row) {
            $userIds[] = $row['userId'];
        }

        return $userIds;
    }

    /**
     * Returns URL of QUI\Control that collects registration information
     *
     * @return string - \QUI\Control URL
     */
    public static function getRegistrationControl()
    {
        return 'package/sequry/auth-keyfile/bin/controls/Registration';
    }

    /**
     * Registers the auth plugin with the main password manager module
     *
     * @return void
     */
    public static function registerPlugin()
    {
        Authentication::registerPlugin(new self());
    }

    /**
     * Returns URL of QUI\Control that allows changing of authentication information
     *
     * @return string - \QUI\Control URL
     */
    public static function getChangeAuthenticationControl()
    {
        return 'package/sequry/auth-keyfile/bin/controls/ChangeAuth';
    }

    /**
     * Get password hash of user
     *
     * @param integer $userId
     * @return string|false - password hash or false if not found
     */
    protected static function getKeyFileHash($userId)
    {
        $result = QUI::getDataBase()->fetch(array(
            'select' => array(
                'keyfile_hash'
            ),
            'from'   => self::TBL,
            'where'  => array(
                'userId' => $userId
            )
        ));

        if (empty($result)) {
            return false;
        }

        return $result[0]['keyfile_hash'];
    }

    /**
     * Delete a user from this plugin
     *
     * @param CryptoUser $CryptoUser
     * @return mixed
     */
    public static function deleteUser($CryptoUser)
    {
        QUI::getDataBase()->delete(
            self::TBL,
            array(
                'userId' => $CryptoUser->getId()
            )
        );
    }
}
