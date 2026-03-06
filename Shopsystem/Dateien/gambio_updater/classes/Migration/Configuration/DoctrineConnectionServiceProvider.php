<?php
/* --------------------------------------------------------------
 DoctrineConnectionServiceProvider.php 2022-12-05
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DriverManager;
use League\Container\ServiceProvider\AbstractServiceProvider;

class DoctrineConnectionServiceProvider extends AbstractServiceProvider
{
    protected $provides = [
        Connection::class
    ];
    
    
    public function register(): void
    {
        $server   = explode(':', DB_SERVER);
        $host     = $server[0];
        $port     = isset($server[1]) && is_numeric($server[1]) ? 'port=' . $server[1] . ';' : '';
        $socket   = isset($server[1]) && !is_numeric($server[1]) ? 'unix_socket=' . $server[1] . ';' : '';
        $user     = DB_SERVER_USERNAME;
        $name     = DB_DATABASE;
        $password = DB_SERVER_PASSWORD;
        
        $pdo = new PDO("mysql:host=$host;{$port}{$socket}dbname=$name;charset=UTF8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, true);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);

        $connection = DriverManager::getConnection(['pdo' => $pdo]);
        $connection->executeQuery('SET SESSION sql_mode=""');
        
        $this->leagueContainer->share(Connection::class, $connection);
    }
}