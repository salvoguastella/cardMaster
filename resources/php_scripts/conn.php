
<?php

class Config
{
    static $confArray;

    public static function read($name)
    {
        return self::$confArray[$name];
    }

    public static function write($name, $value)
    {
        self::$confArray[$name] = $value;
    }

}

// db
Config::write('db.host', 'localhost');
Config::write('db.port', '80');
Config::write('db.basename', 'card_battle');
Config::write('db.user', 'root');
Config::write('db.password', '');


class Core
{
    public $dbh; // handle of the db connexion
    private static $instance;

    private function __construct()
    {
        $dsn = 'mysql:host=' . Config::read('db.host') .
               ';dbname='    . Config::read('db.basename');
        $user = Config::read('db.user');
		$password = Config::read('db.password');

        $this->dbh = new PDO($dsn, $user, $password);
    }

    public static function getInstance()
    {
        if (!isset(self::$instance))
        {
            $object = __CLASS__;
            self::$instance = new $object;
        }
        return self::$instance;
    }

}

?>