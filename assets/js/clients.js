// document.addEventListener("DOMContentLoaded", () => {
//     Client();
// });

// // Fonction pour afficher le spinner dots
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

// // Version avec skeleton
// function showCounterSkeleton() {
//     const counters = ["counterTotalClient", "counterSolde", "counterNonSolde"];
//     counters.forEach(id => {
//         const el = document.getElementById(id);
//         if (el) {
//             el.classList.add('counter-skeleton');
//         }
//     });
// }

// function hideCounterSkeleton() {
//     const counters = ["counterTotalClient", "counterSolde", "counterNonSolde"];
//     counters.forEach(id => {
//         const el = document.getElementById(id);
//         if (el) {
//             el.classList.remove('counter-skeleton');
//         }else{
//             console.log('>>>> id:', id);
//         }
//     });
// }

// function Client() {
//     showCounterSkeleton();
//     showDotsSpinner("tbody-client");
    
//     fetch("/client/list")
//         .then(res => res.json())
//         .then(response => {
//             console.log("FULL RESPONSE:", response);          // ← ajoute ça
//             console.log("COUNTER:", response.counter);  
//             hideCounterSkeleton();
            
//             if (response.data) afficheclient(response.data);
//             if (response.counter) {
//                 updateCounters(response.counter);
//             }
//         })
//         .catch(err => {
//             console.error("Erreur clients:", err);
//             hideCounterSkeleton(); // Aussi en cas d'erreur
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
//     if (!counterData){
//         return;
//     }

    
        
//     const counters = [
//         { id: "counterTotalClient", value: counterData.total_clients },
//         { id: "counterSolde", value: counterData.clients_avec_commandes_soldees },
//         { id: "counterNonSolde", value: counterData.clients_avec_commandes_non_soldees }
//     ];
    
//     counters.forEach(counter => {
//         const element = document.getElementById(counter.id);
//         if (element && typeof counter.value === 'number') {
//             animateNumber(element, 0, counter.value, 1000);
//         }
//     });
// }

// function afficheclient(clients) {
//     const container = document.getElementById("tbody-client");
//     if (!container) return; 
//     container.innerHTML = "";


//     if(clients && clients.length > 0){
//         console.log(clients);
        
//         clients.forEach(clt => {
//             const dateObj = new Date(clt.date);
//             const dateFormatee = dateObj.toLocaleString('fr-FR', {
//                 year: 'numeric', month: 'long', day: 'numeric'
//             });
    
//             const initiales = clt.nom.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
//             const item = document.createElement("tr");
    
//             item.innerHTML = `
//                 <th scope="row"><input class="form-check-input" type="checkbox" value=""></th>
//                 <td data-label="Client">
//                     <div class="d-flex align-items-center gap-2">
//                         <div class="avatar-initials bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-semibold" style="width:34px;height:34px;font-size:13px;flex-shrink:0">
//                             ${initiales}
//                         </div>
//                         <div><p class="m-0 p-0">${clt.nom}</p></div>
//                     </div>
//                 </td>
//                 <td data-label="Contact">
//                     <p class="m-0 p-0">${clt.telephone}</p>
//                 </td>
//                 <td data-label="Localisation">
//                     <p class="m-0 p-0">${clt.localisation}</p>
//                 </td>
//                 <td data-label="Email"><span class="text-muted">${clt.email}</span></td>
//                 <td data-label="Date"><span class="text-muted">${dateFormatee}</span></td>
//                 <td data-label="Action" class="no-print-col" style="text-align:end;">
//                     <div class="btn-group">
//                         <button class="btn btn-outline-secondary btn-sm td-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                             <i class="bi bi-three-dots-vertical"></i>
//                         </button>
//                         <ul class="dropdown-menu shadow-sm" style="z-index:109;">
//                             <li><a class="dropdown-item" href="#"><span class="ms-2">Détails</span></a></li>
//                             <li><a class="dropdown-item" href="#"><span class="ms-2">Modifier</span></a></li>
//                             <li><hr class="dropdown-divider"></li>
//                             <li><a class="dropdown-item text-danger" href="#" data-id="${clt.id}"><span class="ms-2">Supprimer</span></a></li>
//                         </ul>
//                     </div>
//                 </td>
//             `;
//             container.appendChild(item);
//         });
//     }else{
//         container.innerHTML = `
//                 <tr class="line-nothing">
//                     <td  colspan="10" class="text-center py-5 nothing">
//                         <div class="text-center">
//                             <i class="bi bi-inbox fs-1 text-muted"></i>
//                             <p class="text-muted mt-2 mb-0">Aucun client trouvé</p>
//                         </div>
//                     </td>
//                 </tr>
//             `;
//     }

// }

// const clientForm = document.getElementById('clientForm')

// if (clientForm) {

//     clientForm.addEventListener('submit', async  (e) => {
//         e.preventDefault()

//         // Désactiver le bouton et afficher le loader
//         const addClientBtn = document.getElementById('addClientBtn')
//         const originalText = addClientBtn.innerHTML;
//         addClientBtn.disabled = true;
//         addClientBtn.innerHTML = '<i class="bx bx-loader-circle bx-spin me-2"></i>Enregistrement...';
        
//         try {
//             const formData = new FormData(clientForm);
//             const response = await fetch('/client/add', {
//                 method: 'POST',
//                 body: formData
//             });
            
//             const data = await response.json();
            
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
//                     if (clientForm) clientForm.reset();
//                     Client()
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
//             // Réactiver le bouton
//             addClientBtn.disabled = false;
//             addClientBtn.innerHTML = originalText;
//         }
//     })
    
// }

console.log("COUCOU");