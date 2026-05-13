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
        case 'getProduits':
            getProduits();
            break;
        case 'getProduitOptions':
            getProduitOptions();
            break;
        case 'getSousCategories':
            getSousCategories();
            break;
        case 'addProduit':
            addProduit();
            break;
        case 'getProduitDetails':
            getProduitDetails();
            break;
        case 'deleteProduitImage':
            deleteProduitImage();
            break;
        case 'updateProduitStatus':
            updateProduitStatus();
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

function getProduitOptions() {
    global $bd;
    try {
        $categories = [];

        if (tableExists('categories')) {
            $stmt = $bd->prepare('SELECT id, nom FROM categories ORDER BY nom ASC');
            $stmt->execute();
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $stmt = $bd->prepare('SELECT DISTINCT categorie AS nom FROM produits WHERE categorie IS NOT NULL AND categorie != "" ORDER BY categorie ASC');
            $stmt->execute();
            $categories = array_map(function($row) {
                return ['id' => $row['nom'], 'nom' => $row['nom']];
            }, $stmt->fetchAll(PDO::FETCH_ASSOC));
        }

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'categories' => $categories
        ]);
    } catch (Exception $e) {
        header('Content-Type: application/json');
        error_log($e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Impossible de charger les options.'
        ]);
    }
}

function getSousCategories() {
    global $bd;

    try {
        $categorieId = isset($_POST['categorie_id']) ? trim($_POST['categorie_id']) : '';
        if (!$categorieId) {
            throw new Exception('Catégorie invalide');
        }

        $sousCategories = [];

        if (tableExists('sous_categories')) {
            $query = 'SELECT id, nom FROM sous_categories WHERE id_categorie = ? ORDER BY nom ASC';
            $stmt = $bd->prepare($query);
            try {
                $stmt->execute([$categorieId]);
                $sousCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                $query = 'SELECT id, nom FROM sous_categories WHERE id_categorie = ? ORDER BY nom ASC';
                $stmt = $bd->prepare($query);
                $stmt->execute([$categorieId]);
                $sousCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        }

        if (empty($sousCategories)) {
            $fallbackQuery = 'SELECT DISTINCT sous_categorie AS nom FROM produits WHERE categorie = ? AND sous_categorie IS NOT NULL AND sous_categorie != "" ORDER BY sous_categorie ASC';
            $stmt = $bd->prepare($fallbackQuery);
            $stmt->execute([$categorieId]);
            $sousCategories = array_map(function($row) {
                return ['id' => $row['nom'], 'nom' => $row['nom']];
            }, $stmt->fetchAll(PDO::FETCH_ASSOC));
        }

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'sous_categories' => $sousCategories
        ]);
    } catch (Exception $e) {
        header('Content-Type: application/json');
        error_log($e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Impossible de charger les sous-catégories.'
        ]);
    }
}

function getOrCreateCategoryId($nom) {
    global $bd;
    if (!$nom || !tableExists('categories')) {
        return null;
    }

    $nom = trim($nom);
    $stmt = $bd->prepare('SELECT id FROM categories WHERE LOWER(nom) = LOWER(?) LIMIT 1');
    $stmt->execute([$nom]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row && isset($row['id'])) {
        return $row['id'];
    }

    $stmt = $bd->prepare('INSERT INTO categories (nom) VALUES (?)');
    $stmt->execute([$nom]);
    return $bd->lastInsertId();
}

