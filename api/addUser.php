<?php
// session_start();
// require('../config/database.php');

// // Désactiver l'affichage des erreurs
// ini_set('display_errors', 0);
// error_reporting(0);

// try {
//     $nom = isset($_POST['nom']) ? $_POST['nom'] : "Dorgeles Gnahoré";
//     $email = isset($_POST['email']) ? $_POST['email'] : "dg@gmail.com";
//     $role = "admin";
//     $password = isset($_POST['password']) ? $_POST['password'] : "0000";
//     $telephone = isset($_POST['telephone']) ? $_POST['telephone'] : "0789147958";

    
//     if (empty($email) || empty($password) || empty($nom) || empty($telephone)) {
//         echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs']);
//         exit;
//     }

//     // Vérifier si l'email existe déjà
//     $stmt = $bd->prepare("SELECT * FROM users WHERE email = :email");
//     $stmt->execute([':email' => $email]);
//     $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

//     if ($existingUser) {
//         echo json_encode(['success' => false, 'message' => 'Cet email est déjà utilisé']);
//         exit;
//     }

//     // Hash du mot de passe
//     $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
//     // Insérer le nouvel utilisateur dans la base de données
//     $stmt = $bd->prepare("INSERT INTO users (nom, email, role, mot_de_passe, telephone) VALUES (:nom, :email, :role, :mot_de_passe, :telephone)");
//     $stmt->execute([
//         ':nom' => $nom,
//         ':email' => $email,
//         ':role' => $role,
//         ':mot_de_passe' => $hashedPassword,
//         ':telephone' => $telephone
//     ]);
    

//     header('Content-Type: application/json');
//     echo json_encode(['success' => true, 'message' => 'Utilisateur créé avec succès']);
    

// } catch (Exception $e) {

//     header('Content-Type: application/json');
//     error_log($e->getMessage());
//     echo json_encode([
//         'success' => false,
//         'message' => $e->getMessage()
//     ]);

// }


?>