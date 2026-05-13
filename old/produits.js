document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("result-products")) {
        Produits();
    }
    if (document.getElementById('produitCategorieLabel')) {
        initProduitDatalists();
    }
    initProduitAdd();
    initProduitStatusSwitches();
    initProduitDetailsOffcanvas();
    initOffcanvasImageDeletion();
    
    // Cacher la pagination flottante au départ
    const floatPag = document.getElementById("floatPag");
    if (floatPag) {
        floatPag.style.display = 'none';
    }
});
const toastEl = document.getElementById('loginToast');

// Variables globales pour la pagination
let allProduits = [];
let currentPage = 1;
const itemsPerPage = 16; // Nombre de produits par page

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

// STATUT FORMULAIRE

const inputStock = document.getElementById("produitStock")
const inputSeuil = document.getElementById("produitStockMin")
if (inputStock) {
    inputStock.addEventListener('input', () => {
        verifyStock(inputStock.value, inputSeuil.value, "produitStatut")
    })
    
}
if (inputSeuil) {
    inputSeuil.addEventListener('input', () => {
        verifyStock(inputStock.value, inputSeuil.value, "produitStatut")
    })
}

function verifyStock(stock, seuil, selectID) {
    stock = Number(stock) || 0  // ✅ conversion en nombre
    seuil = Number(seuil) || 0  // ✅ corrigé

    if (stock <= 0) {
        document.getElementById(selectID).value = "Rupture";
    } else if (stock <= seuil) {
        document.getElementById(selectID).value = "Stock faible";
    } else {
        document.getElementById(selectID).value = "En stock";
    }
}

// Fonction pour initialiser les datalists de produits

function initProduitDatalists() {
    const categorieInput = document.getElementById('produitCategorieLabel');
    const sousCategorieInput = document.getElementById('produitSousCategorieLabel');

    if (categorieInput) {
        categorieInput.addEventListener('input', async () => {
            syncDatalistId('produitCategorieLabel', 'produitCategorieId', 'list-categorie');
            const categoryId = document.getElementById('produitCategorieId').value;
            if (categoryId) {
                await loadSousCategories(categoryId);
            } else {
                clearSousCategorie();
            }
        });
    }

    if (sousCategorieInput) {
        sousCategorieInput.addEventListener('input', () => {
            syncDatalistId('produitSousCategorieLabel', 'produitSousCategorieId', 'list-sous-categorie');
        });
    }

    loadProduitCategories();
}

function syncDatalistId(inputId, hiddenId, listId) {
    const input = document.getElementById(inputId);
    const hidden = document.getElementById(hiddenId);
    const list = document.getElementById(listId);
    if (!input || !hidden || !list) return;

    hidden.value = '';
    const value = input.value.trim();
    if (!value) {
        if (hiddenId === 'produitCategorieId') {
            clearSousCategorie();
        }
        return;
    }

    const option = Array.from(list.options).find(opt => opt.value === value);
    if (option && option.dataset.id) {
        hidden.value = option.dataset.id;
    }
}

