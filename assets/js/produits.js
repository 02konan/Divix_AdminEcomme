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
    
    const floatPag = document.getElementById("floatPag");
    if (floatPag) {
        floatPag.style.display = 'none';
    }
});

const toastEl = document.getElementById('loginToast');

let allProduits = [];
let currentPage = 1;
const itemsPerPage = 16;

function showAlert(type, message) {
    if (!toastEl) return;

    const toastBody = toastEl.querySelector('.toast-body');
    toastEl.className = 'toast align-items-center bg-white text-dark';
    const iconClass = type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-danger';
    toastBody.innerHTML = `<i class="bi ${iconClass} me-2"></i>${message}`;

    const toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl);
    toastInstance.show();
}

const inputStock = document.getElementById("produitStock");
const inputSeuil = document.getElementById("produitStockMin");

if (inputStock && inputSeuil) {
    verifyStock(inputStock.value, inputSeuil.value, "produitStatut");

    inputStock.addEventListener('input', () => {
        verifyStock(inputStock.value, inputSeuil.value, "produitStatut");
    });

    inputSeuil.addEventListener('input', () => {
        verifyStock(inputStock.value, inputSeuil.value, "produitStatut");
    });
}

function verifyStock(stock, seuil, selectID) {
    stock = Number(stock) || 0;
    seuil = Number(seuil) || 0;

    if (stock <= 0) {
        document.getElementById(selectID).value = "Rupture";
    } else if (stock <= seuil) {
        document.getElementById(selectID).value = "Stock faible";
    } else {
        document.getElementById(selectID).value = "En stock";
    }
}

