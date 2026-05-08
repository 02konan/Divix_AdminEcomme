// document.addEventListener("DOMContentLoaded", () => {
//     Ventes();
// });

// function showDotsSpinner(containerId) {
//     const container = document.getElementById(containerId);
//     if (container) {
//         container.innerHTML = `
//             <tr class="line-nothing">
//                 <td colspan="10" class="table-spinner nothing">
//                     <div class="dots-loader m-0">
//                         <span></span>
//                         <span></span>
//                         <span></span>
//                     </div>
//                     <p class="text-muted small m-0 mt-2 mb-0">Chargement des données...</p>
//                 </td>
//             </tr>
//         `;
//     }
// }

// function Ventes() {
//     showDotsSpinner("tbody-vente");

//     fetch("/vente/list")
//         .then(res => res.json())
//         .then(response => {
//             if (response.data) affichevente(response.data);
//             if (response.counter) {
//                 updateCounters(response.counter);
//             }
//         })
//         .catch(err => {
//             console.error("Erreur lors du chargement des ventes :", err);
//             const container = document.getElementById("tbody-vente");
//             if (container) {
//                 container.innerHTML = `
//                     <tr class="line-nothing">
//                         <td colspan="10" class="text-center py-5 nothing">
//                             <div class="text-center">
//                                 <i class="bi bi-exclamation-circle fs-1 text-danger"></i>
//                                 <p class="text-muted mt-2 mb-0">Erreur lors du chargement des données.</p>
//                             </div>
//                         </td>
//                     </tr>
//                 `;
//             }
//         });
// }

// function animateNumber(element, start, end, duration) {
//     let startTimestamp = null;
//     const step = (timestamp) => {
//         if (!startTimestamp) startTimestamp = timestamp;
//         const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//         element.textContent = Math.floor(progress * (end - start) + start);
//         if (progress < 1) {
//             window.requestAnimationFrame(step);
//         }
//     };
//     window.requestAnimationFrame(step);
// }

// function updateCounters(counterData) {
//     if (!counterData) return;
    
//     const counters = [
//         { id: "counterTotalventes", value: counterData.total_vente },
//         { id: "countermontantvente", value: counterData.montant },
//         { id: "counterImpayés", value: counterData.impaye }
//     ];
    
//     counters.forEach(counter => {
//         const element = document.getElementById(counter.id);
//         if (element && counter.value !== undefined) {
//             const currentValue = parseFloat(element.textContent.replace(/\s/g, '')) || 0;
//             const targetValue = parseFloat(counter.value) || 0;
            
//             if (currentValue !== targetValue) {
//                 animateNumber(element, currentValue, targetValue, 1000);
//             }
//         }
//     });
// }
// let ventesData = []
// function affichevente(vente) {
//     ventesData = vente || []
//     const container = document.getElementById("tbody-vente");
//     if (!container) return;
//     container.innerHTML = "";

//     if (vente && vente.length > 0) {
//         vente.forEach(vnt => {
//             const dateObj = new Date(vnt.date);
//             const dateFormatee = dateObj.toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

//             const item = document.createElement("tr");

//             let classe=""
//             if(vnt.statut=="Soldé"){
//                 classe="active"
//             }else if(vnt.statut=="Non Soldé"){
//                 classe="pending"
//             }else{
//                 classe="disabled"
//             }

//             item.innerHTML = `
//               <th scope="row"><input class="form-check-input" type="checkbox" value="" id="checkDefault"></th>
//                                 <td data-label="Reference">${vnt.reference}</td>
//                                 <td data-label="Client">
//                                     <div class="d-flex align-items-center gap-2">
//                                         <div class="">
//                                             <p class="m-0 p-0">${vnt.client_nom}</p>
//                                             <p class="text-muted small m-0 p-0">${vnt.telephone}</p>
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td data-label="Client">
//                                     <div class="d-flex align-items-center gap-2">
//                                         <div class="">
//                                             <p class="m-0 p-0">${vnt.client_nom}</p>
//                                             <p class="text-muted small m-0 p-0">${vnt.telephone}</p>
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td data-label="Montant">${vnt.montant}</td>
//                                 <td data-label="Statut"><span class="status-badge ${classe}">${vnt.statut}</span></td>
//                                 <td data-label="Date"><span class="text-muted">${dateFormatee}</span></td>
//                                 <td class="no-print-col" data-label="Action" style="text-align: end;">
//                                     <div style="display: flex; gap: 6px; justify-content: flex-end;">
                                        