function clearSousCategorie() {
    const sousCategorieInput = document.getElementById('produitSousCategorieLabel');
    const sousCategorieHidden = document.getElementById('produitSousCategorieId');
    const listSousCategorie = document.getElementById('list-sous-categorie');
    if (sousCategorieInput) sousCategorieInput.value = '';
    if (sousCategorieHidden) sousCategorieHidden.value = '';
    if (listSousCategorie) listSousCategorie.innerHTML = '';
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function loadProduitCategories() {
    const listCategorie = document.getElementById('list-categorie');
    if (!listCategorie) return;

    const formData = new FormData();
    formData.append('action', 'getProduitOptions');

    try {
        const response = await fetch('./api/produits.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            fillDatalist(listCategorie, data.categories || []);
            syncDatalistId('produitCategorieLabel', 'produitCategorieId', 'list-categorie');

            const categoryId = document.getElementById('produitCategorieId').value;
            if (categoryId) {
                await loadSousCategories(categoryId);
            } else {
                clearSousCategorie();
            }
        }
    } catch (error) {
        console.error('Erreur chargement catégories :', error);
    }
}

async function loadSousCategories(categoryId) {
    const listSousCategorie = document.getElementById('list-sous-categorie');
    if (!listSousCategorie) return;

    listSousCategorie.innerHTML = '';

    const formData = new FormData();
    formData.append('action', 'getSousCategories');
    formData.append('categorie_id', categoryId);

    try {
        const response = await fetch('./api/produits.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            fillDatalist(listSousCategorie, data.sous_categories || []);
            syncDatalistId('produitSousCategorieLabel', 'produitSousCategorieId', 'list-sous-categorie');
        }
    } catch (error) {
        console.error('Erreur chargement sous-catégories :', error);
    }
}

function fillDatalist(list, items) {
    list.innerHTML = items.map(item => {
        const label = escapeHtml(item.nom || item.name || '');
        const id = escapeHtml(item.id || item.value || '');
        return `<option value="${label}" data-id="${id}"></option>`;
    }).join('');
}

// Fonction pour afficher le spinner dots
function showDotsSpinner(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5 nothing">
                <div class="d-flex flex-column align-items-center justify-content-center">
                    <div class="dots-loader mb-1">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p class="text-muted small m-0 mt-2">Chargement des données...</p>
                </div>
            </div>
        `;
    }
}

// Version avec skeleton
function showCounterSkeletonProduits() {
    const counters = ["counterstock_faible", "counteren_rupture", "countertotal_produits"];
    counters.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.textContent) {
            el.classList.add('counter-skeleton');
        }
    });
}

function hideCounterSkeletonProduits() {
    const counters = ["counterstock_faible", "counteren_rupture", "countertotal_produits"];
    counters.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('counter-skeleton');
        }
    });
}

function Produits() {
    showDotsSpinner("result-products");
    showCounterSkeletonProduits();

    const formData = new FormData();
    formData.append('action', 'getProduits');
    // Supprimé le paramètre page pour charger tous les produits

    fetch('./api/produits.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideCounterSkeletonProduits();
        if (data.success) {
            allProduits = data.data || []; // Stocker tous les produits
            currentPage = 1; // Réinitialiser à la première page
            afficheproduitsPage(currentPage); // Afficher la première page
            renderPagination(); // Générer les contrôles de pagination
            
            updateCountersProduits(data.counter);
           
        } else {
            const msg = data.error || data.message || 'Une erreur est survenu'
            showAlert('error', msg);
        }
    })
    .catch(error => {
        hideCounterSkeletonProduits();
        console.error('Erreur:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error,
            confirmButtonColor: '#3d6dff'
        });
        
    });
}

function afficheproduits(produits) {
    const container = document.getElementById("result-products");
    if (!container) return;
    container.innerHTML = "";
    
    if(produits && produits.length > 0){
        produits.forEach(pdt => {
            const titreProduit = pdt.nom.length > 14 ? pdt.nom.substring(0, 14) + "..." : pdt.nom;
            const imageSrc = pdt.url_image
                ? (/^https?:\/\//i.test(pdt.url_image) ? pdt.url_image : `./uploads/produits/${pdt.url_image}`)
                : "./uploads/produits/default_1.png";
            const statutClass = pdt.statut === 'En stock' ? 'active' : pdt.statut === 'St. faible' ? 'pending' : 'disabled';
            const statutText = pdt.statut;
            
            const item = document.createElement("div");
            item.className = "col-12 col-sm-6 col-md-4 col-lg-3";
            item.innerHTML = `
                <div class="product-card">
                    <div class="like" data-product-id="${pdt.id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetails" aria-controls="offcanvasRight">
                        <i class='bx bx-dots-vertical-rounded'></i>
                    </div>
                    <img src="${imageSrc}" class="product-img">
                    <div class="product-body">
                        <div class="d-flex">
                            <div class="col-8">
                                <div class="product-title">${titreProduit}</div>
                                <p class="small product-desc text-muted m-0">${(() => {
                                    const cat = pdt.categorie || '-';
                                    const fullText = cat + (pdt.sous_categorie ? ' | ' + pdt.sous_categorie : '');
                                    return fullText.length > 25 ? fullText.substring(0, 25) + '...' : fullText;
                                })()}</p>
                            </div>
                            <div class="col-4 d-flex flex-column">
                                <span class="status-badge ${statutClass} ms-auto">${statutText}</span>
                            </div>
                        </div>
                        <div class="count me-auto d-flex gap-2 rounded-pill align-items-center">
                            <div class="btn-count d-none"><i class="bi bi-dash"></i></div>
                            <input type="number" class="mx-2" value="${pdt.stock}" readonly="readonly">
                            <div class="btn-count d-none"><i class="bi bi-plus"></i></div>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="form-check form-switch mt-auto">
                                <input class="form-check-input" type="checkbox" role="switch" id="switchCheckChecked${pdt.id}" data-id="${pdt.id}" ${pdt.active === 1 ? 'checked' : ''}>
                                <label class="form-check-label" for="switchCheckChecked${pdt.id}">Active</label>
                            </div>
                            <div class="d-flex gap-1 align-items-center">
                                <i class='bx bx-currency-note me-1'></i><span class="small text-muted">${pdt.prix} FCFA</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    }else{
        container.innerHTML = `
            <div class="col-12 text-center py-5 nothing">
                <div class="text-center">
                    <i class="bi bi-inbox fs-1 text-muted"></i>
                    <p class="text-muted mt-2 mb-0">Aucun produit trouvé</p>
                </div>
            </div>
        `;
    }

}