function initProduitDatalists() {
    const categorieInput = document.getElementById('produitCategorieLabel');
    const sousCategorieInput = document.getElementById('produitSousCategorieLabel');

    if (categorieInput) {
        categorieInput.addEventListener('input', async () => {
            syncDatalistId('produitCategorieLabel', 'produitCategorieId', 'list-categorie');
            const categoryId = document.getElementById('produitCategorieId').value;
            if (categoryId) {
                clearSousCategorie();
                await loadSousCategories(categoryId);
            } else {
                clearSousCategorie();
            }
        });
        
        categorieInput.addEventListener('change', async () => {
            syncDatalistId('produitCategorieLabel', 'produitCategorieId', 'list-categorie');
            const categoryId = document.getElementById('produitCategorieId').value;
            if (categoryId) {
                clearSousCategorie();
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
    
    if (sousCategorieInput) {
        sousCategorieInput.value = '';
        sousCategorieInput.disabled = true;
        setTimeout(() => {
            if (sousCategorieInput) sousCategorieInput.disabled = false;
        }, 100);
    }
    if (sousCategorieHidden) sousCategorieHidden.value = '';
    if (listSousCategorie) {
        listSousCategorie.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Aucune sous-catégorie disponible --';
        listSousCategorie.appendChild(defaultOption);
    }
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
    const sousCategorieInput = document.getElementById('produitSousCategorieLabel');
    if (!listSousCategorie) return;

    listSousCategorie.innerHTML = '';
    if (sousCategorieInput) {
        sousCategorieInput.placeholder = 'Chargement...';
        sousCategorieInput.disabled = true;
    }

    const formData = new FormData();
    formData.append('action', 'getSousCategories');
    formData.append('categorie_id', categoryId);

    try {
        const response = await fetch('./api/produits.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success && data.sous_categories && data.sous_categories.length > 0) {
            fillDatalist(listSousCategorie, data.sous_categories || []);
            if (sousCategorieInput) {
                sousCategorieInput.placeholder = '--choisir--';
                sousCategorieInput.disabled = false;
            }
        } else {
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = '-- Aucune sous-catégorie disponible --';
            listSousCategorie.appendChild(emptyOption);
            if (sousCategorieInput) {
                sousCategorieInput.placeholder = 'Aucune sous-catégorie';
                sousCategorieInput.value = '';
                sousCategorieInput.disabled = false;
            }
        }
        
        syncDatalistId('produitSousCategorieLabel', 'produitSousCategorieId', 'list-sous-categorie');
        
    } catch (error) {
        console.error('Erreur chargement sous-catégories :', error);
        const errorOption = document.createElement('option');
        errorOption.value = '';
        errorOption.textContent = '-- Erreur de chargement --';
        listSousCategorie.appendChild(errorOption);
        if (sousCategorieInput) {
            sousCategorieInput.placeholder = 'Erreur de chargement';
            sousCategorieInput.disabled = false;
        }
    }
}

function fillDatalist(list, items) {
    if (!list) return;
    
    list.innerHTML = '';
    
    if (!items || items.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Aucune option disponible --';
        list.appendChild(emptyOption);
        return;
    }
    
    items.forEach(item => {
        const label = escapeHtml(item.nom || item.name || '');
        const id = escapeHtml(item.id || item.value || '');
        const option = document.createElement('option');
        option.value = label;
        option.dataset.id = id;
        list.appendChild(option);
    });
}

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

    fetch('./api/produits.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideCounterSkeletonProduits();
        if (data.success) {
            allProduits = data.data || [];
            currentPage = 1;
            afficheproduitsPage(currentPage);
            renderPagination();
            updateCountersProduits(data.counter);
        } else {
            const msg = data.error || data.message || 'Une erreur est survenu';
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

            const isReduct = pdt.reduction_id ? true : false;
            let pourcentage = '';
            let nouveauPrix = pdt.prix;

            if (isReduct) {
                if (pdt.reduction_type == 'pourcentage') {
                    pourcentage = pdt.reduction_valeur;
                    nouveauPrix = pdt.prix * (1 - pdt.reduction_valeur / 100);
                } else if (pdt.reduction_type == 'montant') {
                    pourcentage = ((pdt.reduction_valeur / pdt.prix) * 100).toFixed(0);
                    nouveauPrix = Math.max(0, pdt.prix - pdt.reduction_valeur);
                }
                
                // Arrondir par défaut (à l'inférieur)
                nouveauPrix = Math.floor(nouveauPrix);
            }
            
            const item = document.createElement("div");
            item.className = "col-12 col-sm-6 col-md-4 col-lg-3";
            item.innerHTML = `
                <div class="product-card">
                    ${isReduct ? '<span class="badge text-bg-danger rounded-pill px-2 py-1 reduction"> -'+parseInt(pourcentage)+'%</span>' : ''}
                    ${isReduct ? '<span class="badge text-bg-warning rounded-pill px-2 py-1 reduction prix-reduct"> '+parseInt(nouveauPrix)+' FCFA</span>' : ''}
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
    } else {
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

function afficheproduitsPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const produitsPage = allProduits.slice(startIndex, endIndex);
    afficheproduits(produitsPage);
}

function renderPagination() {
    const totalPages = Math.ceil(allProduits.length / itemsPerPage);
    const floatPag = document.getElementById("floatPag");

    if (!floatPag) return;

    if (totalPages <= 1) {
        floatPag.style.display = 'none';
        return;
    }

    floatPag.style.display = 'flex';

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

    const pgNums = document.getElementById("pgNums");
    if (!pgNums) return;

    let numsHTML = '';

    const maxButtons = 4;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage ? 'active' : '';
        numsHTML += `<button class="pg-btn ${isActive}" onclick="changePage(${i})">${i}</button>`;
    }

    pgNums.innerHTML = numsHTML;
}

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
    const editProduitBtn = document.getElementById('editProduitBtn');
    const statutClassProduit = produit.statut === 'En stock' ? 'active' : produit.statut === 'St. faible' ? 'pending' : 'disabled';
    const images = Array.isArray(data.images) ? data.images : [];
    const titleEl = document.getElementById('offcanvasRightLabel');
    const badgeEl = document.getElementById('offcanvasDetailsStatusBadge');
    const bodyEl = document.getElementById('offcanvasDetailsBody');

    if (editProduitBtn) {
        editProduitBtn.dataset.editId = produit.id;
        const newEditBtn = editProduitBtn.cloneNode(true);
        editProduitBtn.parentNode.replaceChild(newEditBtn, editProduitBtn);
        newEditBtn.addEventListener('click', () => {
            populateModalForEdit(produit);
        });
    }

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
                    <img src="${imageSrc}" class="d-block w-100" style="aspect-ratio: 1 / 1; object-fit: cover;">
                </div>
            </div>`;
    }).join('') : `
            <div class="carousel-item active">
                <img src="./uploads/produits/default_1.png" class="d-block w-100" style="aspect-ratio: 1 / 1; object-fit: cover;">
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
            <hr class="m-0">
            <form id="form_reduction">
                <div class="d-flex w-100 align-items-center justify-content-between mb-3">
                    <p class="text-muted small m-0">Réduction</p>
                    <div>
                        <button type="button" class="btn btn-sm btn-danger d-block" data-id="${produit.id}" id="annule_reduction" >Annuler reduction</button>
                    </div>
                </div>
                <input type="hidden" name="produit_reduction_id" id="produit_reduction_id" value="${produit.id}">
                <div class="d-flex gap-2">
                    <div class="col mb-3">
                        <label for="" class="form-label">Type <span class="small text-danger">*</span></label>
                        <select name="type_reduction" id="type_reduction" class="form-select" required>
                            <option value="" selected disabled>--Type--</option>
                            <option value="pourcentage">Pourcentage</option>
                            <option value="montant">Montant</option>
                        </select>
                    </div>
                    <div class="col mb-3">
                        <label for="" class="form-label">Valeur <span class="small text-danger">*</span></label>
                        <input type="number" class="form-control" id="valeur_reduction" placeholder="" name="valeur_reduction" autocomplete="off" required>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <div class="col mb-3">
                        <div class="form-check form-switch mt-2">
                            <input class="form-check-input" type="checkbox" role="switch" name="active_reduction" id="active_reduction" checked>
                            <label class="form-check-label" for="active_reduction">Active</label>
                        </div>
                    </div>
                    <div>
                        <button type="submit" class="btn btn-sm btn-primary d-block" id="submit_reduction" >Reduire</button>
                    </div>
                </div>
            </form>
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

    let formReduction = document.getElementById('form_reduction');

    if (formReduction) {
        formReduction.addEventListener('submit', (e) => {
            e.preventDefault()

            const button = document.getElementById('submit_reduction');
            
            // Désactiver le bouton et montrer le loading
            button.disabled = true;
            button.innerHTML = '<span class="spinner"></span><span>Reduction...</span>';

            const formData = new FormData(formReduction);

            // 🔧 Gérer le checkbox : 1 si coché, 0 sinon
            const activeCheckbox = formReduction.querySelector('#active_reduction');
            let activeValue = activeCheckbox && activeCheckbox.checked ? '1' : '0';
            
            formData.append('action', 'addReduction');
            formData.append('active', activeValue);

            fetch('./api/reduction.php', {
                method: 'POST',
                body: formData
            }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('success', 'Réduction activée');
                    button.disabled = false;
                    button.innerHTML = '<span>Reduire</span>';
                    Produits()
                } else {
                    showAlert('error', data.message || 'Erreur lors de la mise à jour.');
                    button.disabled = false;
                    button.innerHTML = '<span>Reduire</span>';
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                showAlert('error', 'Erreur lors de la mise à jour du statut.');
                button.disabled = false;
                button.innerHTML = '<span>Reduire</span>';
            })

        })

        const annule_reduction = document.getElementById('annule_reduction')
        annule_reduction.addEventListener('click', ()=>{
            let id = annule_reduction.dataset.id

            Swal.fire({
                title: "Êtes vous sur?",
                text: "Voulez-vous annuler la reduction du produit!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "oui",
                confirmCancelText: "Non"
                }).then((result) => {
                    if (result.isConfirmed) { 
                        const formData = new FormData();
                        
                        formData.append('id', id);
                        formData.append('action', 'annuleReduction');

                        fetch('./api/reduction.php', {
                            method: 'POST',
                            body: formData
                        }).then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                showAlert('success', data.message || 'opération bien éffectuée');
                                Produits()
                            } else {
                                showAlert('error', data.message || 'Erreur lors de la mise à jour.');
                            }
                        })
                        .catch(error => {
                            console.error('Erreur:', error);
                            showAlert('error', 'Erreur lors de la mise à jour des reductions.');
                        })
                    }
                });
        })
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

async function loadExistingImages(produitId) {
    const container = document.getElementById('existingImagesContainer');
    if (!container) return;
    
    try {
        const formData = new FormData();
        formData.append('action', 'getProduitImages');
        formData.append('produit_id', produitId);
        
        const response = await fetch('./api/produits.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success && data.images && data.images.length > 0) {
            container.innerHTML = data.images.map(image => {
                const imageSrc = /^https?:\/\//i.test(image.url_image) 
                    ? image.url_image 
                    : `./uploads/produits/${image.url_image}`;
                
                return `
                    <div class="col-md-3 col-sm-4 col-6 position-relative mb-2" data-image-id="${image.id}">
                        <div class="card h-100">
                            <img src="${imageSrc}" class="card-img-top" style="aspect-ratio: 1 / 1; object-fit: cover;" alt="Image produit">
                            <div class="card-body p-2 text-center">
                                <small class="text-muted">${image.est_principale == 1 ? '⭐ Principale' : ''}</small>
                            </div>
                            <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 delete-existing-image" 
                                    data-image-id="${image.id}" data-produit-id="${produitId}" 
                                    data-image-url="${image.url_image}" title="Supprimer">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            document.querySelectorAll('.delete-existing-image').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const imageId = btn.dataset.imageId;
                    const produitId = btn.dataset.produitId;
                    
                    if (confirm('Voulez-vous vraiment supprimer cette image ?')) {
                        const deleted = await supprimerProduitImage(imageId);
                        if (deleted) {
                            await loadExistingImages(produitId);
                            const details = await fetchProduitDetails(produitId);
                            if (details) {
                                populateOffcanvasDetails(details);
                            }
                        }
                    }
                });
            });
        } else {
            container.innerHTML = '<div class="col-12 text-muted">Aucune image pour ce produit.</div>';
        }
    } catch (error) {
        console.error('Erreur chargement images:', error);
        container.innerHTML = '<div class="col-12 text-danger">Erreur lors du chargement des images.</div>';
    }
}

