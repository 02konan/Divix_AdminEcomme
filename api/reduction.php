<?php
session_start();
require('../config/database.php');

ini_set('display_errors', 0);
error_reporting(0);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

try {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
    switch($action) {
        case 'addReduction':
            addReduction();
            break;
        case 'annuleReduction':
            annuleReduction();
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
function genererCodeReduction() {
    global $bd;
    
    try {
        $query = "SELECT code FROM reductions ORDER BY id DESC LIMIT 1";
        $stmt = $bd->prepare($query);
        $stmt->execute();
        $last = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $prefix = 'REDUC-';
        $numero = 1;

        if ($last && isset($last['code']) && preg_match('/^REDUC-(\d+)$/', $last['code'], $matches)) {
            $numero = intval($matches[1]) + 1;
        }

        return $prefix . str_pad($numero, 8, '0', STR_PAD_LEFT);
    } catch (Exception $e) {
        return 'REDUC-00000001';
    }
}

function addReduction() {
    global $bd;

    try {
        $produit_reduction_id = trim($_POST['produit_reduction_id'] ?? '');
        $type_reduction = trim($_POST['type_reduction'] ?? '');
        $valeur_reduction = trim($_POST['valeur_reduction'] ?? '0');
        $active = $_POST['active'] ? (int) $_POST['active'] : 0;

        if (!$produit_reduction_id) {
            throw new Exception('Le id du produit est requis.');
        }
        if (!$type_reduction) {
            throw new Exception('Le type du produit est requis.');
        }
        if (!$valeur_reduction) {
            throw new Exception('La valeur est requise.');
        }
        
        if ($active == 1) {
            // Récupérer l'ID de la réduction active pour ce produit
            $checkStmt = $bd->prepare('SELECT r.id FROM reductions r INNER JOIN reduction_produits rp ON r.id = rp.id_reduction WHERE rp.id_produit = ? AND r.actif = 1');
            $checkStmt->execute([$produit_reduction_id]);
            $existingReduction = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            // Désactiver l'ancienne réduction si elle existe
            if ($existingReduction) {
                $update = $bd->prepare('UPDATE reductions SET actif = 0, date_modification = NOW() WHERE id = ?');
                $update->execute([$existingReduction['id']]);
            }
        }

        $code = genererCodeReduction();

        $stmt = $bd->prepare('INSERT INTO reductions (code, type, valeur, actif) VALUES (?, ?, ?, ?)');
        $stmt->execute([
            $code,
            $type_reduction,
            $valeur_reduction,
            $active
        ]);

        $reductionId = $bd->lastInsertId();
        
        $reduction_produits = $bd->prepare('INSERT INTO reduction_produits (id_reduction, id_produit) VALUES (?, ?)');
        $reduction_produits->execute([
            $reductionId,
            $produit_reduction_id
        ]);
        
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Réduction effectuée avec succès.'
        ]);
        return;
    } catch (Exception $e) {
        header('Content-Type: application/json');
        error_log($e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
        return;
    }
}
function annuleReduction() {
    global $bd;

    try {
        $produit_id = trim($_POST['id'] ?? '');
        if (!$produit_id) {
            throw new Exception('L\'ID du produit est requis.');
        }

        // D'abord, récupérer l'ID de la réduction active pour ce produit
        $stmt = $bd->prepare('
            SELECT r.id 
            FROM reductions r 
            INNER JOIN reduction_produits rp ON r.id = rp.id_reduction 
            WHERE rp.id_produit = ? AND r.actif = 1 
            LIMIT 1
        ');
        $stmt->execute([$produit_id]);
        $reduction = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$reduction) {
            throw new Exception('Aucune réduction active trouvée pour ce produit.');
        }

        // Désactiver la réduction
        $update = $bd->prepare('UPDATE reductions SET actif = 0, date_modification = NOW() WHERE id = ?');
        $update->execute([$reduction['id']]);
        
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Réduction annulée avec succès.'
        ]);
        return;
    } catch (Exception $e) {
        header('Content-Type: application/json');
        error_log($e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
        return;
    }
}