//                                         <!-- Bouton Modifier -->
//                                         <button class="btn btn-sm" 
//                                                 style="border: 0.5px solid #378ADD; color: #185FA5; background: transparent; display:inline-flex; align-items:center; gap:5px; font-size:12px;"
//                                                 onclick="modifierCommande('${vnt.reference}')">
//                                             <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
//                                                 <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
//                                             </svg>
//                                         </button>

//                                         <!-- Bouton Imprimer -->
//                                         <button class="btn btn-sm"
//                                                 style="border: 0.5px solid #1D9E75; color: #0F6E56; background: transparent; display:inline-flex; align-items:center; gap:5px; font-size:12px;"
//                                                 onclick="imprimerCommande('${vnt.reference}')">
//                                             <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
//                                                 <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
//                                             </svg>
//                                         </button>

//                                     </div>
//                                 </td>
//             `;
//             container.appendChild(item);
//         });
//     } else {
//         container.innerHTML = `
//                 <tr class="line-nothing">
//                     <td colspan="10" class="text-center py-5 nothing">
//                         <div class="text-center">
//                             <i class="bi bi-inbox fs-1 text-muted"></i>
//                             <p class="text-muted mt-2 mb-0">Aucun produit trouvé</p>
//                         </div>
//                     </td>
//                 </tr>
//             `;
//     }
// }

// function imprimerCommande(reference) {
//     const vnt = ventesData.find(v => v.reference === reference);
//     if (!vnt) {
//         console.error("Vente introuvable:", reference);
//         return;
//     }

//     const dateFormatee = new Date(vnt.date).toLocaleString('fr-FR', {
//         year: 'numeric', month: 'long', day: 'numeric'
//     });

//     let statutCouleur = '#185FA5';
//     if (vnt.statut === 'Soldé')      statutCouleur = '#0F6E56';
//     else if (vnt.statut === 'Non Soldé') statutCouleur = '#BA7517';

//     const contenu = `
//         <html>
//         <head>
//             <title>Vente ${vnt.reference}</title>
//             <style>
//                 * { margin: 0; padding: 0; box-sizing: border-box; }
//                 body { font-family: Arial, sans-serif; padding: 40px; color: #333; font-size: 14px; }
//                 .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
//                 .header h2 { color: #185FA5; font-size: 20px; }
//                 .header .ref { font-size: 13px; color: #888; margin-top: 4px; }
//                 .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: white; background: ${statutCouleur}; }
//                 table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//                 th { background: #f5f7ff; text-align: left; padding: 10px 14px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
//                 td { padding: 12px 14px; border-bottom: 1px solid #eee; }
//                 .footer { margin-top: 40px; font-size: 11px; color: #bbb; text-align: center; border-top: 1px solid #eee; padding-top: 16px; }
//             </style>
//         </head>
//         <body>
//             <div class="header">
//                 <div>
//                     <h2>Bon de vente</h2>
//                     <p class="ref">Réf : ${vnt.reference}</p>
//                 </div>
//                 <span class="badge">${vnt.statut}</span>
//             </div>
//             <table>
//                 <tr><th>Client</th>    <td>${vnt.client_nom}</td></tr>
//                 <tr><th>Téléphone</th> <td>${vnt.telephone}</td></tr>
//                 <tr><th>Montant</th>   <td><strong>${vnt.montant} FCFA</strong></td></tr>
//                 <tr><th>Date</th>      <td>${dateFormatee}</td></tr>
//                 <tr><th>Statut</th>    <td><span class="badge">${vnt.statut}</span></td></tr>
//             </table>
//             <div class="footer">
//                 Imprimé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
//             </div>
//         </body>
//         </html>
//     `;

