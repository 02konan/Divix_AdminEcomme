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
    // Récupérer les données
    $email = isset($_POST['email']) ? $_POST['email'] : "";
    $password = isset($_POST['password']) ? $_POST['password'] : "";

    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs']);
        exit;
    }

    // Vérifier les informations d'identification
    $stmt = $bd->prepare("SELECT u.*, r.nom_roles AS roles FROM users u LEFT JOIN role r ON u.role = r.id WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['mot_de_passe'])) {

        echo json_encode(['success' => false, 'message' => 'Email ou mot de passe incorrect']);
        exit;
    }

    // verifier que le compte est actif    
    if ($user['statut'] !== 'actif' && $user['statut'] !== null) {
        echo json_encode(['success' => false, 'message' => 'Votre compte n\'est pas actif']);
        exit;
    }

    // Stocker les informations de l'utilisateur dans la session
    $_SESSION['id'] = $user['id'];
    $_SESSION['nom'] = $user['nom'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['telephone'] = $user['telephone'];
    $_SESSION['role'] = $user['roles'];
    $_SESSION['auth'] = true;

    // $data = [
    //     'id' => $_SESSION['id'],
    //     'nom' => $_SESSION['nom'],
    //     'email' => $_SESSION['email'],
    //     'statut' => $_SESSION['telephone'],
    // ];

    // $json = json_encode($data);


    // enregistrerHistorique($_SESSION['id'], 'Connexion', "Connexion de l'utilisateur avec l'email : $email", $json, $_SESSION['etablissement_id']);


    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Connexion réussie', 'redirect' => './produits.php']);

} catch (Exception $e) {

    header('Content-Type: application/json');
    error_log($e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur est survenue lors du traitement de la requête'
    ]);

}


?>