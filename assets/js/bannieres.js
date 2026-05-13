document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("banners-list")) {
        chargerBannieres();
    }
    initBannerForm();
    initBannerDetailsOffcanvas();
    
    // Cacher la pagination flottante au départ
    const floatPag = document.getElementById("floatPag");
    if (floatPag) {
        floatPag.style.display = 'none';
    }
});

const toastEl = document.getElementById('loginToast');

// Variables globales pour la pagination
let allBannieres = [];
let currentPage = 1;
const itemsPerPage = 12; // Nombre de bannières par page

function showAlert(type, message) {
    if (!toastEl) return;

    const toastBody = toastEl.querySelector('.toast-body');
    toastEl.className = 'toast align-items-center bg-white text-dark';
    const iconClass = type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-danger';
    toastBody.innerHTML = `<i class="bi ${iconClass} me-2"></i>${message}`;

    const toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl);
    toastInstance.show();
}

function chargerBannieres() {
    const listContainer = document.getElementById("banners-list");
    if (!listContainer) return;

    listContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="d-flex flex-column align-items-center justify-content-center">
                <div class="dots-loader mb-1">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p class="text-muted small m-0 mt-2">Chargement des bannières...</p>
            </div>
        </div>
    `;

    const formData = new FormData();
    formData.append('action', 'getBannieres');

    fetch('./api/bannieres.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            allBannieres = data.data || []; // Stocker toutes les bannières
            currentPage = 1; // Réinitialiser à la première page
            afficheBannieresPage(currentPage); // Afficher la première page
            renderPagination(); // Générer les contrôles de pagination
        } else {
            showAlert('error', data.message || 'Erreur lors du chargement');
            showBannerListError(data.message || 'Impossible de charger les bannières.');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showAlert('error', 'Erreur serveur');
        showBannerListError('Erreur serveur lors du chargement des bannières.');
    });
}
function showBannerListError(message) {
    const listContainer = document.getElementById('banners-list');
    if (!listContainer) return;

    listContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="text-center">
                <i class="bi bi-exclamation-circle-fill fs-1 text-danger"></i>
                <p class="text-muted mt-3 mb-1">${escapeHtml(message)}</p>
                <p class="small text-secondary">Vérifiez la configuration ou réessayez plus tard.</p>
            </div>
        </div>
    `;
}

function afficheBannieresPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const bannieresPage = allBannieres.slice(startIndex, endIndex);
    afficheBannieres(bannieresPage);
}

