
// function calculerReste() {
//     const total = parseFloat(document.getElementById('montantTotal').value) || 0;
//     const verse = parseFloat(document.getElementById('versement').value) || 0;
//     const reste = total - verse;
//     document.getElementById('reste').value = reste.toLocaleString('fr-FR');
//     if (total <= verse) {
//          Swal.fire({
//                 icon: 'error',
//                 title: 'Erreur',
//                 text: 'desoler le Montant versé ne peut pas etre supperieur au Montant total dû',
//                 confirmButtonColor: '#3d6dff'
//             });
//     }
   
// }

 

// function Paiement() {
//     showDotsSpinner("tbody-paiement");

//     fetch("/paiement/list")
//         .then(res => res.json())
//         .then(response => {
//             if (response.data) affichepaiement(response.data);
//             if (response.counter) {
//                 updateCounters(response.counter);
//             }
//         })
//         .catch(err => {
//             console.error("Erreur lors du chargement des ventes :", err);
//             const container = document.getElementById("tbody-paiement");
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


// function affichepaiement(paiement) {
//     const container = document.getElementById("tbody-paiement");
//     if (!container) return;
//     container.innerHTML = "";

//     if (paiement && paiement.length > 0) {
//         paiement.forEach(vnt => {
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
//                <th scope="row"><input class="form-check-input" type="checkbox" value="" id="checkDefault"></th>
//                                 <td>
//                                     <div class="d-flex align-items-center gap-2">
                                    
//                                         <div class="">
//                                             <p class="m-0 p-0">Gorge Koffi</p>
//                                             <p class="text-muted small m-0 p-0">0789090076</p>
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td>T_66RTYIUGFYUTOUIUZT</td>
//                                 <td><span class="status-badge active">Espèce</span></td>
//                                 <td>
//                                     10 000
//                                 </td>
//                                 <td><span class="text-muted">25 Juillet 2023</span></td>
                            
//                                 <td class="no-print-col" style="text-align: end;">
//                                     <div class="btn-group">
//                                         <button class="btn btn-outline-secondary btn-sm td-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                                             <i class="bi bi-three-dots-vertical"></i>
//                                         </button>
//                                         <ul class="dropdown-menu shadow-sm" style="z-index: 109;">
//                                             <li><a class="dropdown-item" href="#">
//                                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
//                                                     <path d="M12 22c5.51 0 10-4.49 10-10S17.51 2 12 2 2 6.49 2 12s4.49 10 10 10M11 7h2v2h-2zm0 4h2v6h-2z"></path>
//                                                 </svg>
//                                                 <span class="ms-2">Détails</span>
//                                             </a></li>
//                                             <li><a class="dropdown-item" href="#">
//                                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
//                                                     <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path>
//                                                 </svg>
//                                                 <span class="ms-2">Modifier</span>
//                                             </a></li>
//                                             <li><hr class="dropdown-divider"></li>
//                                             <li><a class="dropdown-item text-danger" href="#">
//                                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
//                                                     <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
//                                                 </svg>
//                                                 <span class="ms-2">Supprimer</span>
//                                             </a></li>
//                                         </ul>
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
// let debounceTimer;

// document.getElementById("refFacture").addEventListener("input", function () {
//     const reference = this.value.trim();

//     if (reference.length < 3) {
//         document.getElementById("montantTotal").value = "";
//         return;
//     }

//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => {
//         PaiementReference(reference);
//     }, 500);
// });

// async function PaiementReference(reference) {
//     try {
//         const response = await fetch(`/paiement/list/${reference}`);

//         if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

//         const result = await response.json();

//         if (result.data.length === 0) {
//             document.getElementById("montantTotal").value = "";
//             return;
//         }

//         document.getElementById("montantTotal").value = result.data[0].montant;

//     } catch (error) {
//         console.error("Erreur:", error);
//         document.getElementById("montantTotal").value = "";
//     }
// }
// const paiementForm = document.getElementById('paiementForm');
// const addPaiementBtn = document.getElementById('submitPaiementBtn');
// if (addPaiementBtn) {
//     addPaiementBtn.addEventListener('click', async function() {

//         const originalText = addPaiementBtn.innerHTML;
//         addPaiementBtn.disabled = true;
//         addPaiementBtn.innerHTML = '<i class="bx bx-loader-circle bx-spin me-2"></i>Enregistrement...';
        
//         try {
//             const formData = new FormData(paiementForm);
//             const response = await fetch('/paiement/add', {
//                 method: 'POST',
//                 body: formData
//             });
            
//             const data = await response.json();
//             console.log(data)
            
//             if (data.success) {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Succès',
//                     text: data.message,
//                     confirmButtonColor: '#3d6dff',
//                     timer: 1000
//                 }).then(() => {
//                     // Fermer le modal
//                     const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
//                     if (modal) modal.hide();
                    
//                     // Réinitialiser le formulaire
//                     if (paiementForm) paiementForm.reset();
//                     Produits();
//                     // Optionnel: recharger la page après un délai
//                     // setTimeout(() => {
//                     //     window.location.reload();
//                     // }, 1000);
//                 });
//             } else {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Erreur',
//                     text: data.error || 'Erreur lors de l\'enregistrement',
//                     confirmButtonColor: '#3d6dff'
//                 });
//             }
//         } catch (error) {
//             console.error('Erreur:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Erreur',
//                 text: 'Erreur lors de l\'envoi du formulaire',
//                 confirmButtonColor: '#3d6dff'
//             });
//         } finally {
//             addPaiementBtn.disabled = false;
//             addPaiementBtn.innerHTML = originalText;
//         }
//     });
// } else {
//     console.warn('Formulaire #venteForm non trouvé');
// }

// document.getElementById('datePaiement').valueAsDate = new Date();
console.log("COUCOU");