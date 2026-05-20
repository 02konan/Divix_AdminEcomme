document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("result-commandes")) {
        Commandes();
    }
    
    // Initialiser les détails commande
    initCommandesDetailsListener();
    
    // Cacher la pagination flottante au départ
    const floatPag = document.getElementById("floatPag");
    if (floatPag) {
        floatPag.style.display = 'none';
    }
});

const toastEl = document.getElementById('loginToast');

// Variables globales pour la pagination
let allCommandes = [];
let currentPage = 1;
const itemsPerPage = 16;

function showDotsSpinner(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <tr class="line-nothing">
                <td colspan="10" class="table-spinner nothing">
                    <div class="dots-loader m-0">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p class="text-muted small m-0 mt-2 mb-0">Chargement des données...</p>
                </td>
            </tr>
        `;
    }
}

function showCounterSkeleton() {
    const counters = ["countertotal_commandes", "counterchiffre_affaire", "counterchiffre_affaire_jour"];
    counters.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.textContent) {
            el.classList.add('counter-skeleton');
        }
    });
}

function hideCounterSkeleton() {
    const counters = ["countertotal_commandes", "counterchiffre_affaire", "counterchiffre_affaire_jour"];
    counters.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('counter-skeleton');
        }
    });
}

function showAlert(type, message) {
    if (!toastEl) return;

    const toastBody = toastEl.querySelector('.toast-body');
    toastEl.className = 'toast align-items-center bg-white text-dark';
    const iconClass = type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-danger';
    toastBody.innerHTML = `<i class="bi ${iconClass} me-2"></i>${message}`;

    const toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl);
    toastInstance.show();
}

function Commandes() {
    showDotsSpinner("result-commandes");
    showCounterSkeleton();

    const formData = new FormData();
    formData.append('action', 'getCommandes');

    fetch('./api/commandes.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideCounterSkeleton();
        if (data.success) {
            allCommandes = data.data || [];
            currentPage = 1;
            affichecommandes(allCommandes);
            console.log(data.counter);
            updateCountersCommandes(data.counter);
        } else {
            const msg = data.error || data.message || 'Une erreur est survenue';
            showAlert('error', msg);
        }
    })
    .catch(error => {
        hideCounterSkeleton();
        console.error('Erreur:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error,
            confirmButtonColor: '#3d6dff'
        });
    });
}

function affichecommandes(commandes) {
    const container = document.getElementById("result-commandes");
    if (!container) return;
    container.innerHTML = "";
    
    if (commandes && commandes.length > 0) {
        commandes.forEach(commande => {
            const dateObj = new Date(commande.date_commande);
            const dateFormatee = dateObj.toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

            const item = document.createElement("tr");

            let classe = "";
            let label = "";
            if (commande.statut == "livree" || commande.statut == "expediee") {
                label = commande.statut == "livree" ? "Livrée" : "Expédiée";
                classe = "active";
            } else if (commande.statut == "en_attente") {
                label = "En attente";
                classe = "pending";
            } else {
                label = commande.statut == "annulee" ? "Annulée" : "-";
                classe = "disabled";
            }

            item.innerHTML = `
                <th scope="row"><input class="form-check-input" type="checkbox" value="" id="checkDefault"></th>
                <td data-label="Reference">${commande.Code_commande}</td>
                <td data-label="Client">
                    <div class="d-flex align-items-center gap-2">
                        <div class="">
                            <p class="m-0 p-0">${commande.client_nom}</p>
                            <p class="text-muted small m-0 p-0">${commande.client_telephone}</p>
                        </div>
                    </div>
                </td>
                <td data-label="Produits">${commande.nombre_produits}</td>
                <td data-label="Montant">${commande.total}</td>
                <td data-label="Statut"><span class="status-badge ${classe}">${label}</span></td>
                <td data-label="Date"><span class="text-muted">${dateFormatee}</span></td>
                <td class="no-print-col" data-label="Action" style="text-align: end;">
                    <div style="display: flex; gap: 6px; justify-content: flex-end;">
                        <button type="button" class="btn btn-sm btn-outline-secondary details-btn" data-commande-id="${commande.id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetailsCommandes" aria-controls="offcanvasRight">
                            <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                    </div>
                </td>
            `;
            container.appendChild(item);
        });
    } else {
        container.innerHTML = `
            <tr class="line-nothing">
                <td colspan="10" class="text-center py-5 nothing">
                    <div class="text-center">
                        <i class="bi bi-inbox fs-1 text-muted"></i>
                        <p class="text-muted mt-2 mb-0">Aucune commande trouvée</p>
                    </div>
                </td>
            </tr>
        `;
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

function updateCountersCommandes(counterData) {
    if (!counterData) return;
    const data = Array.isArray(counterData) ? counterData[0] || {} : counterData;
    
    const counters = [
        { id: "countertotal_commandes", value: data.total_commandes },
        { id: "counterchiffre_affaire", value: data.chiffre_affaires_total },
        { id: "counterchiffre_affaire_jour", value: data.chiffre_affaires_aujourdhui }
    ];
    
    counters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (element && counter.value !== undefined) {
            const targetValue = parseFloat(counter.value) || 0;
            animateNumber(element, 0, targetValue, 1000);
        }
    });
}

// ============================================
// FONCTIONS POUR LES DÉTAILS DE COMMANDE
// ============================================

function initCommandesDetailsListener() {
    const commandesContainer = document.getElementById('result-commandes');
    if (!commandesContainer) return;

    commandesContainer.addEventListener('click', async (event) => {
        const detailsButton = event.target.closest('.details-btn');
        if (!detailsButton) return;

        const commandeId = detailsButton.dataset.commandeId;
        if (!commandeId) return;

        showOffcanvasLoading();

        const details = await fetchCommandesDetails(commandeId);
        if (details) {
            populateOffcanvasDetails(details);
        }
    });
}

function showOffcanvasLoading() {
    const infoContainer = document.getElementById('commandeDetailsInfo');
    const clientContainer = document.getElementById('commandeDetailsClient');
    const produitsContainer = document.getElementById('commandeDetailsProduits');
    
    const loadingHtml = `
        <div class="text-center py-4">
            <div class="dots-loader m-0">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p class="text-muted small mt-2 mb-0">Chargement des détails...</p>
        </div>
    `;
    
    if (infoContainer) infoContainer.innerHTML = loadingHtml;
    if (clientContainer) clientContainer.innerHTML = loadingHtml;
    if (produitsContainer) produitsContainer.innerHTML = loadingHtml;
}

async function fetchCommandesDetails(commandeId) {
    try {
        const formData = new FormData();
        formData.append('action', 'getCommandeDetails');
        formData.append('commande_id', commandeId);

        const response = await fetch('./api/commandes.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            return data.data;
        }

        showAlert('error', data.message || 'Impossible de charger les détails de la commande.');
        return null;
    } catch (error) {
        console.error('Erreur fetchCommandesDetails:', error);
        showAlert('error', 'Erreur serveur lors du chargement des détails.');
        return null;
    }
}

// Ajoutez cette fonction helper en haut du fichier
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

const btnLivree = document.querySelector('#livree')
const btnExpediee = document.querySelector('#expediee')
const footerOffcanvas = document.getElementById('offcanvas-footer-commande')

function populateOffcanvasDetails(data) {
    const commande = data.commande;
    const produits = data.produits || [];

    // Formatage de la date
    const dateObj = new Date(commande.date_commande);
    const dateFormatee = dateObj.toLocaleString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // charger les id et le statut dans les button statut

    if (btnLivree) {
        btnLivree.dataset.commandeId = commande.id;
    }

    if (btnExpediee) {
        btnExpediee.dataset.commandeId = commande.id;
    }
    
    if (footerOffcanvas) {
        if (commande.statut !== "en_attente") {
            footerOffcanvas.classList.add('d-none')
        }else{
            footerOffcanvas.classList.remove('d-none')
        }
    }

    // Déterminer la classe et le libellé du statut
    let classeStatut = "";
    let labelStatut = "";
    if (commande.statut == "livree" || commande.statut == "expediee") {
        labelStatut = commande.statut == "livree" ? "Livrée" : "Expédiée";
        classeStatut = "active";
    } else if (commande.statut == "en_attente") {
        labelStatut = "En attente";
        classeStatut = "pending";
    } else {
        labelStatut = commande.statut == "annulee" ? "Annulée" : "-";
        classeStatut = "disabled";
    }

    // Remplir l'en-tête de l'offcanvas
    const offcanvasTitle = document.querySelector('#offcanvasDetailsCommandes .offcanvas-title');
    if (offcanvasTitle) {
        offcanvasTitle.innerHTML = `Commande ${commande.Code_commande || commande.id}`;
    }

    // Remplir les informations générales
    const infoContainer = document.getElementById('commandeDetailsInfo');
    if (infoContainer) {
        infoContainer.innerHTML = `
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="info-group">
                        <label class="text-muted small mb-1">Référence commande</label>
                        <p class="mb-0 fw-semibold">${commande.Code_commande || '-'}</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="info-group">
                        <label class="text-muted small mb-1">Date de commande</label>
                        <p class="mb-0 fw-semibold">${dateFormatee}</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="info-group">
                        <label class="text-muted small mb-1">Statut</label>
                        <p class="mb-0"><span class="status-badge ${classeStatut}">${labelStatut}</span></p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="info-group">
                        <label class="text-muted small mb-1">Montant total</label>
                        <p class="mb-0 fw-semibold fs-5 text-primary">${parseFloat(commande.total).toLocaleString('fr-FR')} F</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="info-group">
                        <label class="text-muted small mb-1">Mode de livraison</label>
                        <p class="mb-0 fw-semibold">${commande.mode_livraison || 'Non spécifié'}</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="info-group">
                        <label class="text-muted small mb-1">Mode de paiement</label>
                        <p class="mb-0 fw-semibold">${commande.mode_paiement || 'Non spécifié'}</p>
                    </div>
                </div>
                ${commande.adresse_livraison ? `
                <div class="col-12">
                    <div class="info-group">
                        <label class="text-muted small mb-1">Adresse de livraison</label>
                        <p class="mb-0">${commande.adresse_livraison}</p>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    // Remplir les informations client
    const clientContainer = document.getElementById('commandeDetailsClient');
    if (clientContainer) {
        clientContainer.innerHTML = `
            <div class="row g-3">
                <div class="col-12">
                    <div class="info-group">
                        <label class="text-muted small mb-1">Nom complet</label>
                        <p class="mb-0 fw-semibold">${commande.client_nom || 'Client non renseigné'}</p>
                    </div>
                </div>
                <div class="col-12">
                    <div class="info-group">
                        <label class="text-muted small mb-1">Téléphone</label>
                        <p class="mb-0">${commande.client_telephone || 'Non renseigné'}</p>
                    </div>
                </div>
                ${commande.client_email ? `
                <div class="col-12">
                    <div class="info-group">
                        <label class="text-muted small mb-1">Email</label>
                        <p class="mb-0">${commande.client_email}</p>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    // Remplir le tableau des produits
    const produitsContainer = document.getElementById('commandeDetailsProduits');
    if (produitsContainer) {
        if (produits.length > 0) {
            let produitsHtml = `
                <div class="table-responsive">
                    <table class="table table-sm table-hover">
                        <thead class="table-light">
                            <tr>
                                <th>Produit</th>
                                <th class="text-center">Quantité</th>
                                <th class="text-end">P. unitaire</th>
                                <th class="text-end">Total</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            let sousTotal = 0;
            produits.forEach(produit => {
                const quantite = parseInt(produit.quantite) || 0;
                const prixUnitaire = parseFloat(produit.prix_unitaire) || 0;
                const totalLigne = quantite * prixUnitaire;
                sousTotal += totalLigne;
                
                const imageUrl = produit.image && !produit.image.startsWith('http') 
                    ? `./uploads/produits/${produit.image}` 
                    : produit.image;
                
                produitsHtml += `
                    <tr>
                        <td>
                            <div class="d-flex align-items-center details-produit-tale gap-2">
                                ${produit.image ? `
                                    <img src="${imageUrl}" alt="${produit.produit_nom}" 
                                         style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px;"
                                         onerror="this.src='./assets/img/placeholder.png'">
                                ` : `
                                    <div class="bg-light d-flex align-items-center justify-content-center" 
                                         style="width: 40px; height: 40px; border-radius: 8px;">
                                        <i class="bi bi-image text-muted"></i>
                                    </div>
                                `}
                                <div>
                                    <p class="mb-0 fw-semibold small">${truncateText(produit.produit_nom || 'Produit #' + produit.produit_id, 30)}</p>
                                    <small class="text-muted">Code: <code>${produit.produit_code || '-'}</code></small>
                                </div>
                            </div>
                        </td>
                        <td class="text-center">${quantite}</td>
                        <td class="text-end">${prixUnitaire.toLocaleString('fr-FR')} F</td>
                        <td class="text-end fw-semibold">${totalLigne.toLocaleString('fr-FR')} F</td>
                    </tr>
                `;
            });
            
            const fraisLivraison = parseFloat(commande.frais_livraison) || 0;
            const total = parseFloat(commande.total) || sousTotal + fraisLivraison;
            
            produitsHtml += `
                        </tbody>
                        <tfoot class="table-light">
                            <tr>
                                <td colspan="3" class="text-end fw-semibold">Sous-total :</td>
                                <td class="text-end">${sousTotal.toLocaleString('fr-FR')} F</td>
                            </tr>
                            ${fraisLivraison > 0 ? `
                            <tr>
                                <td colspan="3" class="text-end fw-semibold">Frais de livraison :</td>
                                <td class="text-end">${fraisLivraison.toLocaleString('fr-FR')} F</td>
                            </tr>
                            ` : ''}
                            <tr class="border-top">
                                <td colspan="3" class="text-end fw-bold">Total :</td>
                                <td class="text-end fw-bold fs-6 text-primary">${total.toLocaleString('fr-FR')} F</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;
            
            produitsContainer.innerHTML = produitsHtml;
        } else {
            produitsContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-box-seam fs-1 text-muted"></i>
                    <p class="text-muted mt-2 mb-0">Aucun produit trouvé pour cette commande</p>
                </div>
            `;
        }
    }
}

