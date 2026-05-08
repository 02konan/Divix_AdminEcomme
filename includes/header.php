<?php

session_start();

function title() {
    $url = $_SERVER['REQUEST_URI'];
    if (strpos($url, 'dashboard.php') !== false) {
        return 'Bienvenue sur divix';
    }else{
        return 'Divix';
    }
}
function linkActive($words) {
    $url = $_SERVER['REQUEST_URI'];
    
    // Convertir l'entrée en tableau si c'est une chaîne unique
    $wordsArray = is_array($words) ? $words : [$words];
    
    // Vérifier chaque mot dans la liste
    foreach ($wordsArray as $word) {
        if (strpos($url, $word) !== false) {
            return 'active';
        }
    }
    
    return '';
}

function showTitle() {
    $url = $_SERVER['REQUEST_URI'];
    if (strpos($url, 'dashboard.php') !== false) {
        return 'Dashboard';
    }else if (strpos($url, 'commandes.php') !== false) {
        return 'Commandes';
    }else if (strpos($url, 'produits.php') !== false) {
        return 'Produits';
    }else if (strpos($url, 'clients.php') !== false) {
        return 'Clients';
    }else if (strpos($url, 'reductions.php') !== false) {
        return 'Reductions';
    }else if (strpos($url, 'bannieres.php') !== false) {
        return 'Bannieres';
    }else{
        return 'Divix';
    }
}

$path = $_SERVER['REQUEST_URI'];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#3d6dff">
    <link rel="manifest" href="./manifest.json">
    <link rel="shortcut icon" href="./icons/icon-192.png" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"><!-- Basic Icons -->
    <link href="https://cdn.boxicons.com/3.0.8/fonts/basic/boxicons.min.css" rel="stylesheet">
    <!-- Filled Icons -->
    <link href="https://cdn.boxicons.com/3.0.8/fonts/filled/boxicons-filled.min.css" rel="stylesheet">
    <!-- Brand Icons -->
    <link href="https://cdn.boxicons.com/3.0.8/fonts/brands/boxicons-brands.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="./assets/css/style.css" />   
    <link rel="stylesheet" type="text/css" href="./assets/css/table-mobile.css" />

    <!-- <link rel="stylesheet" type="text/css" href="{{ url_for('static', filename='css/loading.css')}}" /> -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <title><?= title() ?></title>
