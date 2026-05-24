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
        case 'getBannieres':
            getBannieres();
            break;
        case 'getBanniereDetails':
            getBanniereDetails();
            break;
        case 'addBanniere':
            addBanniere();
            break;
        case 'updateBanniereStatus':
            updateBanniereStatus();
            break;
        case 'deleteBanniere':
            deleteBanniere();
            break;
        case 'updateBanniere':
            updateBanniere();
            break;
        case 'getProduitsForBanner':
            getProduitsForBanner();
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

function tableExists($tableName) {
    global $bd;
    $stmt = $bd->prepare("SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?");
    $stmt->execute([$tableName]);
    return (int)$stmt->fetchColumn() > 0;
}

function getProduitsForBanner() {
    global $bd;
    
    try {
        // Vérifier si la table produits existe
        $stmt = $bd->query("SELECT id, nom, code, prix, stock FROM produits WHERE active = 1 ORDER BY nom ASC");
        $produits = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $produits
        ]);
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors du chargement des produits: ' . $e->getMessage()
        ]);
    }
}

function getBannieres() {
    global $bd;

    try {
        // Vérifier si la table existe
        if (!tableExists('bannieres')) {
            // Créer la table si elle n'existe pas avec la nouvelle structure
            $sql = 'CREATE TABLE bannieres (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titre VARCHAR(255) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                lien VARCHAR(500),
                id_produit INT NULL,
                type ENUM("banner", "event", "promo", "marquee", "a_la_une") NOT NULL,
                active TINYINT(1) DEFAULT 1,
                date_debut DATETIME NULL,
                date_fin DATETIME NULL,
                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )';
            $bd->exec($sql);
        }

        $query = "SELECT b.*, p.nom as produit_nom 
                  FROM bannieres b 
                  LEFT JOIN produits p ON b.id_produit = p.id 
                  ORDER BY b.date_creation DESC";
        $stmt = $bd->prepare($query);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $results
        ]);
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors de la récupération: ' . $e->getMessage()
        ]);
    }
}

function getBanniereDetails() {
    global $bd;

    try {
        // Vérifier si la table existe
        if (!tableExists('bannieres')) {
            throw new Exception('Table bannieres non trouvée.');
        }

        $banniere_id = isset($_POST['banniere_id']) ? intval($_POST['banniere_id']) : 0;
        if (!$banniere_id) {
            throw new Exception('ID de la bannière requis.');
        }

        $stmt = $bd->prepare('SELECT b.*, p.nom as produit_nom, p.prix as produit_prix 
                              FROM bannieres b 
                              LEFT JOIN produits p ON b.id_produit = p.id 
                              WHERE b.id = ?');
        $stmt->execute([$banniere_id]);
        $banniere = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$banniere) {
            throw new Exception('Bannière non trouvée.');
        }

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $banniere
        ]);
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function addBanniere() {
    global $bd;

    try {
        // Vérifier si la table existe, la créer si nécessaire
        if (!tableExists('bannieres')) {
            $sql = 'CREATE TABLE bannieres (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titre VARCHAR(255) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                lien VARCHAR(500),
                id_produit INT NULL,
                type ENUM("banner", "event", "promo", "marquee", "a_la_une") NOT NULL,
                active TINYINT(1) DEFAULT 1,
                date_debut DATETIME NULL,
                date_fin DATETIME NULL,
                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )';
            $bd->exec($sql);
        }
        
        $titre = trim($_POST['titre'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $type = trim($_POST['type'] ?? '');
        $lien = trim($_POST['lien'] ?? '');
        $active = isset($_POST['active']) ? 1 : 0;
        $date_debut = !empty($_POST['date_debut']) ? $_POST['date_debut'] : null;
        $date_fin = !empty($_POST['date_fin']) ? $_POST['date_fin'] : null;
        $id_produit = ($type === 'a_la_une' && !empty($_POST['id_produit'])) ? intval($_POST['id_produit']) : null;

        if (!$titre) {
            throw new Exception('Le titre est requis.');
        }
        if (!$type) {
            throw new Exception('Le type est requis.');
        }
        
        if ($type === 'a_la_une' && !$id_produit) {
            throw new Exception('Veuillez sélectionner un produit pour la section "À la une".');
        }

        // Vérifier si l'image est requise selon le type
        $imageRequired = in_array($type, ['banner', 'promo', 'event']);
        $imageName = null;

        // Traiter l'upload de l'image si elle est présente
        if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../uploads/bannieres/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $originalName = basename($_FILES['image']['name']);
            $extension = pathinfo($originalName, PATHINFO_EXTENSION);
            $imageName = uniqid('banner_') . '.' . $extension;
            $targetPath = $uploadDir . $imageName;

            if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                throw new Exception('Erreur lors de l\'upload de l\'image.');
            }
        } elseif ($imageRequired) {
            throw new Exception('L\'image est requise pour ce type de bannière.');
        }

        // Insérer dans la base de données
        $stmt = $bd->prepare('INSERT INTO bannieres (titre, description, image, lien, id_produit, type, active, date_debut, date_fin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $titre,
            $description,
            $imageName,
            $lien,
            $id_produit,
            $type,
            $active,
            $date_debut,
            $date_fin
        ]);

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Bannière ajoutée avec succès.'
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

