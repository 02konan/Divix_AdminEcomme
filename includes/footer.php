        </div>
    </div>
    <audio id="notificationSound" src="./bip.wav" preload="auto"></audio>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@srexi/purecounterjs/dist/purecounter_vanilla.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
    <script src="./assets/js/main.js" defer></script>
    <?php if (strpos($path, 'dashboard.php') !== false) : ?>
    <script src="./assets/js/dashboard.js" defer></script>
    <?php endif; ?>
    <?php if (strpos($path, 'clients.php') !== false) : ?>
    <script src="./assets/js/clients.js" defer></script>
    <?php endif; ?>
    <?php if (strpos($path, 'produits.php') !== false) : ?>
    <script src="./assets/js/produits.js" defer></script>
    <?php endif; ?>
    <?php if (strpos($path, 'commandes.php') !== false) : ?>
    <script src="./assets/js/commandes.js" defer></script>
    <?php endif; ?>
    <?php if (strpos($path, 'paiements.php') !== false) : ?>
    <script src="./assets/js/paiements.js" defer></script>
    <?php endif; ?>
    <?php if (strpos($path, 'bannieres.php') !== false) : ?>
    <script src="./assets/js/bannieres.js" defer></script>
    <?php endif; ?>
</body>
</html>