function getOrCreateSousCategorieId($nom, $categorieId = null) {
    global $bd;
    if (!$nom || !tableExists('sous_categories')) {
        return null;
    }

    $nom = trim($nom);
    $row = null;

    if ($categorieId) {
        $query = 'SELECT id FROM sous_categories WHERE LOWER(nom) = LOWER(?) AND id_categorie = ? LIMIT 1';
        $stmt = $bd->prepare($query);
        try {
            $stmt->execute([$nom, $categorieId]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $query = 'SELECT id FROM sous_categories WHERE LOWER(nom) = LOWER(?) AND id_categorie = ? LIMIT 1';
            $stmt = $bd->prepare($query);
            $stmt->execute([$nom, $categorieId]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }

    if (!$row) {
        $stmt = $bd->prepare('SELECT id FROM sous_categories WHERE LOWER(nom) = LOWER(?) LIMIT 1');
        $stmt->execute([$nom]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if ($row && isset($row['id'])) {
        return $row['id'];
    }

    $inserted = false;
    if ($categorieId) {
        try {
            $stmt = $bd->prepare('INSERT INTO sous_categories (nom, id_categorie) VALUES (?, ?)');
            $stmt->execute([$nom, $categorieId]);
            $inserted = true;
        } catch (PDOException $e) {
            $stmt = $bd->prepare('INSERT INTO sous_categories (nom, id_categorie) VALUES (?, ?)');
            $stmt->execute([$nom, $categorieId]);
            $inserted = true;
        }
    }

    if (!$inserted) {
        $stmt = $bd->prepare('INSERT INTO sous_categories (nom) VALUES (?)');
        $stmt->execute([$nom]);
    }

    return $bd->lastInsertId();
}

function addProduit() {
    global $bd;

    try {
        $nom = trim($_POST['nom'] ?? '');
        $categorieLabel = trim($_POST['categorie_label'] ?? '');
        $sousCategorieLabel = trim($_POST['sous_categorie_label'] ?? '');
        $categorieId = trim($_POST['categorie'] ?? '');
        $sousCategorieId = trim($_POST['sous_categorie'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $prixVente = isset($_POST['prix_vente']) ? trim($_POST['prix_vente']) : '';
        $stock = isset($_POST['stock']) ? intval($_POST['stock']) : 0;
        $seuil = isset($_POST['stock_min']) ? intval($_POST['stock_min']) : 0;

        if (!$nom) {
            throw new Exception('Le nom du produit est requis.');
        }
        if (!$categorieLabel) {
            throw new Exception('La catégorie est requise.');
        }
        if (!$sousCategorieLabel) {
            throw new Exception('La sous-catégorie est requise.');
        }
        if (!$description) {
            throw new Exception('La description est requise.');
        }

        if (!$categorieId) {
            $categorieId = getOrCreateCategoryId($categorieLabel);
        }

        if (!$sousCategorieId) {
            $sousCategorieId = getOrCreateSousCategorieId($sousCategorieLabel, $categorieId ?: null);
        }

        $code = genererCodeProduit();

        $stmt = $bd->prepare('INSERT INTO produits (code, nom, prix, description, stock, seuil, id_sous_categorie) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $code,
            $nom,
            $prixVente,
            $description,
            $stock,
            $seuil,
            $sousCategorieId
        ]);

        $produitId = $bd->lastInsertId();

        $hasPrimaryImage = false;
        $uploadDir = __DIR__ . '/../uploads/produits/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if (!empty($_FILES['images']) && is_array($_FILES['images']['name'])) {
            foreach ($_FILES['images']['name'] as $index => $name) {
                if ($_FILES['images']['error'][$index] !== UPLOAD_ERR_OK) {
                    continue;
                }

                $imageName = basename($name);
                $extension = pathinfo($imageName, PATHINFO_EXTENSION);
                $safeName = uniqid('prod_') . '.' . $extension;
                $targetPath = $uploadDir . $safeName;

                if (move_uploaded_file($_FILES['images']['tmp_name'][$index], $targetPath)) {
                    if (tableExists('produit_images')) {
                        try {
                            $stmt = $bd->prepare('INSERT INTO produit_images (id_produit, url_image, est_principale) VALUES (?, ?, ?)');
                            $stmt->execute([$produitId, $safeName, $hasPrimaryImage ? 0 : 1]);
                            $hasPrimaryImage = true;
                        } catch (PDOException $e) {
                            // ignore image insert if schema differs
                        }
                    }
                }
            }
        }

        $imageUrlsRaw = trim($_POST['image_urls'] ?? '');
        if ($imageUrlsRaw) {
            $urls = preg_split('/\r?\n|,/', $imageUrlsRaw, -1, PREG_SPLIT_NO_EMPTY);
            foreach ($urls as $url) {
                $url = trim($url);
                if (!$url || !preg_match('#^https?://#i', $url)) {
                    continue;
                }
                if (tableExists('produit_images')) {
                    try {
                        $stmt = $bd->prepare('INSERT INTO produit_images (id_produit, url_image, est_principale) VALUES (?, ?, ?)');
                        $stmt->execute([$produitId, $url, $hasPrimaryImage ? 0 : 1]);
                        $hasPrimaryImage = true;
                    } catch (PDOException $e) {
                        // ignore image insert if schema differs
                    }
                }
            }
        }

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Produit ajouté avec succès.'
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

function getProduits() {
    global $bd;
    
    try {
        $search = isset($_POST['searchInput']) ? trim($_POST['searchInput']) : '';
        // $page = isset($_POST['page']) ? (int)$_POST['page'] : 1;
        // $limit = 10;
        // $offset = ($page - 1) * $limit;
        
        $query = "SELECT 
            p.*, 
            pi.url_image,
            sc.nom AS sous_categorie,
            c.nom AS categorie,
            CASE
                WHEN p.stock <= 0 THEN 'Rupture'
                WHEN p.stock <= p.seuil AND p.stock > 0 THEN 'St. faible'
                ELSE 'En stock'
            END AS statut
        FROM produits p
        LEFT JOIN produit_images pi 
            ON p.id = pi.id_produit
            AND pi.est_principale = TRUE
        LEFT JOIN sous_categories sc
            ON p.id_sous_categorie = sc.id
        LEFT JOIN categories c
            ON sc.id_categorie = c.id
        ORDER BY p.id DESC";
        $params = [];
        
        $stmt = $bd->prepare($query);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $queryCounter = "
        SELECT 

        COUNT(*) AS total_produits,

        COUNT(
            CASE 
                WHEN stock <= seuil 
                AND stock > 0 
                THEN 1 
            END
        ) AS stock_faible,

        COUNT(
            CASE 
                WHEN stock <= 0 
                THEN 1 
            END
        ) AS rupture_stock

    FROM produits;";

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

function getProduitDetails() {
    global $bd;

    try {
        $produitId = isset($_POST['produit_id']) ? intval($_POST['produit_id']) : 0;
        if (!$produitId) {
            throw new Exception('ID du produit requis.');
        }

        $query = "SELECT 
            p.*, 
            sc.nom AS sous_categorie,
            c.nom AS categorie,
            CASE
                WHEN p.stock <= 0 THEN 'Rupture'
                WHEN p.stock <= p.seuil AND p.stock > 0 THEN 'St. faible'
                ELSE 'En stock'
            END AS statut
        FROM produits p
        LEFT JOIN sous_categories sc ON p.id_sous_categorie = sc.id
        LEFT JOIN categories c ON sc.id_categorie = c.id
        WHERE p.id = ?
        LIMIT 1";

        $stmt = $bd->prepare($query);
        $stmt->execute([$produitId]);
        $produit = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$produit) {
            throw new Exception('Produit non trouvé.');
        }

        $images = [];
        if (tableExists('produit_images')) {
            $stmt = $bd->prepare('SELECT id, url_image, est_principale FROM produit_images WHERE id_produit = ? ORDER BY est_principale DESC, id ASC');
            $stmt->execute([$produitId]);
            $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => [
                'produit' => $produit,
                'images' => $images
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

function deleteProduitImage() {
    global $bd;

    try {
        $imageId = isset($_POST['image_id']) ? intval($_POST['image_id']) : 0;
        if (!$imageId) {
            throw new Exception('ID de l\'image requis.');
        }

        if (!tableExists('produit_images')) {
            throw new Exception('Table produit_images introuvable.');
        }

        $stmt = $bd->prepare('SELECT id_produit, url_image, est_principale FROM produit_images WHERE id = ?');
        $stmt->execute([$imageId]);
        $image = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$image) {
            throw new Exception('Image introuvable.');
        }

        $bd->beginTransaction();
        $stmt = $bd->prepare('DELETE FROM produit_images WHERE id = ?');
        $stmt->execute([$imageId]);

        if ($image['est_principale']) {
            $stmt = $bd->prepare('SELECT id FROM produit_images WHERE id_produit = ? ORDER BY id ASC LIMIT 1');
            $stmt->execute([$image['id_produit']]);
            $nextImage = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($nextImage) {
                $stmt = $bd->prepare('UPDATE produit_images SET est_principale = 1 WHERE id = ?');
                $stmt->execute([$nextImage['id']]);
            }
        }

        $bd->commit();

        if (!preg_match('#^https?://#i', $image['url_image'])) {
            $filePath = __DIR__ . '/../uploads/produits/' . $image['url_image'];
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Image du produit supprimée.'
        ]);
    } catch (Exception $e) {
        if ($bd->inTransaction()) {
            $bd->rollBack();
        }
        header('Content-Type: application/json');
        error_log($e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function updateProduitStatus() {
    global $bd;

    try {
        $produitId = isset($_POST['produit_id']) ? intval($_POST['produit_id']) : 0;
        $active = isset($_POST['active']) ? intval($_POST['active']) : 0;

        if (!$produitId) {
            throw new Exception('ID du produit requis.');
        }

        // Vérifier si le produit existe
        $stmt = $bd->prepare('SELECT id FROM produits WHERE id = ?');
        $stmt->execute([$produitId]);
        if (!$stmt->fetch()) {
            throw new Exception('Produit non trouvé.');
        }

        // Mettre à jour le statut actif (on peut utiliser un champ 'active' ou 'statut')
        // Ici on suppose qu'il y a un champ 'active' dans la table produits
        $stmt = $bd->prepare('UPDATE produits SET active = ? WHERE id = ?');
        $stmt->execute([$active, $produitId]);

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Statut du produit mis à jour.'
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