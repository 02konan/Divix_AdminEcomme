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
        case 'getClients':
            getClients();
            break;
        case 'getClientsDetails':
            getClientsDetails();
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
function getClients() {
    global $bd;
    
    try {
        $search = isset($_POST['searchInput']) ? trim($_POST['searchInput']) : '';
        // $page = isset($_POST['page']) ? (int)$_POST['page'] : 1;
        // $limit = 10;
        // $offset = ($page - 1) * $limit;
        
        $query = "SELECT 
            cl.*,
            cl.nom AS client_nom,
            cl.telephone AS client_telephone,
            COALESCE(COUNT(c.id), 0) AS nombre_commandes
        FROM Client cl 
        LEFT JOIN commandes c
            ON cl.id = c.id_Client
        GROUP BY cl.id
        ORDER BY cl.id DESC";
        $params = [];
        
        $stmt = $bd->prepare($query);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $queryCounter = "
        SELECT 

    COUNT(*) AS total_clients

    FROM Client";

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

function getClientsDetails() {
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

?>