function afficheBannieres(bannieres) {
    const container = document.getElementById("banners-list");
    if (!container) return;

    container.innerHTML = "";

    if (bannieres && bannieres.length > 0) {
        bannieres.forEach(banner => {
            const typeClass = banner.type === 'banner' ? 'primary' : 
                            banner.type === 'event' ? 'info' : 
                            banner.type === 'promo' ? 'warning' : 'secondary';
            
            const typeLabel = banner.type === 'banner' ? 'Bannière' : 
                            banner.type === 'event' ? 'Événement' : 
                            banner.type === 'promo' ? 'Promotion' : 'Défilant';

            const imageSrc = banner.image 
                ? (/^https?:\/\//i.test(banner.image) ? banner.image : `./uploads/bannieres/${banner.image}`)
                : './uploads/bannieres/default.png';

            const statusBadge = banner.active === 1 
                ? '<span class="status-badge active">Actif</span>'
                : '<span class="status-badge disabled">Inactif</span>';

            const item = document.createElement("div");
            item.className = "col-12 col-md-6 col-lg-4";
            item.innerHTML = `
                <div class="card banner-card h-100 border-0 shadow-sm overflow-hidden">
                    <div class="position-relative" style="height: 180px; overflow: hidden;">
                        <img src="${imageSrc}" class="card-img-top w-100 h-100" style="object-fit: cover;" alt="${escapeHtml(banner.titre)}">
                        <div class="position-absolute top-0 start-0 m-2">
                            ${statusBadge}
                        </div>
                        <div class="like details-trigger" data-banner-id="${banner.id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetails" aria-controls="offcanvasRight">
                            <i class='bx bx-dots-vertical-rounded'></i>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column gap-2">
                        <div>
                            <h6 class="card-title fw-semibold mb-1" title="${escapeHtml(banner.titre)}">
                                ${banner.titre.length > 30 ? banner.titre.substring(0, 30) + '...' : banner.titre}
                            </h6>
                            <span class="status-badge primary mb-2">${typeLabel}</span>
                        </div>
                        <hr class="my-2">
                        <div class="d-flex gap-2">
                            <!--<div class="form-check form-switch mt-auto me-auto">
                                <input class="form-check-input" type="checkbox" role="switch" id="switchCheckChecked${banner.id}" data-id="${banner.id}" ${banner.active === 1 ? 'checked' : ''}>
                                <label class="form-check-label" for="switchCheckChecked${banner.id}">Active</label>
                            </div>-->
                            <div class="d-flex gap-1 align-items-center ms-auto">
                                <i class="bx bx-calendar-x me-1"></i><span class="small text-muted">${banner.date_fin ? new Date(banner.date_fin).toLocaleDateString('fr-FR') : "Illimité"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });

        initBannerActions();
    } else {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="text-center">
                    <i class="bi bi-images fs-1 text-muted"></i>
                    <p class="text-muted mt-2 mb-0">Aucune bannière trouvée</p>
                </div>
            </div>
        `;
    }
}

// Fonction pour générer les contrôles de pagination
function renderPagination() {
    const totalPages = Math.ceil(allBannieres.length / itemsPerPage);
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
    if (page < 1 || page > Math.ceil(allBannieres.length / itemsPerPage)) return;
    currentPage = page;
    afficheBannieresPage(currentPage);
    renderPagination();
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function initBannerForm() {
    const form = document.getElementById('bannerForm');
    const submitBtn = document.getElementById('submitBannerBtn');
    const imageInput = document.getElementById('bannerImage');
    const imagePreview = document.getElementById('bannerImagePreview');
    const typeSelect = document.getElementById('bannerType');

    // Gestion de la visibilité des champs selon le type
    if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
            updateFormFieldsVisibility(e.target.value);
        });
    }

    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.querySelector('img').src = event.target.result;
                    imagePreview.classList.remove('d-none');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (submitBtn && form) {
        submitBtn.addEventListener('click', async (event) => {
            event.preventDefault();

            // Mettre à jour la validation required selon le type avant la soumission
            const selectedType = typeSelect ? typeSelect.value : '';
            const imageInput = document.getElementById('bannerImage');
            if (imageInput) {
                imageInput.required = ['banner', 'promo', 'event'].includes(selectedType);
            }

            if (!form.reportValidity()) {
                return;
            }

            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bx bx-loader-circle bx-spin me-2"></i>Enregistrement...';

            try {
                const formData = new FormData(form);
                formData.append('action', 'addBanniere');

                const response = await fetch('./api/bannieres.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Succès',
                        text: data.message || 'Bannière ajoutée avec succès.',
                        confirmButtonColor: '#3d6dff',
                        timer: 1200
                    }).then(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('bannerModal'));
                        if (modal) modal.hide();
                        form.reset();
                        imagePreview.classList.add('d-none');
                        updateFormFieldsVisibility(''); // Réinitialiser la visibilité
                        chargerBannieres();
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
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
}

function updateFormFieldsVisibility(type) {
    const linkField = document.querySelector('.banner-link-field');
    const descriptionField = document.querySelector('.banner-description-field');
    const imageField = document.querySelector('.banner-image-field');
    const datesField = document.querySelector('.banner-dates-field');
    const imageInput = document.getElementById('bannerImage');

    // Cacher tous les champs d'abord
    [linkField, descriptionField, imageField, datesField].forEach(field => {
        if (field) field.classList.remove('show');
    });

    // Supprimer la validation required de l'image
    if (imageInput) {
        imageInput.required = false;
    }

    // Afficher les champs selon le type
    switch(type) {
        case 'banner':
            // Tous les champs pour banner
            if (linkField) linkField.classList.add('show');
            if (descriptionField) descriptionField.classList.add('show');
            if (imageField) imageField.classList.add('show');
            if (datesField) datesField.classList.add('show');
            if (imageInput) imageInput.required = true;
            break;

        case 'promo':
        case 'event':
            // Titre, image, dates pour promo et event
            if (imageField) imageField.classList.add('show');
            if (datesField) datesField.classList.add('show');
            if (imageInput) imageInput.required = true;
            break;

        case 'marquee':
            // Titre et dates seulement pour marquee
            if (datesField) datesField.classList.add('show');
            break;

        default:
            // Rien de sélectionné, tout caché
            break;
    }
}

function initBannerActions() {
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-banner-btn');
        if (deleteBtn) {
            const bannerId = deleteBtn.dataset.bannerId;
            if (confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
                supprimerBanniere(bannerId);
            }
        }

        const editBtn = e.target.closest('.edit-banner-btn');
        if (editBtn) {
            const bannerId = editBtn.dataset.bannerId;
            chargerBanniereDetails(bannerId);
        }
    });
}

function initBannerDetailsOffcanvas() {
    document.addEventListener('click', async (event) => {
        const trigger = event.target.closest('.details-trigger');
        if (!trigger) return;

        const bannerId = trigger.dataset.bannerId;
        if (!bannerId) return;

        showOffcanvasLoading();
        const banner = await fetchBannerDetails(bannerId);
        if (banner) {
            populateBannerOffcanvas(banner);
        } else {
            showOffcanvasError('Impossible de charger les détails de la bannière.');
        }
    });
}

async function fetchBannerDetails(bannerId) {
    try {
        const formData = new FormData();
        formData.append('action', 'getBanniereDetails');
        formData.append('banniere_id', bannerId);

        const response = await fetch('./api/bannieres.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            return data.data;
        }

        showAlert('error', data.message || 'Impossible de charger les détails de la bannière.');
        return null;
    } catch (error) {
        console.error('Erreur fetchBannerDetails:', error);
        showAlert('error', 'Erreur serveur lors du chargement des détails.');
        return null;
    }
}

function showOffcanvasError(message) {
    const titleEl = document.getElementById('offcanvasRightLabel');
    const bodyEl = document.getElementById('offcanvasDetailsBody');
    if (titleEl) {
        titleEl.textContent = 'Erreur';
    }
    if (!bodyEl) return;

    bodyEl.innerHTML = `
        <div class="d-flex flex-column align-items-center justify-content-center text-center p-5">
            <i class="bi bi-exclamation-circle-fill fs-1 text-danger mb-3"></i>
            <p class="text-muted mb-1">${escapeHtml(message)}</p>
            <p class="small text-secondary">Veuillez réessayer ou vérifier la connexion au serveur.</p>
        </div>
    `;
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
            <p class="text-muted small mb-0">Chargement des détails de la bannière...</p>
        </div>
    `;
}

function populateBannerOffcanvas(banner) {
    const titleEl = document.getElementById('offcanvasRightLabel');
    const badgeEl = document.getElementById('offcanvasDetailsStatusBadge');
    const bodyEl = document.getElementById('offcanvasDetailsBody');

    if (titleEl) {
        titleEl.textContent = 'Détails de la bannière';
    }

    if (badgeEl) {
        badgeEl.textContent = banner.active == 1 ? 'Actif' : 'Inactif';
        badgeEl.className = `status-badge ${banner.active == 1 ? 'active' : 'disabled'}`;
    }

    if (!bodyEl) return;

    const imageSrc = banner.image ? (/^https?:\/\//i.test(banner.image) ? banner.image : `./uploads/bannieres/${banner.image}`) : './uploads/bannieres/default.png';
    const typeLabel = banner.type === 'banner' ? 'Bannière' : banner.type === 'event' ? 'Événement' : banner.type === 'promo' ? 'Promotion' : 'Défilant';
    const dateDebut = banner.date_debut ? new Date(banner.date_debut).toLocaleDateString('fr-FR') : 'Aucun';
    const dateFin = banner.date_fin ? new Date(banner.date_fin).toLocaleDateString('fr-FR') : 'Illimité';

    bodyEl.innerHTML = `
        <div class="position-relative" style="height: 240px; overflow: hidden;">
            <img src="${imageSrc}" class="w-100 h-100" style="object-fit: cover;" alt="${escapeHtml(banner.titre)}">
        </div>
        <div class="p-3 d-flex flex-column gap-3">
            <div>
                <p class="text-muted small mb-1">Titre</p>
                <p class="fw-semibold mb-0">${escapeHtml(banner.titre)}</p>
            </div>
            ${banner.description ? `
            <div>
                <p class="text-muted small mb-1">Description</p>
                <p class="small text-muted mb-0">${escapeHtml(banner.description)}</p>
            </div>
            ` : ''}
            <div class="row g-2">
                <div class="col-6">
                    <p class="text-muted small mb-1">Type</p>
                    <span class="status-badge primary">${typeLabel}</span>
                </div>
                <div class="col-6 text-end">
                    <p class="text-muted small mb-1">Activé</p>
                    <p class="fw-semibold mb-0">${banner.active == 1 ? 'Oui' : 'Non'}</p>
                </div>
            </div>
            <div class="row g-2">
                <div class="col-6">
                    <p class="text-muted small mb-1">Date de début</p>
                    <p class="mb-0">${dateDebut}</p>
                </div>
                <div class="col-6 text-end">
                    <p class="text-muted small mb-1">Date de fin</p>
                    <p class="mb-0">${dateFin}</p>
                </div>
            </div>
            ${banner.lien ? `
            <div>
                <p class="text-muted small mb-1">Lien</p>
                <a href="${escapeHtml(banner.lien)}" target="_blank" class="d-block text-primary text-decoration-none">Voir la destination</a>
            </div>
            ` : ''}
        </div>
    `;
}

async function supprimerBanniere(bannerId) {
    try {
        const formData = new FormData();
        formData.append('action', 'deleteBanniere');
        formData.append('banniere_id', bannerId);

        const response = await fetch('./api/bannieres.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showAlert('success', 'Bannière supprimée.');
            chargerBannieres();
        } else {
            showAlert('error', data.message || 'Erreur lors de la suppression.');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('error', 'Erreur serveur.');
    }
}

async function chargerBanniereDetails(bannerId) {
    // TODO: Implémenter le chargement des détails pour l'édition
    console.log('Charger détails bannière:', bannerId);
}