function deleteBanniere() {
    global $bd;

    try {
        // Vérifier si la table existe
        if (!tableExists('bannieres')) {
            throw new Exception('Table bannieres non trouvée.');
        }
        $banniere_id = isset($_POST['banniere_id']) ? intval($_POST['banniere_id']) : 0;

        if (!$banniere_id) {
            throw new Exception('ID de la bannière requis.');
        }

        $stmt = $bd->prepare('SELECT image FROM bannieres WHERE id = ?');
        $stmt->execute([$banniere_id]);
        $banniere = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$banniere) {
            throw new Exception('Bannière non trouvée.');
        }

        $stmt = $bd->prepare('DELETE FROM bannieres WHERE id = ?');
        $stmt->execute([$banniere_id]);

        if ($banniere['image']) {
            $filePath = __DIR__ . '/../uploads/bannieres/' . $banniere['image'];
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Bannière supprimée.'
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

function updateBanniereStatus() {
    global $bd;

    try {
        if (!tableExists('bannieres')) {
            throw new Exception('Table bannieres non trouvée.');
        }
        
        $banniere_id = isset($_POST['banniere_id']) ? intval($_POST['banniere_id']) : 0;
        $active = isset($_POST['active']) ? intval($_POST['active']) : 0;

        if (!$banniere_id) {
            throw new Exception('ID de la bannière requis.');
        }

        $stmt = $bd->prepare('UPDATE bannieres SET active = ? WHERE id = ?');
        $stmt->execute([$active, $banniere_id]);

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Statut mis à jour.'
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

function updateBanniere() {
    global $bd;

    try {
        // Vérifier si la table existe
        if (!tableExists('bannieres')) {
            throw new Exception('Table bannieres non trouvée.');
        }
        
        $banniere_id = isset($_POST['banner_id']) ? intval($_POST['banner_id']) : 0;
        
        $titre = trim($_POST['titre'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $type = trim($_POST['type'] ?? '');
        $lien = trim($_POST['lien'] ?? '');
        $active = isset($_POST['active']) ? 1 : 0;
        $date_debut = !empty($_POST['date_debut']) ? $_POST['date_debut'] : null;
        $date_fin = !empty($_POST['date_fin']) ? $_POST['date_fin'] : null;
        $id_produit = ($type === 'a_la_une' && !empty($_POST['id_produit'])) ? intval($_POST['id_produit']) : null;

        // Debug - voir ce qui est reçu
        error_log("updateBanniere - ID reçu: " . $banniere_id);
        error_log("updateBanniere - POST: " . print_r($_POST, true));

        if (!$banniere_id) {
            throw new Exception('ID de la bannière requis. Reçu: ' . $banniere_id);
        }
        if (!$titre) {
            throw new Exception('Le titre est requis.');
        }
        if (!$type) {
            throw new Exception('Le type est requis.');
        }
        
        if ($type === 'a_la_une' && !$id_produit) {
            throw new Exception('Veuillez sélectionner un produit pour la section "À la une".');
        }

        $stmt = $bd->prepare('SELECT image FROM bannieres WHERE id = ?');
        $stmt->execute([$banniere_id]);
        $banniere = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$banniere) {
            throw new Exception('Bannière non trouvée.');
        }

        $imageName = $banniere['image'];
        if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../uploads/bannieres/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $originalName = basename($_FILES['image']['name']);
            $extension = pathinfo($originalName, PATHINFO_EXTENSION);
            $imageName = uniqid('banner_') . '.' . $extension;
            $targetPath = $uploadDir . $imageName;

            if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                throw new Exception('Erreur lors de l\'upload de l\'image.');
            }

            if ($banniere['image']) {
                $oldPath = $uploadDir . $banniere['image'];
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
        }

        $stmt = $bd->prepare('UPDATE bannieres SET titre = ?, description = ?, image = ?, lien = ?, id_produit = ?, type = ?, active = ?, date_debut = ?, date_fin = ? WHERE id = ?');
        $stmt->execute([
            $titre,
            $description,
            $imageName,
            $lien,
            $id_produit,
            $type,
            $active,
            $date_debut,
            $date_fin,
            $banniere_id
        ]);

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Bannière mise à jour.'
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