</head>
<body>
    <div class="container-fluid box-main p-0">
        <nav class="navbar navbar-expand-lg navbar-custom">
            <h4><?= showTitle() ?></h4>
            <button class="btn ms-auto d-none hamburger" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                <i class="bx bx-menu-wider"></i>
            </button>

            <div class="collapse navbar-collapse" id="navMenu">
                <div class="ms-auto d-none d-lg-flex align-items-center gap-2">
                    <div class="position-relative">
                        <svg  xmlns="http://www.w3.org/2000/svg" width="20" height="20"  
                            fill="currentColor" viewBox="0 0 24 24" >
                            <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
                            <path d="M19 12.59V10c0-3.22-2.18-5.93-5.14-6.74C13.57 2.52 12.85 2 12 2s-1.56.52-1.86 1.26C7.18 4.08 5 6.79 5 10v2.59L3.29 14.3a1 1 0 0 0-.29.71v2c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-2c0-.27-.11-.52-.29-.71zM14.82 20H9.18c.41 1.17 1.51 2 2.82 2s2.41-.83 2.82-2"></path>
                        </svg>
                        
                        <span class="position-absolute p-1 bg-danger border border-light rounded-circle" id="sign-alert">
                            <span class="visually-hidden">New alerts</span>
                        </span>
                    </div>
                    <!-- <a href="#" class="nav-link" style="color:rgba(255,255,255,0.6) !important; font-size:0.85rem;">Connexion</a> -->
                    <button type="button" id="logoutBtn" class="btn btn-sm btn-outline-danger ms-1">
                        <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                            fill="currentColor" viewBox="0 0 24 24" >
                            <path d="M11 2h2v10h-2z"></path><path d="M15 4.53v2.16c2.36 1.13 4 3.53 4 6.32 0 3.86-3.14 7-7 7s-7-3.14-7-7c0-2.79 1.64-5.19 4-6.32V4.53C5.51 5.77 3 9.1 3 13c0 4.96 4.04 9 9 9s9-4.04 9-9c0-3.91-2.51-7.24-6-8.47"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
        <nav class="navbar navbar-expand-lg navbar-mobile shadow">
           <div class="w-100 navbar-nav-box" id="">
                <ul class="menu me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link <?= linkActive(['dashboard.php']) ?>" aria-current="page" href="./dashboard.php">
                            <div class="icon-nav">
                                <i class="bxf bx-layers me-2"></i>
                            </div>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= linkActive(['commandes.php']) ?>" aria-current="page" href="./commandes.php">
                            <div class="icon-nav">
                                <i class="bxf bx-receipt me-2"></i>
                            </div>
                            <span>Commandes</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= linkActive(['clients.php']) ?>" aria-current="page" href="./clients.php">
                            <div class="icon-nav">
                                <i class="bxf bx-group me-2"></i>
                            </div>
                            <span>Clients</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= linkActive(['produits.php']) ?>" aria-current="page" href="./produits.php">
                            <div class="icon-nav">
                                <i class="bxf bx-shopping-bag me-2"></i>
                            </div>
                            <span>Produits</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?= linkActive(['reductions.php']) ?>" aria-current="page" href="./reductions.php">
                            <div class="icon-nav">
                                <i class="bxf bx-discount me-2"></i>
                            </div>
                            <span>Reductions</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div class="offcanvas-header">
                <img class="logo-offcanvas" src="./icons/logo.svg" alt="Logo">
                <!-- <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button> -->
            </div>
            <div class="offcanvas-body d-flex flex-column">
                <ul class="nav flex-column">
                    <li class="nav-item"><a href="./bannieres.php" class="nav-link"><i class="bx bx-card-view-large me-2"></i>Banniere</a></li>
                </ul>
                <!-- <div class="dropdown mt-3">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Dropdown button
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </div> -->
                <div class="dropdown dropup profile mt-auto rounded">
                    <div class="d-flex align-items-center text-decoration-none dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer;">
                        <img src="https://i.pravatar.cc/40" alt="Profil" width="40" height="40" class="rounded-circle">
                        <div class="ms-2 ">
                            <span class="profile-name text-capitalize"><?= $_SESSION['nom'] ? $_SESSION['nom'] : '' ?></span><br>
                            <span class="profile-role small text-capitalize"><?= $_SESSION['role'] ? $_SESSION['role'] : '' ?></span>
                            
                            <ul class="dropdown-menu dropdown-menu-start shadow-sm" aria-labelledby="profileDropdown">
                                <li><a class="dropdown-item" href="#">Mon profil</a></li>
                                <li><a class="dropdown-item" href="#">Paramètres</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="#" id="logoutBtn">Déconnexion</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-2 position-fixed h-100 sidebar shadow-sm">
            <div class="h-100 d-flex flex-column p-3 pe-4">
                <div id="logo" class="d-flex mb-4">
                    <img src="./icons/logo.svg" alt="Logo">
                    <!-- <h5 class="logo m-0 p-0 mt-auto ms-2">Divix.</h5> -->
                </div>
                <ul class="nav flex-column">
                    <li class="nav-item"><a href="./dashboard.php" class="nav-link <?= linkActive(['dashboard.php']) ?>"><i class="bxf bx-layers me-2"></i>Dashboard</a></li>
                    <li class="nav-item"><a href="./commandes.php" class="nav-link <?= linkActive(['commandes.php']) ?>"><i class="bxf bx-receipt me-2"></i>Commandes</a></li>
                    <li class="nav-item"><a href="./clients.php" class="nav-link <?= linkActive(['clients.php']) ?>"><i class="bxf bx-group me-2"></i>Clients</a></li>
                    <li class="nav-item"><a href="./produits.php" class="nav-link <?= linkActive(['produits.php']) ?>"><i class="bxf bx-shopping-bag me-2"></i>Produits</a></li>
                    <li class="nav-item"><a href="./bannieres.php" class="nav-link <?= linkActive(['bannieres.php']) ?>"><i class="bxf bx-card-view-large me-2"></i>Banniere</a></li>
                    <li class="nav-item"><a href="./reductions.php" class="nav-link <?= linkActive(['reductions.php']) ?>"><i class="bxf bx-discount me-2"></i>Reductions</a></li>
                </ul>
                <ul class="nav flex-column mt-auto">
                    <!-- <li class="nav-item"><a href="#" class="nav-link"><i class="bxf bx-bell me-2"></i>Notifications</a></li>
                    <li class="nav-item"><a href="#" class="nav-link"><i class="bxf bx-help-circle me-2"></i>Support</a></li>
                    <li class="nav-item"><a href="#" class="nav-link"><i class="bxf bx-cog me-2"></i>Paramètres</a></li> -->

                    <div class="dropdown dropup profile mt-auto rounded">
                        <div class="d-flex align-items-center text-decoration-none dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer;">
                            <img src="https://i.pravatar.cc/40" alt="Profil" width="40" height="40" class="rounded-circle">
                            <div class="ms-2 ">
                                <span class="profile-name text-capitalize"><?= $_SESSION['nom'] ? $_SESSION['nom'] : '' ?></span><br>
                                <span class="profile-role small text-capitalize"><?= $_SESSION['role'] ? $_SESSION['role'] : '' ?></span>
                            </div>
                        </div>
                    </div>
                </ul>
            </div>
        </div>

        <div class="container-fluid main d-flex gap-3 flex-column">
            
            <div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" id="loginToast" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
                <div class="d-flex">
                    <div class="toast-body">
                    Hello, world! This is a toast message.
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        