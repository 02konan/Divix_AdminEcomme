<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#3d6dff">
    <link rel="manifest" href="./manifest.json">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://cdn.boxicons.com/3.0.8/fonts/basic/boxicons.min.css" rel="stylesheet">
    <!-- Filled Icons -->
    <link href="https://cdn.boxicons.com/3.0.8/fonts/filled/boxicons-filled.min.css" rel="stylesheet">
    <!-- Brand Icons -->
    <link href="https://cdn.boxicons.com/3.0.8/fonts/brands/boxicons-brands.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="./assets/css/style.css" />
    <link rel="stylesheet" type="text/css" href="./assets/css/login.css" />
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <title>Connexion - Divix</title>
</head>
<body class="login-body">
    <div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" id="loginToast" style="position: absolute; top: 20px; left: 20px; z-index: 99;">
        <div class="d-flex">
            <div class="toast-body">
            Hello, world! This is a toast message.
            </div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
    <div class="row login-container">
        <div class="col-6 img">
            <div class="d-flex w-100 align-items-center header-login-img">
                <span class="m-0 login-subtilte" id="">Se connecter</span>
                <div id="logo" class="d-flex border-0 ms-auto">
                    <img src="./icons/logo.svg" alt="Logo">
                    <!-- <h5 class="logo m-0 p-0 mt-auto ms-2">Divix.</h5> -->
                </div>
            </div>
        </div>
        <div class="col-6 d-flex flex-column align-items-center justify-content-center f-login">
            <div class="align-items-center header-mobile">
                <span class="m-0 text-muted" id="">Se connecter</span>
                <div id="logo" class="d-flex border-0 m-0 p-0 ms-auto">
                    <!-- <img src="/static/icons/logo.svg" alt="Logo"> -->
                    <h5 class="m-0 p-0 mt-auto ms-2">Divix.</h5>
                </div>
            </div>
            <h1 class="text-center">Heureux de vous revoir</h1>
            <p class="text-center text-muted mb-4">Connectez-vous pour continuer votre expérience</p>
            <form action="/login" method="post" class="form-login" id="loginForm">
                <div class="form-floating mb-3 mt-2">
                    <input type="text" class="form-control" name="email" id="email" placeholder="name@example.com">
                    <label for="floatingInput">Nom d'utilisateur</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="password" class="form-control" name="password" id="password" placeholder="name@example.com">
                    <label for="floatingInput">Mot de passe</label>
                </div>
                <div class="d-flex mb-3">
                    <a href="#" role="button" class="ms-auto forgot-link">Mot de passe oublié?</a>
                </div>
                <button type="submit" class="btn-login">Se connecter</button>
                <!-- Séparateur -->
                <div class="divider mb-3">
                    <span>OU</span>
                </div>

                <!-- Boutons sociaux -->
                <div class="social-login">
                    <button type="button" class="btn btn-social" title="Google">
                        <i class="bxl bx-google"></i>
                    </button>
                    <button type="button" class="btn btn-social" title="Facebook">
                        <i class="bxl bx-facebook"></i>
                    </button>
                    <button type="button" class="btn btn-social" title="LinkedIn">
                        <i class="bxl bx-linkedin"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js"></script>
    <script>

        
        const toastEl = document.getElementById('loginToast');

        // Afficher les alertes
        function showAlert(type, message) {
            if (!toastEl) return;

            const toastBody = toastEl.querySelector('.toast-body');
            toastEl.className = 'toast align-items-center bg-white text-dark';
            const iconClass = type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-danger';
            toastBody.innerHTML = `<i class="bi ${iconClass} me-2"></i>${message}`;

            const toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl);
            toastInstance.show();
        }

        // Form submission with validation and AJAX
        const loginForm = document.getElementById('loginForm');
        const submitBtn = loginForm.querySelector('.btn-login');
        const originalBtnText = submitBtn.innerHTML;

        loginForm.addEventListener('submit', async function(e) {

            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Validation basique
            if (!email || !password) {
                showAlert('error', 'Veuillez remplir tous les champs');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showAlert('error', 'Veuillez entrer une adresse email valide');
                return;
            }
            
            // Désactiver le bouton et afficher un loader
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bx bx-loader-circle bx-spin me-2"></i>Connexion en cours...';

            const formData = new FormData(this);

            fetch('api/login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Succès
                    showAlert('success', 'Connexion réussie! Redirection...');
                    setTimeout(() => {
                        window.location.href = data.redirect;
                    }, 1000);

                } else {
                    const msg = data.error || data.message || 'Une erreur est survenu'
                    showAlert('error', msg);
                    
                    // Réactiver le bouton
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de la connexion',
                    confirmButtonColor: '#3d6dff'
                });
                
                // Réactiver le bouton
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
            
        });
    </script>
</body>
</html>
