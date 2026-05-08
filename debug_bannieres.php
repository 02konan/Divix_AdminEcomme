<?php
// Script de débogage pour l'API bannieres
ini_set('display_errors', 1);
error_reporting(E_ALL);

require('config/database.php');

echo "=== Test de connexion à la base de données ===\n";

try {
    $stmt = $bd->query('SELECT 1');
    echo "Connexion DB: OK\n";
} catch (Exception $e) {
    echo "Erreur DB: " . $e->getMessage() . "\n";
    exit;
}

echo "\n=== Vérification de la table bannieres ===\n";

try {
    $stmt = $bd->query('SHOW TABLES LIKE "bannieres"');
    $exists = $stmt->fetchColumn();

    if ($exists) {
        echo "Table bannieres: EXISTE\n";

        $stmt = $bd->query('SELECT COUNT(*) as count FROM bannieres');
        $count = $stmt->fetchColumn();
        echo "Nombre d'enregistrements: $count\n";

        if ($count > 0) {
            echo "Derniers enregistrements:\n";
            $stmt = $bd->query('SELECT id, titre, type, active FROM bannieres ORDER BY date_creation DESC LIMIT 3');
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                echo "- ID: {$row['id']}, Titre: {$row['titre']}, Type: {$row['type']}, Active: {$row['active']}\n";
            }
        }
    } else {
        echo "Table bannieres: N'EXISTE PAS\n";
        echo "Création de la table...\n";

        $sql = 'CREATE TABLE bannieres (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titre VARCHAR(255) NOT NULL,
            description TEXT,
            image VARCHAR(255),
            lien VARCHAR(500),
            type ENUM("banner", "event", "promo", "marquee") NOT NULL,
            active TINYINT(1) DEFAULT 1,
            date_debut DATETIME NULL,
            date_fin DATETIME NULL,
            date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )';

        $bd->exec($sql);
        echo "Table créée avec succès\n";
    }
} catch (Exception $e) {
    echo "Erreur table: " . $e->getMessage() . "\n";
}

echo "\n=== Test de l'API getBannieres ===\n";

// Simuler une requête POST
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST['action'] = 'getBannieres';

try {
    ob_start();
    require('bannieres.php');
    $output = ob_get_clean();

    echo "Sortie brute:\n";
    echo $output . "\n";

    $json = json_decode($output, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        echo "JSON valide: " . json_encode($json, JSON_PRETTY_PRINT) . "\n";
    } else {
        echo "Erreur JSON: " . json_last_error_msg() . "\n";
    }
} catch (Exception $e) {
    echo "Erreur API: " . $e->getMessage() . "\n";
}

echo "\n=== Fin du test ===\n";
?>