//     const fenetre = window.open('', '_blank', 'width=800,height=600');
//     fenetre.document.write(contenu);
//     fenetre.document.close();
//     fenetre.focus();
//     fenetre.print();
//     fenetre.close();
// }


// // Vérifier si le script est déjà initialisé
// if (window.venteJsInitialized) {
//     console.log('vente.js déjà chargé, annulation de la réexécution');
// } else {
//     window.venteJsInitialized = true;
    
//     // Variables globales (attachées à l'objet window pour éviter la pollution)
// let articles = [];
// let selected = [];
// let articlesLoaded = false;

// function getEls() {
//     return {
//         searchInput:    document.getElementById('articleSearch'),
//         dropdown:       document.getElementById('articleDropdown'),
//         tagsContainer:  document.getElementById('selectedArticlesTags'),
//         montantVisible: document.getElementById('montantTotal'),
//         montantHidden:  document.getElementById('montantTotalArticles'),
//     };
// }

// function formatPrix(p) {
//     return p.toLocaleString('fr-FR') + ' FCFA';
// }

// function updateMontant() {
//     const { montantVisible, montantHidden } = getEls();
//     const total = selected.reduce((sum, a) => sum + a.prix, 0);
//     const formatted = total > 0 ? formatPrix(total) : '0 FCFA';
//     if (montantVisible) montantVisible.value = formatted;
//     if (montantHidden)  montantHidden.value  = formatted;
// }

// function renderTags() {
//     const { tagsContainer } = getEls();
//     if (!tagsContainer) return;

//     tagsContainer.innerHTML = '';

//     // Mettre à jour le bouton selon la sélection
//     const submitBtn = document.getElementById('submitBtn');
    
//     if (selected.length === 0) {
//         tagsContainer.innerHTML = '<span class="text-muted small">Aucun article sélectionné</span>';
//         if (submitBtn) {
//             submitBtn.disabled = true;
//             const submitBtnText = document.getElementById('submitBtnText');
//             if (submitBtnText) submitBtnText.textContent = 'Sélectionnez un article';
//         }
//         updateMontant();
//         return;
//     }

//     selected.forEach(function (a) {
//         const tag = document.createElement('span');
//         tag.className = 'badge d-inline-flex select-product align-items-center gap-1 px-2 py-1';
//         tag.innerHTML =`
//         <span> ${a.nom} </span> 
//             <span class="small text-muted ms-3">${formatPrix(a.prix)}</span> 
//             <button type="button" data-id="${a.id }" style="background:none;border:none;cursor:pointer;">&times;</button>
//         `

//         tag.querySelector('button').addEventListener('click', function () {
//             selected = selected.filter(s => s.id !== a.id);
//             renderTags();
//             updateMontant();
//         });

//         tagsContainer.appendChild(tag);
//     });

//     // Activer le bouton si au moins 1 article sélectionné
//     if (submitBtn) {
//         submitBtn.disabled = false;
//         const submitBtnText = document.getElementById('submitBtnText');
//         if (submitBtnText) submitBtnText.textContent = 'Enregistrer';
//     }

//     updateMontant();
// }

// function showDropdown(items) {
//     const { searchInput, dropdown } = getEls();
//     if (!dropdown) return;

//     dropdown.innerHTML = '';
//     if (items.length === 0) {
//         dropdown.style.display = 'none';
//         return;
//     }

//     items.forEach(function (a) {
//         const li = document.createElement('li');
//         li.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
//         const alreadySelected = selected.some(s => s.id === a.id);

//         li.innerHTML = `
//             <div>
//                 <strong>${a.nom}</strong> 
//                 <div class="small text-muted" name="articles">${a.marque ? a.marque + ' - ' : ''}${a.categorie} - Ref: ${a.reference}</div>
//             </div>
//             <span class="badge bg-primary rounded-pill">${formatPrix(a.prix)}</span>
//         `;  

//         if (!alreadySelected) {
//             li.style.cursor = 'pointer';
//             li.addEventListener('click', function () {
//                 selected.push(a);
//                 renderTags();
//                 if (searchInput) searchInput.value = '';
//                 dropdown.style.display = 'none';
//             });
//         } else {
//             li.style.opacity = '0.55';
//             li.style.cursor = 'default';
//         }

