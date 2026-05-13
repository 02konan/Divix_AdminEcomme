document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("result-clients")) {
        Clients();
    }
    
    // Initialiser les détails commande
    // initCommandesDetailsListener();
    
    // Cacher la pagination flottante au départ
    const floatPag = document.getElementById("floatPag");
    if (floatPag) {
        floatPag.style.display = 'none';
    }
});

const toastEl = document.getElementById('loginToast');

// Variables globales pour la pagination
let allClients = [];
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
    const counters = ["countertotal_clients"];
    counters.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.textContent) {
            el.classList.add('counter-skeleton');
        }
    });
}

function hideCounterSkeleton() {
    const counters = ["countertotal_clients"];
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

function Clients() {
    showDotsSpinner("result-clients");
    showCounterSkeleton();

    const formData = new FormData();
    formData.append('action', 'getClients');

    fetch('./api/clients.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideCounterSkeleton();
        if (data.success) {
            allClients = data.data || [];
            currentPage = 1;
            afficheclients(allClients);
            console.log(data.counter);
            updateCountersClients(data.counter);
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

function afficheclients(clients) {
    const container = document.getElementById("result-clients");
    if (!container) return;
    container.innerHTML = "";
    
    if (clients && clients.length > 0) {
        clients.forEach(client => {
            const dateObj = new Date(client.date_creation);
            const dateFormatee = dateObj.toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
            
            // Récupérer les initiales du nom (ex: John Doe -> JD)
            const initiale = getInitiales(client.nom);
            
            // Générer une couleur automatique basée sur le nom
            const colorClass = getColorForName(client.nom);

            const item = document.createElement("tr");

            item.innerHTML = `
                <th scope="row"><input class="form-check-input" type="checkbox" value=""></th>
                <td data-label="Client">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar-initials ${colorClass.bg} ${colorClass.text} rounded-circle d-flex align-items-center justify-content-center fw-semibold" style="width:34px;height:34px;font-size:13px;flex-shrink:0">
                            ${initiale}
                        </div>
                        <div>
                            <p class="m-0 p-0 fw-medium">${escapeHtml(client.nom || '—')}</p>
                        </div>
                    </div>
                </td>
                <td data-label="Contact">
                    <p class="m-0 p-0">${client.telephone || '—'}</p>
                    ${client.whatsapp && client.whatsapp !== client.telephone ? `<small class="text-muted">WhatsApp: ${client.whatsapp}</small>` : ''}
                </td>
                <td data-label="Email"><span class="text-muted">${client.adresse || '—'}</span></td>
                <td data-label="Commandes">${client.nombre_commandes || '0'}</td>
                <td data-label="Date"><span class="text-muted">${dateFormatee}</span></td>
                <td data-label="Action" class="no-print-col" style="text-align: end;">
                    <div class="btn-group">
                        <button class="btn btn-outline-secondary btn-sm td-btn" type="button" data-clients-id="${client.id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetailsCommandes" aria-controls="offcanvasRight">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                    </div>
                </td>
            `;
            container.appendChild(item);
        });
    } else {
        container.innerHTML = `
            <tr class="line-nothing">
                <td colspan="7" class="text-center py-5 nothing">
                    <div class="text-center">
                        <i class="bi bi-inbox fs-1 text-muted"></i>
                        <p class="text-muted mt-2 mb-0">Aucun client trouvé</p>
                    </div>
                </td>
            </tr>
        `;
    }
}
// Fonction pour obtenir les initiales (ex: "John Doe" -> "JD", "Marie Koné" -> "MK")
function getInitiales(nom) {
    if (!nom) return "?";
    
    const mots = nom.trim().split(/\s+/);
    if (mots.length === 1) {
        // Si un seul mot, prendre la première lettre
        return mots[0].charAt(0).toUpperCase();
    } else {
        // Si plusieurs mots, prendre la première lettre du premier et du dernier mot
        const premiereLettre = mots[0].charAt(0).toUpperCase();
        const derniereLettre = mots[mots.length - 1].charAt(0).toUpperCase();
        return premiereLettre + derniereLettre;
    }
}

// Fonction pour générer une couleur cohérente basée sur le nom
function getColorForName(nom) {
    const colors = [
        { bg: 'bg-primary-subtle', text: 'text-primary' },
        { bg: 'bg-danger-subtle', text: 'text-danger' },
        { bg: 'bg-success-subtle', text: 'text-success' },
        { bg: 'bg-warning-subtle', text: 'text-warning' },
        { bg: 'bg-info-subtle', text: 'text-info' },
        { bg: 'bg-secondary-subtle', text: 'text-secondary' },
        { bg: 'bg-dark-subtle', text: 'text-dark' }
    ];
    
    if (!nom) return colors[0];
    
    // Générer un hash cohérent basé sur le nom
    let hash = 0;
    for (let i = 0; i < nom.length; i++) {
        hash = nom.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    
    return colors[colorIndex];
}

// Fonction utilitaire pour échapper les caractères HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Fonctions à implémenter selon vos besoins
function voirDetailsClient(clientId) {
    console.log('Voir détails du client:', clientId);
    // Implémentez la logique pour afficher les détails
}

function modifierClient(clientId) {
    console.log('Modifier le client:', clientId);
    // Implémentez la logique pour modifier le client
}

function supprimerClient(clientId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
        console.log('Supprimer le client:', clientId);
        // Implémentez la logique de suppression
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

function updateCountersClients(counterData) {
    if (!counterData) return;
    const data = Array.isArray(counterData) ? counterData[0] || {} : counterData;
    
    const counters = [
        { id: "countertotal_clients", value: data.total_clients }
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

// function initCommandesDetailsListener() {
//     const commandesContainer = document.getElementById('result-clients');
//     if (!commandesContainer) return;

//     commandesContainer.addEventListener('click', async (event) => {
//         const detailsButton = event.target.closest('.details-btn');
//         if (!detailsButton) return;

//         const commandeId = detailsButton.dataset.commandeId;
//         if (!commandeId) return;

//         showOffcanvasLoading();

//         const details = await fetchCommandesDetails(commandeId);
//         if (details) {
//             populateOffcanvasDetails(details);
//         }
//     });
// }

// function showOffcanvasLoading() {
//     const infoContainer = document.getElementById('commandeDetailsInfo');
//     const clientContainer = document.getElementById('commandeDetailsClient');
//     const produitsContainer = document.getElementById('commandeDetailsProduits');
    
//     const loadingHtml = `
//         <div class="text-center py-4">
//             <div class="dots-loader m-0">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//             </div>
//             <p class="text-muted small mt-2 mb-0">Chargement des détails...</p>
//         </div>
//     `;
    
//     if (infoContainer) infoContainer.innerHTML = loadingHtml;
//     if (clientContainer) clientContainer.innerHTML = loadingHtml;
//     if (produitsContainer) produitsContainer.innerHTML = loadingHtml;
// }

// async function fetchCommandesDetails(commandeId) {
//     try {
//         const formData = new FormData();
//         formData.append('action', 'getCommandeDetails');
//         formData.append('commande_id', commandeId);

//         const response = await fetch('./api/commandes.php', {
//             method: 'POST',
//             body: formData
//         });
//         const data = await response.json();

//         if (data.success) {
//             return data.data;
//         }

//         showAlert('error', data.message || 'Impossible de charger les détails de la commande.');
//         return null;
//     } catch (error) {
//         console.error('Erreur fetchCommandesDetails:', error);
//         showAlert('error', 'Erreur serveur lors du chargement des détails.');
//         return null;
//     }
// }

// Ajoutez cette fonction helper en haut du fichier
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// function populateOffcanvasDetails(data) {
//     const commande = data.commande;
//     const produits = data.produits || [];

//     // Formatage de la date
//     const dateObj = new Date(commande.date_commande);
//     const dateFormatee = dateObj.toLocaleString('fr-FR', { 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     });

//     // charger les id et le statut dans les button statut

//     if (btnLivree) {
//         btnLivree.dataset.commandeId = commande.id;
//     }

//     if (btnExpediee) {
//         btnExpediee.dataset.commandeId = commande.id;
//     }

//     // Déterminer la classe et le libellé du statut
//     let classeStatut = "";
//     let labelStatut = "";
//     if (commande.statut == "livree" || commande.statut == "expediee") {
//         labelStatut = commande.statut == "livree" ? "Livrée" : "Expédiée";
//         classeStatut = "active";
//     } else if (commande.statut == "en_attente") {
//         labelStatut = "En attente";
//         classeStatut = "pending";
//     } else {
//         labelStatut = commande.statut == "annulee" ? "Annulée" : "-";
//         classeStatut = "disabled";
//     }

//     // Remplir l'en-tête de l'offcanvas
//     const offcanvasTitle = document.querySelector('#offcanvasDetailsCommandes .offcanvas-title');
//     if (offcanvasTitle) {
//         offcanvasTitle.innerHTML = `Commande ${commande.Code_commande || commande.id}`;
//     }

//     // Remplir les informations générales
//     const infoContainer = document.getElementById('commandeDetailsInfo');
//     if (infoContainer) {
//         infoContainer.innerHTML = `
//             <div class="row g-3">
//                 <div class="col-md-6">
//                     <div class="info-group">
//                         <label class="text-muted small mb-1">Référence commande</label>
//                         <p class="mb-0 fw-semibold">${commande.Code_commande || '-'}</p>
//                     </div>
//                 </div>
//                 <div class="col-md-6">
//                     <div class="info-group">
//                         <label class="text-muted small mb-1">Date de commande</label>
//                         <p class="mb-0 fw-semibold">${dateFormatee}</p>
//                     </div>
//                 </div>
//                 <div class="col-md-6">
//                     <div class="info-group">
//                         <label class="text-muted small mb-1">Statut</label>
//                         <p class="mb-0"><span class="status-badge ${classeStatut}">${labelStatut}</span></p>
//                     </div>
//                 </div>
//                 <div class="col-md-6">
//                     <div class="info-group">
//                         <label class="text-muted small mb-1">Montant total</label>
//                         <p class="mb-0 fw-semibold fs-5 text-primary">${parseFloat(commande.total).toLocaleString('fr-FR')} F</p>
//                     </div>
//                 </div>
//                 <div class="col-md-6">
//                     <div class="info-group">
//                         <label class="text-muted small mb-1">Mode de livraison</label>
//                         <p class="mb-0 fw-semibold">${commande.mode_livraison || 'Non spécifié'}</p>
//                     </div>
//                 </div>
//                 <div class="col-md-6">
//                     <div class="info-group">
//                         <label class="text-muted small mb-1">Mode de paiement</label>
//                         <p class="mb-0 fw-semibold">${commande.mode_paiement || 'Non spécifié'}</p>
//                     </div>
//                 </div>
//                 ${commande.adresse_livraison ? `
//                 <div class="col-12">
//                     <div class="info-group">
//                         <label class="text-muted small mb-1">Adresse de livraison</label>
//                         <p class="mb-0">${commande.adresse_livraison}</p>
//                     </div>
//                 </div>
//                 ` : ''}
//             </div>
//         `;
//     }

//     // Remplir les informations client
//     const clientContainer = document.getElementById('commandeDetailsClient');
//     if (clientContainer) {
//         clientContainer.innerHTML = `
//             <div class="row g-3">
//                 <div class="col-12">
//                     <div class="info-group">
//                         <label class="text-muted small mb-1">Nom complet</label>
//                         <p class="mb-0 fw-semibold">${commande.client_nom || 'Client non renseigné'}</p>
//                     </div>
//                 </div>
//                 <div class="col-12">
//                     <div class="info-group">
//                         <label class="text-muted small mb-1">Téléphone</label>
//                         <p class="mb-0">${commande.client_telephone || 'Non renseigné'}</p>
//                     </div>
//                 </div>
//                 ${commande.client_email ? `
//                 <div class="col-12">
//                     <div class="info-group">
//                         <label class="text-muted small mb-1">Email</label>
//                         <p class="mb-0">${commande.client_email}</p>
//                     </div>
//                 </div>
//                 ` : ''}
//             </div>
//         `;
//     }

//     // Remplir le tableau des produits
//     const produitsContainer = document.getElementById('commandeDetailsProduits');
//     if (produitsContainer) {
//         if (produits.length > 0) {
//             let produitsHtml = `
//                 <div class="table-responsive">
//                     <table class="table table-sm table-hover">
//                         <thead class="table-light">
//                             <tr>
//                                 <th>Produit</th>
//                                 <th class="text-center">Quantité</th>
//                                 <th class="text-end">P. unitaire</th>
//                                 <th class="text-end">Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//             `;
            
//             let sousTotal = 0;
//             produits.forEach(produit => {
//                 const quantite = parseInt(produit.quantite) || 0;
//                 const prixUnitaire = parseFloat(produit.prix_unitaire) || 0;
//                 const totalLigne = quantite * prixUnitaire;
//                 sousTotal += totalLigne;
                
//                 const imageUrl = produit.image && !produit.image.startsWith('http') 
//                     ? `./uploads/produits/${produit.image}` 
//                     : produit.image;
                
//                 produitsHtml += `
//                     <tr>
//                         <td>
//                             <div class="d-flex align-items-center details-produit-tale gap-2">
//                                 ${produit.image ? `
//                                     <img src="${imageUrl}" alt="${produit.produit_nom}" 
//                                          style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px;"
//                                          onerror="this.src='./assets/img/placeholder.png'">
//                                 ` : `
//                                     <div class="bg-light d-flex align-items-center justify-content-center" 
//                                          style="width: 40px; height: 40px; border-radius: 8px;">
//                                         <i class="bi bi-image text-muted"></i>
//                                     </div>
//                                 `}
//                                 <div>
//                                     <p class="mb-0 fw-semibold small">${truncateText(produit.produit_nom || 'Produit #' + produit.produit_id, 30)}</p>
//                                     <small class="text-muted">Code: <code>${produit.produit_code || '-'}</code></small>
//                                 </div>
//                             </div>
//                         </td>
//                         <td class="text-center">${quantite}</td>
//                         <td class="text-end">${prixUnitaire.toLocaleString('fr-FR')} F</td>
//                         <td class="text-end fw-semibold">${totalLigne.toLocaleString('fr-FR')} F</td>
//                     </tr>
//                 `;
//             });
            
//             const fraisLivraison = parseFloat(commande.frais_livraison) || 0;
//             const total = parseFloat(commande.total) || sousTotal + fraisLivraison;
            
//             produitsHtml += `
//                         </tbody>
//                         <tfoot class="table-light">
//                             <tr>
//                                 <td colspan="3" class="text-end fw-semibold">Sous-total :</td>
//                                 <td class="text-end">${sousTotal.toLocaleString('fr-FR')} F</td>
//                             </tr>
//                             ${fraisLivraison > 0 ? `
//                             <tr>
//                                 <td colspan="3" class="text-end fw-semibold">Frais de livraison :</td>
//                                 <td class="text-end">${fraisLivraison.toLocaleString('fr-FR')} F</td>
//                             </tr>
//                             ` : ''}
//                             <tr class="border-top">
//                                 <td colspan="3" class="text-end fw-bold">Total :</td>
//                                 <td class="text-end fw-bold fs-6 text-primary">${total.toLocaleString('fr-FR')} F</td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                 </div>
//             `;
            
//             produitsContainer.innerHTML = produitsHtml;
//         } else {
//             produitsContainer.innerHTML = `
//                 <div class="text-center py-4">
//                     <i class="bi bi-box-seam fs-1 text-muted"></i>
//                     <p class="text-muted mt-2 mb-0">Aucun produit trouvé pour cette commande</p>
//                 </div>
//             `;
//         }
//     }
// }