// Fonction pour afficher une page spécifique
function afficheproduitsPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const produitsPage = allProduits.slice(startIndex, endIndex);
    afficheproduits(produitsPage);
}

// Fonction pour générer les contrôles de pagination
function renderPagination() {
    const totalPages = Math.ceil(allProduits.length / itemsPerPage);
    const floatPag = document.getElementById("floatPag");

    if (!floatPag) return;

    // Cacher la pagination si une seule page
    if (totalPages <= 1) {
        floatPag.style.display = 'none';
        return;
    }

    floatPag.style.display = 'flex';

    // Mettre à jour les boutons précédent/suivant
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    if (btnPrev) {
        btnPrev.disabled = currentPage === 1;
        btnPrev.onclick = () => changePage(currentPage - 1);
    }

    if (btnNext) {
        btnNext.disabled = currentPage === totalPages;
        btnNext.onclick = () => changePage(currentPage + 1);
    }

    // Mettre à jour les numéros de page
    const pgNums = document.getElementById("pgNums");
    if (!pgNums) return;

    let numsHTML = '';

    // Calculer la plage de pages à afficher (max 4 boutons)
    const maxButtons = 4;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Ajuster si on est près du début
    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage ? 'active' : '';
        numsHTML += `<button class="pg-btn ${isActive}" onclick="changePage(${i})">${i}</button>`;
    }

    pgNums.innerHTML = numsHTML;
}

// Fonction pour changer de page
function changePage(page) {
    if (page < 1 || page > Math.ceil(allProduits.length / itemsPerPage)) return;
    currentPage = page;
    afficheproduitsPage(currentPage);
    renderPagination();
}

function initProduitDetailsOffcanvas() {
    const productsContainer = document.getElementById('result-products');
    if (!productsContainer) return;

    productsContainer.addEventListener('click', async (event) => {
        const likeButton = event.target.closest('.like');
        if (!likeButton) return;

        const produitId = likeButton.dataset.productId;
        if (!produitId) return;

        showOffcanvasLoading();

        const details = await fetchProduitDetails(produitId);
        if (details) {
            populateOffcanvasDetails(details);
        }
    });
}

async function fetchProduitDetails(produitId) {
    try {
        const formData = new FormData();
        formData.append('action', 'getProduitDetails');
        formData.append('produit_id', produitId);

        const response = await fetch('./api/produits.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            return data.data;
        }

        showAlert('error', data.message || 'Impossible de charger les détails du produit.');
        return null;
    } catch (error) {
        console.error('Erreur fetchProduitDetails:', error);
        showAlert('error', 'Erreur serveur lors du chargement des détails.');
        return null;
    }
}

function showOffcanvasLoading() {
    const titleEl = document.getElementById('offcanvasRightLabel');
    const bodyEl = document.getElementById('offcanvasDetailsBody');
    if (titleEl) {
        titleEl.textContent = 'Chargement...';
    }
    if (!bodyEl) return;
    bodyEl.innerHTML = `
        <div class="d-flex flex-column align-items-center justify-content-center text-center p-5">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Chargement...</span>
            </div>
            <p class="text-muted small mb-0">Chargement des détails du produit...</p>
        </div>
    `;
}

function initOffcanvasImageDeletion() {
    document.addEventListener('click', async (event) => {
        const deleteBtn = event.target.closest('.delete-image-btn');
        if (!deleteBtn) return;

        event.preventDefault();
        const imageId = deleteBtn.dataset.imageId;
        const produitId = deleteBtn.dataset.produitId;
        if (!imageId || !produitId) return;

        if (!confirm('Voulez-vous vraiment supprimer cette image ?')) {
            return;
        }

        const deleted = await supprimerProduitImage(imageId);
        if (deleted) {
            const details = await fetchProduitDetails(produitId);
            if (details) {
                populateOffcanvasDetails(details);
            }
        }
    });
}

