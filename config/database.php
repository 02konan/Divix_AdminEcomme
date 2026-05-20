<?php

// $host = "localhost";        // ex: mysql.xxxx.com
// $dbname = "divix_ecommerce";
// $username = "root";
// $password = "";
$host = "mysql-divix.alwaysdata.net";        // ex: mysql.xxxx.com
$dbname = "divix_ecommerce";
$username = "divix_ecommerce";
$password = "divix_Ecommerce#2025";

try {
    $bd = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // gestion erreurs
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

?>