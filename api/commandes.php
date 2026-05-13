<?php
session_start();
require('../config/database.php');

// Désactiver l'affichage des erreurs
ini_set('display_errors', 0);
error_reporting(0);

// Vérifier que la requête est en POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

try {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
    switch($action) {
        case 'getCommandes':
            getCommandes();
            break;
        case 'getNumberCommandes':
            getNumberCommandes();
            break;
        case 'getCommandeDetails':
            getCommandeDetails();
            break;
        case 'updateCommandeStatus':
            updateCommandeStatus();
            break;
        default:
            throw new Exception("Action inconnue!");
    }
    
} catch (Exception $e) {
    header('Content-Type: application/json');
    error_log($e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

function genererCodeProduit() {
    global $bd;
    
    try {
        // Récupérer le dernier code produit
        $query = "SELECT code FROM produits ORDER BY id DESC LIMIT 1";
        $stmt = $bd->prepare($query);
        $stmt->execute();
        $last = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $prefix = 'PRO-';
        $numero = 1;

        if ($last && isset($last['code']) && preg_match('/^PRO-(\d+)$/', $last['code'], $matches)) {
            $numero = intval($matches[1]) + 1;
        }

        return $prefix . str_pad($numero, 5, '0', STR_PAD_LEFT);
    } catch (Exception $e) {
        return 'PRO-00001';
    }
}

function tableExists($tableName) {
    global $bd;
    $stmt = $bd->prepare("SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?");
    $stmt->execute([$tableName]);
    return (int)$stmt->fetchColumn() > 0;
}

function getCommandes() {
    global $bd;
    
    try {
        $search = isset($_POST['searchInput']) ? trim($_POST['searchInput']) : '';
        // $page = isset($_POST['page']) ? (int)$_POST['page'] : 1;
        // $limit = 10;
        // $offset = ($page - 1) * $limit;
        
        $query = "SELECT 
            c.*,
            cl.nom AS client_nom,
            cl.telephone AS client_telephone,
            COALESCE(SUM(lc.quantite), 0) AS nombre_produits
        FROM commandes c
        LEFT JOIN Client cl 
            ON c.id_Client = cl.id
        LEFT JOIN ligne_commandes lc
            ON c.id = lc.id_commande
        GROUP BY c.id
        ORDER BY c.id DESC";
        $params = [];
        
        $stmt = $bd->prepare($query);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $queryCounter = "
        SELECT 

    COUNT(*) AS total_commandes,

    COALESCE(
        SUM(
            CASE 
                WHEN statut IN ('livree', 'expediee') 
                THEN total
            END
        ),
        0
    ) AS chiffre_affaires_total,

    COALESCE(
        SUM(
            CASE 
                WHEN statut IN ('livree', 'expediee')

                AND DATE(date_commande) = CURDATE()

                THEN total
            END
        ),
        0
    ) AS chiffre_affaires_aujourdhui

FROM commandes";

        $stmtCounter = $bd->prepare($queryCounter);
        $stmtCounter->execute([]);
        $counter = $stmtCounter->fetchAll(PDO::FETCH_ASSOC);
        
        $response = [
            'success' => true,
            'data' => $results,
            'counter' => $counter
        ];
        
        header('Content-Type: application/json');
        echo json_encode($response);
        
    } catch (Exception $e) {
        throw new Exception("Erreur lors de la récupération: " . $e->getMessage());
    }
}

function getNumberCommandes() {
    global $bd;
    
    try {
        
        $query = "SELECT 
            COUNT(c.id) AS new
        FROM commandes c
        WHERE c.statut = ?";
        $params = ['en_attente'];
        
        $stmt = $bd->prepare($query);
        $stmt->execute($params);
        $number = $stmt->fetchColumn();
        
        $response = [
            'success' => true,
            'number' => $number,
        ];
        
        header('Content-Type: application/json');
        echo json_encode($response);
        
    } catch (Exception $e) {
        throw new Exception("Erreur lors de la récupération: " . $e->getMessage());
    }
}

function getCommandeDetails() {
    global $bd;

    try {

        $commandeId = isset($_POST['commande_id']) 
            ? intval($_POST['commande_id']) 
            : 0;

        if (!$commandeId) {
            throw new Exception('ID de la commande requis.');
        }

        /*
        ============================
        DETAILS COMMANDE
        ============================
        */

        $query = "
            SELECT 

                c.*,

                cl.nom AS client_nom,
                cl.telephone AS client_telephone,

                COALESCE(
                    SUM(lc.quantite),
                    0
                ) AS nombre_produits

            FROM commandes c

            LEFT JOIN Client cl 
                ON c.id_Client = cl.id

            LEFT JOIN ligne_commandes lc
                ON c.id = lc.id_commande

            WHERE c.id = ?

            GROUP BY c.id

            LIMIT 1
        ";

        $stmt = $bd->prepare($query);
        $stmt->execute([$commandeId]);

        $commande = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$commande) {
            throw new Exception('Commande introuvable.');
        }

        /*
        ============================
        PRODUITS DE LA COMMANDE
        ============================
        */

        $queryProduits = "
            SELECT 

                lc.id,
                lc.quantite,
                lc.prix_unitaire,

                p.id AS produit_id,
                p.nom AS produit_nom,
                p.code AS produit_code,
                p.stock,

                (
                    SELECT pi.url_image
                    FROM produit_images pi
                    WHERE pi.id_produit = p.id
                    AND pi.est_principale = TRUE
                    LIMIT 1
                ) AS image

            FROM ligne_commandes lc

            LEFT JOIN produits p
                ON lc.id_produit = p.id

            WHERE lc.id_commande = ?
        ";

        $stmt = $bd->prepare($queryProduits);
        $stmt->execute([$commandeId]);

        $produits = $stmt->fetchAll(PDO::FETCH_ASSOC);

        /*
        ============================
        RESPONSE JSON
        ============================
        */

        header('Content-Type: application/json');

        echo json_encode([
            'success' => true,

            'data' => [
                'commande' => $commande,
                'produits' => $produits
            ]
        ]);

    } catch (Exception $e) {

        header('Content-Type: application/json');

        error_log($e->getMessage());

        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function updateCommandeStatus() {
    global $bd;

    try {
        $commandeId = isset($_POST['commande_id']) ? intval($_POST['commande_id']) : 0;
        $statut = isset($_POST['statut']) ? trim($_POST['statut']) : '';

        if (!$commandeId) {
            throw new Exception('ID du commande requise.');
        }

        if (!$statut || $statut == '') {
            throw new Exception('Statut du commande requise.');
        }

        // Vérifier si le produit existe
        $stmt = $bd->prepare('SELECT id FROM commandes WHERE id = ?');
        $stmt->execute([$commandeId]);
        if (!$stmt->fetch()) {
            throw new Exception('Commande non trouvée.');
        }

        // Mettre à jour le statut actif (on peut utiliser un champ 'active' ou 'statut')
        // Ici on suppose qu'il y a un champ 'active' dans la table produits
        $stmt = $bd->prepare('UPDATE commandes SET statut = ? WHERE id = ?');
        $stmt->execute([$statut, $commandeId]);

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Statut de la commandes mis à jour.'
        ]);
    } catch (Exception $e) {
        header('Content-Type: application/json');
        error_log($e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

?>