async function supprimerProduitImage(imageId) {
    try {
        const formData = new FormData();
        formData.append('action', 'deleteProduitImage');
        formData.append('image_id', imageId);

        const response = await fetch('./api/produits.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            showAlert('success', data.message || 'Image supprimée.');
            return true;
        }

        showAlert('error', data.message || 'Impossible de supprimer l\'image.');
        return false;
    } catch (error) {
        console.error('Erreur supprimerProduitImage:', error);
        showAlert('error', 'Erreur serveur lors de la suppression.');
        return false;
    }
}

function populateOffcanvasDetails(data) {
    const produit = data.produit;
    const statutClassProduit = produit.statut === 'En stock' ? 'active' : produit.statut === 'St. faible' ? 'pending' : 'disabled';
    const images = Array.isArray(data.images) ? data.images : [];
    const titleEl = document.getElementById('offcanvasRightLabel');
    const badgeEl = document.getElementById('offcanvasDetailsStatusBadge');
    const bodyEl = document.getElementById('offcanvasDetailsBody');

    if (titleEl) {
        titleEl.textContent = produit.code || 'Détails du produit';
    }

    if (badgeEl) {
        badgeEl.textContent = produit.active == 1 ? 'Actif' : 'Inactif';
        badgeEl.className = `status-badge ${produit.active == 1 ? 'active' : 'disabled'}`;
    }

    if (!bodyEl) return;

    const carouselItems = images.length > 0 ? images.map((image, index) => {
        const imageSrc = /^https?:\/\//i.test(image.url_image) ? image.url_image : `./uploads/produits/${image.url_image}`;
        return `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <div class="position-relative">
                    <img src="${imageSrc}" class="d-block w-100" style="height: 240px; object-fit: cover;">
                </div>
            </div>`;
    }).join('') : `
            <div class="carousel-item active">
                <img src="./uploads/produits/default_1.png" class="d-block w-100" style="height: 240px; object-fit: cover;">
            </div>`;

    const indicators = images.length > 1 ? `<div class="carousel-indicators">
        ${images.map((image, index) => `<button type="button" data-bs-target="#offcanvasDetailsCarousel" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="${index === 0 ? 'true' : 'false'}" aria-label="Slide ${index + 1}"></button>`).join('')}
    </div>` : '';

    const controls = images.length > 1 ? `
        <button class="carousel-control-prev" type="button" data-bs-target="#offcanvasDetailsCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Précédent</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#offcanvasDetailsCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Suivant</span>
        </button>` : '';

    bodyEl.innerHTML = `
        <div id="offcanvasDetailsCarousel" class="carousel slide" data-bs-ride="carousel">
            ${indicators}
            <div class="carousel-inner">
                ${carouselItems}
            </div>
            ${controls}
        </div>
        <div class="p-3 d-flex flex-column gap-3">
            <div class="d-flex justify-content-between">
                <div>
                    <p class="text-muted small m-0">Nom</p>
                    <p class="m-0 fw-semibold">${escapeHtml(produit.nom || '')}</p>
                </div>
                <div class="text-end col-4">
                    <p class="text-muted small m-0">Prix</p>
                    <p class="m-0 fw-semibold">${produit.prix} FCFA</p>
                </div>
            </div>
            <hr class="m-0">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <p class="text-muted small m-0">Catégorie</p>
                    <p class="m-0 fw-semibold">${escapeHtml(produit.categorie || '-')}</p>
                </div>
                <div class="text-end">
                    <p class="text-muted small m-0">Sous-catégorie</p>
                    <p class="m-0 fw-semibold">${escapeHtml(produit.sous_categorie || '-')}</p>
                </div>
            </div>
            <hr class="m-0">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <p class="text-muted small m-0">Stock</p>
                    <p class="m-0 fw-semibold">${produit.stock ?? 0}</p>
                </div>
                <div class="text-end">
                    <p class="text-muted small m-0">Seuil</p>
                    <p class="m-0 fw-semibold">${produit.seuil ?? 0}</p>
                </div>
            </div>
            <hr class="m-0">
            <div>
                <p class="text-muted small mb-1">Statut</p>
                <p class="small m-0 status-badge ${statutClassProduit}">${escapeHtml(produit.statut || '-')}</p>
            </div>
            <hr class="m-0">
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <p class="text-muted small m-0">Activé</p>
                    <div class="form-check form-switch mt-2">
                        <input class="form-check-input" type="checkbox" role="switch" id="offcanvasDetailsActiveSwitch" ${produit.active == 1 ? 'checked' : ''}>
                        <label class="form-check-label" for="offcanvasDetailsActiveSwitch">${produit.active == 1 ? 'Oui' : 'Non'}</label>
                    </div>
                </div>
                <div class="text-end">
                    <p class="text-muted small m-0">Quantité</p>
                    <p class="m-0 fw-semibold">${produit.stock ?? 0}</p>
                </div>
            </div>
        </div>
    `;

    const activeSwitch = document.getElementById('offcanvasDetailsActiveSwitch');
    if (activeSwitch) {
        activeSwitch.addEventListener('change', async (event) => {
            const checked = event.target.checked;
            try {
                const formData = new FormData();
                formData.append('action', 'updateProduitStatus');
                formData.append('produit_id', produit.id);
                formData.append('active', checked ? '1' : '0');

                const response = await fetch('./api/produits.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    showAlert('success', 'Statut du produit mis à jour.');
                    if (badgeEl) {
                        badgeEl.textContent = checked ? 'Actif' : 'Inactif';
                        badgeEl.className = `status-badge ${checked ? 'active' : 'disabled'}`;
                    }
                    event.target.nextElementSibling.textContent = checked ? 'Oui' : 'Non';
                } else {
                    showAlert('error', data.message || 'Impossible de mettre à jour.');
                    event.target.checked = !checked;
                }
            } catch (error) {
                console.error(error);
                showAlert('error', 'Erreur lors de la mise à jour.');
                event.target.checked = !checked;
            }
        });
    }
}

