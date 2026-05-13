<?php
// backend pour la deconnexion de l'utilisateur
session_start();
require('../config/database.php');

// Désactiver l'affichage des erreurs
ini_set('display_errors', 0);
error_reporting(0);

try {

    // Détruire la session
    session_unset();
    $_SESSION = [];
    session_destroy();

    header('location: ../login.php');

} catch (Exception $e) {

    header('Content-Type: application/json');
    error_log($e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur est survenue lors du traitement de la requête'
    ]);

}


?>