async function populateModalForEdit(produit) {
    document.getElementById('exampleModalLabel').textContent = 'Modifier le produit';
    document.getElementById('subExampleModalLabel').textContent = 'Formulaire de modification de produit';
    document.getElementById('produit_edit_id').value = produit.id;
    document.getElementById('produitNom').value = produit.nom;
    document.getElementById('produitCategorieId').value = produit.categorie_id;
    document.getElementById('produitCategorieLabel').value = produit.categorie;
    document.getElementById('produitSousCategorieId').value = produit.id_sous_categorie;
    document.getElementById('produitSousCategorieLabel').value = produit.sous_categorie;
    document.getElementById('produitDescLabel').value = produit.description.replace(/<br\s*\/?>\n?/gi, '\n');
    document.getElementById('produitPrixAchat').value = produit.prix;
    document.getElementById('produitStock').value = produit.stock;
    document.getElementById('produitStockMin').value = produit.seuil;
    
    if (produit.categorie_id) {
        loadSousCategories(produit.categorie_id).then(() => {
            document.getElementById('produitSousCategorieLabel').value = produit.sous_categorie;
            document.getElementById('produitSousCategorieId').value = produit.id_sous_categorie;
        });
    }
    
    // Charger les caractéristiques existantes
    await loadExistingCaracteristiques(produit.id);
    
    const imagesManagementSection = document.getElementById('imagesManagementSection');
    if (imagesManagementSection) {
        imagesManagementSection.style.display = 'block';
    }
    
    const originalImageFieldset = document.querySelector('#produitImages, #produitImageUrls').closest('fieldset');
    if (originalImageFieldset) {
        originalImageFieldset.style.display = 'none';
    }
    
    loadExistingImages(produit.id);
    
    const inputStockLocal = document.getElementById("produitStock");
    const inputSeuilLocal = document.getElementById("produitStockMin");
    verifyStock(inputStockLocal.value, inputSeuilLocal.value, "produitStatut");
}