//         dropdown.appendChild(li);
//     });

//     dropdown.style.display = 'block';
// }

// function filterAndShow(q) {
//     if (!q || articles.length === 0) return [];
    
//     return articles.filter(a =>
//         (a.nom && a.nom.toLowerCase().includes(q)) ||
//         (a.marque && a.marque.toLowerCase().includes(q)) ||
//         (a.categorie && a.categorie.toLowerCase().includes(q)) ||
//         (a.reference && a.reference.toLowerCase().includes(q))
//     );
// }

// function bindSearchEvents() {
//     const { searchInput, dropdown } = getEls();

//     if (!searchInput || !dropdown) {
//         console.warn('Éléments de recherche non trouvés');
//         return;
//     }

//     searchInput.addEventListener('input', function () {
//         const q = this.value.trim().toLowerCase();
//         if (!q) {
//             dropdown.style.display = 'none';
//             return;
//         }
        
//         if (articles.length === 0) {
//             console.warn('Aucun article chargé');
//             dropdown.style.display = 'none';
//             return;
//         }
        
//         showDropdown(filterAndShow(q));
//     });

//     searchInput.addEventListener('focus', function () {
//         const q = this.value.trim().toLowerCase();
//         if (q && articles.length > 0) {
//             showDropdown(filterAndShow(q));
//         }
//     });

//     document.addEventListener('click', function (e) {
//         if (searchInput && dropdown && 
//             !searchInput.contains(e.target) && 
//             !dropdown.contains(e.target)) {
//             dropdown.style.display = 'none';
//         }
//     });
// }

// function loadArticles() {
//     if (articlesLoaded) return Promise.resolve();
//     return fetch("/produit/list")
//         .then(res => {
//             if (!res.ok) throw new Error(`HTTP ${res.status}`);
//             return res.json();
//         })
//         .then(response => {
            
//             if (response.data && Array.isArray(response.data)) {
//                 if (response.data.length === 0) {
//                     console.warn('Aucun produit trouvé dans la base de données');
//                     articles = [];
//                     articlesLoaded = true;
//                     return;
//                 }
                
//                 const avant = response.data.length;
//                 articles = response.data
//                     .map(pdt => ({
//                         id: pdt.id,
//                         nom: pdt.nom || '',
//                         prix: parseFloat(pdt.prix_vente) || 0,
//                         reference: pdt.reference || '',
//                         categorie: pdt.categorie || '',
//                         quantite: parseInt(pdt.quantite) || 0,
//                         statut: pdt.status || ''
//                     }))
//                     .filter(pdt => {
//                         // Accepter les produits avec quantité > 0 ET statut valide
//                         const hasQuantity = pdt.quantite > 0;
//                         const validStatus = ['En stock'].includes(pdt.statut);
//                         const match = hasQuantity && validStatus;
                        
//                         if (!match) {
//                             console.log(`Filtré: "${pdt.nom}" (statut=${pdt.statut}, qty=${pdt.quantite})`)
//                         }
//                         return match;
//                     });
                
//                 console.log(`${articles.length}/${avant} articles chargés (filtrés)`);
//                 articlesLoaded = true;
//             } else {
//                 console.error('Format réponse incorrect:', response);
//                 articles = [];
//             }
//         })
//         .catch(error => {
//             console.error('Erreur chargement articles:', error);
//             articles = [];
//         });
// }

// function initModal() {
//     const modalEl = document.getElementById('exampleModal');
//     if (modalEl) {
//         modalEl.addEventListener('show.bs.modal', function () {
//             console.log('Modal ouvert');
            
//             // Désactiver le bouton pendant le chargement
//             const submitBtn = document.getElementById('submitBtn');
//             const submitBtnText = document.getElementById('submitBtnText');
//             if (submitBtn) {
//                 submitBtn.disabled = true;
//                 if (submitBtnText) submitBtnText.textContent = 'Chargement des articles...';
//             }
            
//             selected = [];
//             renderTags();
//             updateMontant();

