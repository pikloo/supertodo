<?php
require __DIR__.'/../vendor/autoload.php';
$host = 'db';
$user = 'pikloo';
$pass = 'Lamar291120!';
$db = 'supertodo';

try {
    $dbh = new PDO('mysql:host='. $host.';dbname='. $db.'', $user, $pass);
    echo "Connected to MySQL successfully";
} catch (PDOException $e) {
    die("Connection failed: " . $e);
}

$dbh = null;
?>