// Nouvelle fonction pour charger les caractéristiques existantes avec spinner
async function loadExistingCaracteristiques(produitId) {
    const formSection = document.querySelector('.form-section');
    const buttonContainer = document.getElementById('addCarac').parentElement;
    
    // Sauvegarder le contenu actuel
    const existingCards = formSection.querySelectorAll('.diploma-card');
    const existingCardsHTML = Array.from(existingCards).map(card => card.outerHTML).join('');
    
    // Afficher un spinner de chargement
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'caracteristiques-loading';
    loadingSpinner.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
            </div>
            <p class="text-muted small mt-2 mb-0">Chargement des caractéristiques...</p>
        </div>
    `;
    
    // Supprimer les cartes existantes et ajouter le spinner
    existingCards.forEach(card => card.remove());
    formSection.insertBefore(loadingSpinner, buttonContainer);
    
    try {
        const formData = new FormData();
        formData.append('action', 'getProduitCaracteristiques');
        formData.append('produit_id', produitId);
        
        const response = await fetch('./api/produits.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        // Supprimer le spinner
        if (loadingSpinner && loadingSpinner.parentNode) {
            loadingSpinner.remove();
        }
        
        if (data.success && data.caracteristiques && data.caracteristiques.length > 0) {
            // Reconstruire les caractéristiques existantes
            data.caracteristiques.forEach(carac => {
                const newDiploma = document.createElement("div");
                newDiploma.className = "diploma-card";
                newDiploma.innerHTML = `
                    <div class="diploma-header mt-3 d-flex w-100 justify-content-between">
                        <p class="text-muted m-0 mb-2">Caractéristique</p>
                        <button type="button" class="btn btn-sm btn-outline-danger remove-diploma" style="height: fit-content !important;">
                            <i class="bx bx-minus"></i>
                        </button>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">Titre <span class="small text-danger">*</span></label>
                            <input type="text" class="form-control" name="titre_caract[]" placeholder="Ex: Couleur" value="${escapeHtml(carac.titre)}" required>
                        </div>
                        <div class="col-md-9">
                            <label class="form-label">Valeur <span class="small text-danger">*</span></label>
                            <input type="text" class="form-control" name="valeur_caract[]" placeholder="Ex: Blanc, Jaune, Vert" value="${escapeHtml(carac.valeur)}" required>
                        </div>
                    </div>
                `;
                
                // Insérer avant le conteneur du bouton
                formSection.insertBefore(newDiploma, buttonContainer);
            });
            
            attachRemoveDiplomaEvents();
        } else if (data.success && (!data.caracteristiques || data.caracteristiques.length === 0)) {
            // Aucune caractéristique, afficher un message optionnel
            const noDataMsg = document.createElement('div');
            noDataMsg.className = 'text-muted small text-center py-2 no-caracteristiques';
            noDataMsg.innerHTML = '<i class="bx bx-info-circle"></i> Aucune caractéristique pour ce produit';
            formSection.insertBefore(noDataMsg, buttonContainer);
            
            // Supprimer le message après 3 secondes
            setTimeout(() => {
                if (noDataMsg && noDataMsg.parentNode) {
                    noDataMsg.remove();
                }
            }, 3000);
        }
    } catch (error) {
        console.error('Erreur chargement caractéristiques:', error);
        // Supprimer le spinner en cas d'erreur
        if (loadingSpinner && loadingSpinner.parentNode) {
            loadingSpinner.remove();
        }
        
        // Afficher un message d'erreur
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-danger alert-sm py-2 my-2';
        errorMsg.innerHTML = '<i class="bx bx-error-circle"></i> Erreur lors du chargement des caractéristiques';
        formSection.insertBefore(errorMsg, buttonContainer);
        
        setTimeout(() => {
            if (errorMsg && errorMsg.parentNode) {
                errorMsg.remove();
            }
        }, 3000);
    }
}
function resetModalForm() {
    const produitForm = document.getElementById('produitForm');
    if (produitForm) {
        produitForm.reset();
    }
    
    document.getElementById('exampleModalLabel').textContent = 'Nouveau Produit';
    document.getElementById('subExampleModalLabel').textContent = "Formulaire d'ajout de produit";
    document.getElementById('produit_edit_id').value = '';
    
    clearSousCategorie();
    const categorieId = document.getElementById('produitCategorieId');
    const sousCategorieId = document.getElementById('produitSousCategorieId');
    if (categorieId) categorieId.value = '';
    if (sousCategorieId) sousCategorieId.value = '';
    
    const categorieInput = document.getElementById('produitCategorieLabel');
    if (categorieInput) {
        categorieInput.placeholder = '--choisir--';
    }
    
    const newImages = document.getElementById('produitImagesNew');
    if (newImages) newImages.value = '';
    const newImageUrls = document.getElementById('produitImageUrlsNew');
    if (newImageUrls) newImageUrls.value = '';
    
    const existingContainer = document.getElementById('existingImagesContainer');
    if (existingContainer) existingContainer.innerHTML = '';
    
    const originalImageFieldset = document.querySelector('#produitImages, #produitImageUrls').closest('fieldset');
    if (originalImageFieldset) {
        originalImageFieldset.style.display = 'block';
    }
    
    const imagesManagementSection = document.getElementById('imagesManagementSection');
    if (imagesManagementSection) {
        imagesManagementSection.style.display = 'none';
    }
    
    // Supprimer toutes les cartes de caractéristiques
    const formSection = document.querySelector('.form-section');
    const existingCards = formSection.querySelectorAll('.diploma-card');
    existingCards.forEach(card => card.remove());
}

function initProduitAdd() {
    const produitForm = document.getElementById('produitForm');
    const addProduitBtn = document.getElementById('submitProduitBtn');

    if (!produitForm || !addProduitBtn) return;

    const modal = document.getElementById('exampleModal');
    if (modal) {
        modal.addEventListener('hidden.bs.modal', () => {
            resetModalForm();
        });
        
        modal.addEventListener('show.bs.modal', () => {
            const editId = document.getElementById('produit_edit_id').value;
            if (!editId) {
                const imagesManagementSection = document.getElementById('imagesManagementSection');
                if (imagesManagementSection) {
                    imagesManagementSection.style.display = 'none';
                }
                const originalImageFieldset = document.querySelector('#produitImages, #produitImageUrls').closest('fieldset');
                if (originalImageFieldset) {
                    originalImageFieldset.style.display = 'block';
                }
            }
        });
    }

    addProduitBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!produitForm.reportValidity()) {
            return;
        }

        const editId = document.getElementById('produit_edit_id').value;
        const isEdit = editId && editId !== '';
        
        const action = isEdit ? 'updateProduit' : 'addProduit';

        const originalText = addProduitBtn.innerHTML;
        addProduitBtn.disabled = true;
        addProduitBtn.innerHTML = '<i class="bx bx-loader-circle bx-spin me-2"></i>Enregistrement...';

        // Avant d'envoyer le formulaire, vérifiez les caractéristiques
        const titresCaract = document.querySelectorAll('input[name="titre_caract[]"]');
        const valeursCaract = document.querySelectorAll('input[name="valeur_caract[]"]');
        console.log('Nombre de caractéristiques:', titresCaract.length);
        for(let i = 0; i < titresCaract.length; i++) {
            console.log(`Caract ${i+1}:`, titresCaract[i].value, '-', valeursCaract[i].value);
        }

        try {
            const formData = new FormData(produitForm);
            formData.append('action', action);
            
            const newImages = document.getElementById('produitImagesNew');
            if (newImages && newImages.files.length > 0) {
                for (let i = 0; i < newImages.files.length; i++) {
                    formData.append('new_images[]', newImages.files[i]);
                }
            }
            
            const newImageUrls = document.getElementById('produitImageUrlsNew');
            if (newImageUrls && newImageUrls.value.trim()) {
                formData.append('new_image_urls', newImageUrls.value);
            }

            const response = await fetch('./api/produits.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: data.message || (isEdit ? 'Produit modifié avec succès.' : 'Produit ajouté avec succès.'),
                    confirmButtonColor: '#3d6dff',
                    timer: 1200
                }).then(() => {
                    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                    if (modalInstance) modalInstance.hide();

                    produitForm.reset();
                    resetModalForm();
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
                    event.target.checked = !isActive;
                }
            } catch (error) {
                console.error('Erreur:', error);
                showAlert('error', 'Erreur lors de la mise à jour du statut.');
                event.target.checked = !isActive;
            }
        }
    });
}


// Fonction pour attacher l'événement de suppression à tous les boutons trash
function attachRemoveDiplomaEvents() {
    document.querySelectorAll(".remove-diploma").forEach((btn) => {
        btn.addEventListener("click", function () {
        // Remonte jusqu'à la carte diplôme la plus proche et la supprime
        const card = this.closest(".diploma-card")
        if (card) card.remove()
        })
    })
}

const addCaracBtn = document.getElementById("addCarac")
if (addCaracBtn) {
      addCaracBtn.addEventListener("click", () => {
        // Trouver la section des diplômes en remontant depuis le bouton
        const diplomaSection = addCaracBtn.closest('.form-section')
        
        const newDiploma = document.createElement("div")
        newDiploma.className = "diploma-card"
        newDiploma.innerHTML = `
          <div class="diploma-header mt-3 d-flex w-100 justify-content-between">
            <p class="text-muted m-0 mb-2">Caractéristique</p>
            <button type="button" class="btn btn-sm btn-outline-danger remove-diploma" style="height: fit-content !important;">
              <i class="bx bx-minus"></i>
            </button>
          </div>
          <div class="row g-3">
            <div class="col-md-3">
                <label class="form-label">Titre <span class="small text-danger">*</span></label>
                <input type="text" class="form-control" name="titre_caract[]" placeholder="Ex: Couleur" required>
            </div>
            <div class="col-md-9">
                <label class="form-label">Valeur <span class="small text-danger">*</span></label>
                <input type="text" class="form-control" name="valeur_caract[]" placeholder="Ex: Blanc, Jaune, Vert" required>
            </div>
          </div>
        `
        
        // Insérer avant le conteneur du bouton (div.mt-3)
        const buttonContainer = addCaracBtn.parentElement
        diplomaSection.insertBefore(newDiploma, buttonContainer)
        
        attachRemoveDiplomaEvents()
      })
    }