//             loadArticles().then(() => {
//                 console.log('✅ Articles chargés, en attente de sélection');
                
//                 setTimeout(() => {
//                     bindSearchEvents();
//                 }, 50);
//             });
//         });
//     } else {
//         console.warn('Modal #exampleModal non trouvé');
//     }
// }

// function initFormSubmit() {
//     // Gestion de la soumission du formulaire
//     const venteForm = document.getElementById('venteForm');
//     const addBtn = document.getElementById('submitBtn');
//     if (addBtn) {
//         addBtn.addEventListener('click', async function() {
            
//             console.log('📝 Tentative de soumission...');
//             console.log('📦 Articles sélectionnés:', selected);
//             console.log('📦 selected length:',selected.length);
            
//             if (selected.length == 0) {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Erreur',
//                     text: 'Veuillez sélectionner au moins un article',
//                     confirmButtonColor: '#3d6dff'
//                 });
//                 return;
//             }
            
//             // Remplir le champ hidden EN PREMIER avant toute validation
//             const articlesHidden = document.getElementById('articlesHidden');
//             const articlesTransformed = selected.map(a => ({
//                 id_produit: a.id,
//                 prix_unitaire: a.prix,
//                 quantite: 1
//             }));
//             if (articlesHidden) articlesHidden.value = JSON.stringify(articlesTransformed);

//             console.log('✅ Articles à envoyer:', articlesTransformed);

//             const nomClient = document.getElementById('nomClient');
//             const telClient = document.getElementById('telClient');
            
//             if (!nomClient || !telClient) {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Erreur',
//                     text: 'Nom et téléphone du client sont obligatoires',
//                     confirmButtonColor: '#3d6dff'
//                 });
//                 return;
//             }
            
//             if (!nomClient.value.trim() || !telClient.value.trim()) {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Erreur',
//                     text: 'Nom et téléphone du client sont obligatoires',
//                     confirmButtonColor: '#3d6dff'
//                 });
//                 return;
//             }
            
//             // Désactiver le bouton et afficher le loader
//             const submitBtn = document.getElementById('submitBtn');
//             const originalText = submitBtn.innerHTML;
//             submitBtn.disabled = true;
//             submitBtn.innerHTML = '<i class="bx bx-loader-circle bx-spin me-2"></i>Enregistrement...';
            
//             try {
//                 const formData = new FormData(venteForm);
//                 const response = await fetch('/vente/add', {
//                     method: 'POST',
//                     body: formData
//                 });
                
//                 const data = await response.json();
                
//                 if (data.success) {
//                     Swal.fire({
//                         icon: 'success',
//                         title: 'Succès',
//                         text: 'Vente enregistrée avec succès!',
//                         confirmButtonColor: '#3d6dff',
//                         timer: 2000
//                     }).then(() => {
//                         // Fermer le modal
//                         const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
//                         if (modal) modal.hide();
                        
//                         // Réinitialiser le formulaire
//                         if (venteForm) venteForm.reset();
//                         selected = [];
//                         renderTags();
//                         updateMontant();
                        
//                         // Optionnel: recharger la page après un délai
//                         setTimeout(() => {
//                             window.location.reload();
//                         }, 1000);
//                     });
//                 } else {
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Erreur',
//                         text: data.error || 'Erreur lors de l\'enregistrement',
//                         confirmButtonColor: '#3d6dff'
//                     });
//                 }
//             } catch (error) {
//                 console.error('Erreur:', error);
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Erreur',
//                     text: 'Erreur lors de l\'envoi du formulaire',
//                     confirmButtonColor: '#3d6dff'
//                 });
//             } finally {
//                 // Réactiver le bouton
//                 submitBtn.disabled = false;
//                 submitBtn.innerHTML = originalText;
//             }
//         });
//     } else {
//         console.warn('Formulaire #venteForm non trouvé');
//     }
// }

// // Initialisation au chargement de la page
// function init() {
//     loadArticles();
//     initModal();
//     initFormSubmit();
// }

// // Attendre que le DOM soit chargé
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', init);
// } else {
//     init();
// }
    
// }
console.log("COUCOU");