function animateNumber(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function updateCountersProduits(counterData) {
    if (!counterData) return;
    const data = Array.isArray(counterData) ? counterData[0] || {} : counterData;
    
    const counters = [
        { id: "countertotal_produits", value: data.total_produits },
        { id: "counteren_rupture", value: data.rupture_stock },
        { id: "counterstock_faible", value: data.stock_faible }
    ];
    
    counters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (element && counter.value !== undefined) {
            const targetValue = parseFloat(counter.value) || 0;
            animateNumber(element, 0, targetValue, 1000);
        }
    });
}

function initProduitAdd() {
    const produitForm = document.getElementById('produitForm');
    const addProduitBtn = document.getElementById('submitProduitBtn');

    if (!produitForm || !addProduitBtn) return;

    addProduitBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!produitForm.reportValidity()) {
            return;
        }

        const originalText = addProduitBtn.innerHTML;
        addProduitBtn.disabled = true;
        addProduitBtn.innerHTML = '<i class="bx bx-loader-circle bx-spin me-2"></i>Enregistrement...';

        try {
            const formData = new FormData(produitForm);
            formData.append('action', 'addProduit');

            const response = await fetch('./api/produits.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: data.message || 'Produit ajouté avec succès.',
                    confirmButtonColor: '#3d6dff',
                    timer: 1200
                }).then(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                    if (modal) modal.hide();

                    produitForm.reset();
                    clearSousCategorie();
                    const categorieId = document.getElementById('produitCategorieId');
                    const sousCategorieId = document.getElementById('produitSousCategorieId');
                    if (categorieId) categorieId.value = '';
                    if (sousCategorieId) sousCategorieId.value = '';
                    Produits();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: data.error || data.message || 'Erreur lors de l\'enregistrement',
                    confirmButtonColor: '#3d6dff'
                });
            }
        } catch (error) {
            console.error('Erreur:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de l\'envoi du formulaire',
                confirmButtonColor: '#3d6dff'
            });
        } finally {
            addProduitBtn.disabled = false;
            addProduitBtn.innerHTML = originalText;
        }
    });
}

function initProduitStatusSwitches() {
    document.addEventListener('change', async (event) => {
        if (event.target.matches('[id^="switchCheckChecked"]')) {
            const produitId = event.target.id.replace('switchCheckChecked', '');
            const isActive = event.target.checked;

            try {
                const formData = new FormData();
                formData.append('action', 'updateProduitStatus');
                formData.append('produit_id', produitId);
                formData.append('active', isActive ? '1' : '0');

                const response = await fetch('./api/produits.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    showAlert('success', 'Statut du produit mis à jour.');
                } else {
                    showAlert('error', data.error || 'Erreur lors de la mise à jour.');
                    // Remettre le switch à son état précédent
                    event.target.checked = !isActive;
                }
            } catch (error) {
                console.error('Erreur:', error);
                showAlert('error', 'Erreur lors de la mise à jour du statut.');
                // Remettre le switch à son état précédent
                event.target.checked = !isActive;
            }
        }
    });
}