// Remplacer l'écouteur actuel par ceci
if (btnLivree) {
    btnLivree.addEventListener('click', async function() {
        const commandeId = this.dataset.commandeId;
        const statut = this.dataset.statut; // Correction : date-statut devient dateStatut
        console.log(commandeId, statut);
        
        if (commandeId && statut) {
            await updateCommandesStatus(statut, commandeId);
            
            // Optionnel : rafraîchir la liste des commandes après mise à jour
            // Et fermer l'offcanvas
            Commandes();
            
            // Fermer l'offcanvas
            const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasDetailsCommandes'));
            if (offcanvas) {
                offcanvas.hide();
            }
        }
    });
}
// Écouteur pour le bouton Expédier
if (btnExpediee) {
    btnExpediee.addEventListener('click', async function() {
        const commandeId = this.dataset.commandeId;
        const statut = this.getAttribute('date-statut') || 'expediee'; // Récupère l'attribut date-statut
        console.log(commandeId, statut);
        
        if (commandeId && statut) {
            const success = await updateCommandesStatus(statut, commandeId);
            
            if (success) {
                // Rafraîchir la liste des commandes
                Commandes();
                
                // Fermer l'offcanvas
                const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasDetailsCommandes'));
                if (offcanvas) {
                    offcanvas.hide();
                }
            }
        }
    });
}
async function updateCommandesStatus(statut, commandeId) {
    const formData = new FormData();
    try {
        formData.append('action', 'updateCommandeStatus');
        formData.append('commande_id', commandeId);
        formData.append('statut', statut);

        const response = await fetch('./api/commandes.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            showAlert('success', `Statut de la commande mis à jour : ${statut === 'livree' ? 'Livrée' : 'Expédiée'}`);
            return true;
        } else {
            showAlert('error', data.message || 'Impossible de mettre à jour le statut.');
            return false;
        }
    } catch (error) {
        console.error(error);
        showAlert('error', 'Erreur lors de la mise à jour du statut.');
        return false;
    }
}