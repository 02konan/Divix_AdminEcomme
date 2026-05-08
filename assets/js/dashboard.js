// // dashboard.js - Gestion des données du dashboard via API

// class DashboardAPI {
//     constructor() {
//         this.baseURL = window.location.origin;
//         this.data = {};
//     }

//     /**
//      * Récupère toutes les données du dashboard
//      */
//     async fetchDashboardData() {
//         try {
//             this.showDotsSpinner("dernieres-ventes-body")
//             this.showCounterSkeleton();
//             const response = await fetch(`${this.baseURL}/dashboard/data`);
//             const result = await response.json();

//             if (result.success) {
//                 this.hideCounterSkeleton();
//                 this.data = result.data;
//                 return this.data;
//             } else {
//                 throw new Error(result.error || 'Erreur lors de la récupération des données');
//             }
//         } catch (error) {
//             console.error('Erreur fetchDashboardData:', error);
//             throw error;
//         }
//     }

//     showCounterSkeleton() {
//         const counters = ["total-clients", "total-ventes", "revenu-total", "revenu-jour", "revenu-jour-percentage", "revenu-percentage", "ventes-percentage", "clients-percentage"];
//         counters.forEach(id => {
//             const el = document.getElementById(id);
//             if (el && !el.textContent) {
//                 el.classList.add('counter-skeleton');
//             }
//         });
//     }
//     hideCounterSkeleton() {
//         const counters = ["total-clients", "total-ventes", "revenu-total", "revenu-jour", "revenu-jour-percentage", "revenu-percentage", "ventes-percentage", "clients-percentage"];
//         counters.forEach(id => {
//             const el = document.getElementById(id);
//             if (el) {
//                 el.classList.remove('counter-skeleton');
//             }
//         });
//     }

//     animateNumber(element, start, end, duration) {
//         let startTimestamp = null;
//         const step = (timestamp) => {
//             if (!startTimestamp) startTimestamp = timestamp;
//             const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//             element.textContent = Math.floor(progress * (end - start) + start);
//             if (progress < 1) {
//                 window.requestAnimationFrame(step);
//             }
//         };
//         window.requestAnimationFrame(step);
//     }
//     // Fonction pour afficher le spinner dots
//     showDotsSpinner(containerId) {
//         const container = document.getElementById(containerId);
//         if (container) {
//             container.innerHTML = `
//                 <tr class="line-nothing">
//                     <td colspan="10" class="table-spinner nothing">
//                         <div class="dots-loader m-0">
//                             <span></span>
//                             <span></span>
//                             <span></span>
//                         </div>
//                         <p class="text-muted small m-0 mt-2 mb-0">Chargement des données...</p>
//                     </td>
//                 </tr>
//             `;
//         }
//     }

//     /**
//      * Met à jour l'affichage des métriques principales
//      */
//     updateMetrics() {
//         // Total clients
//         const totalClientsEl = document.getElementById('total-clients');
//         if (totalClientsEl) {
//             let dataTotalClient = this.data.total_clients || 0;
//             this.animateNumber(totalClientsEl, 0, parseFloat(dataTotalClient), 1000);
//         }

//         // Pourcentage clients
//         const clientsPercentEl = document.getElementById('clients-percentage');
//         if (clientsPercentEl) {
//             const percent = this.data.pourcentages?.clients || 0;
//             clientsPercentEl.textContent = `${percent >= 0 ? '+' : ''}${percent}% ce mois`;
//             clientsPercentEl.className = `ms-auto badge ${percent >= 0 ? 'badge-success' : 'badge-danger'}`;
//         }

//         // Total ventes
//         const totalVentesEl = document.getElementById('total-ventes');
//         if (totalVentesEl) {
//             let dataTotalVente = this.data.total_ventes || 0;
//             this.animateNumber(totalVentesEl, 0, parseFloat(dataTotalVente), 1000);
//         }

//         // Pourcentage ventes
//         const ventesPercentEl = document.getElementById('ventes-percentage');
//         if (ventesPercentEl) {
//             const percent = this.data.pourcentages?.ventes || 0;
//             const classeBadge = ""
//             ventesPercentEl.textContent = `${percent >= 0 ? '+' : ''}${percent}% ce mois`;
//             ventesPercentEl.className = `ms-auto badge ${percent >= 0 ? 'badge-success' : 'badge-danger'}`;
//         }

//         // Revenu total
//         const revenuTotalEl = document.getElementById('revenu-total');
//         if (revenuTotalEl) {
//             const montant = this.data.revenu_total || 0;
//             this.animateNumber(revenuTotalEl, 0, parseFloat(montant), 1000);
//         }

//         // Pourcentage revenu
//         const revenuPercentEl = document.getElementById('revenu-percentage');
//         if (revenuPercentEl) {
//             const percent = this.data.pourcentages?.revenu || 0;
//             revenuPercentEl.textContent = `${percent >= 0 ? '+' : ''}${percent}% ce mois`;
//             revenuPercentEl.className = `ms-auto badge ${percent >= 0 ? 'badge-success' : 'badge-danger'}`;
//         }

//         // Revenu du jour
//         const revenuJourEl = document.getElementById('revenu-jour');
//         if (revenuJourEl) {
//             const montant = this.data.revenu_jour || 0;
//             this.animateNumber(revenuJourEl, 0, parseFloat(montant), 1000);
//         }

//         // Pourcentage revenu du jour (calculé par rapport à hier)
//         const revenuJourPercentEl = document.getElementById('revenu-jour-percentage');
//         if (revenuJourPercentEl) {
//             // Pour l'instant, on utilise une valeur statique ou on peut calculer
//             revenuJourPercentEl.textContent = '+30% Aujourd\'hui';
//             revenuJourPercentEl.className = 'ms-auto badge badge-success';
//         }
//     }
    
//     /**
//      * Met à jour le graphique des ventes par jour
//      */
//     updateVentesChart() {
//         const chartContainer = document.getElementById('ventes-chart');
//         if (!chartContainer) return;

//         const ventesData = this.data.ventes_par_jour || [];
//         if (ventesData.length === 0) {
//             chartContainer.innerHTML = '<div class="text-center text-muted"><p>Aucune donnée de ventes disponible</p></div>';
//             return;
//         }

//         chartContainer.innerHTML = '<canvas id="barChart"></canvas>';
//         const barChartEl = document.getElementById('barChart');
//         const ctx = barChartEl.getContext('2d');

//         const labels = ventesData.map(item => item.date);
//         const ventes = ventesData.map(item => item.nombre_ventes);
//         const revenus = ventesData.map(item => item.revenu);

//         if (this.barChart) {
//             this.barChart.destroy();
//         }

//         const gradient = ctx.createLinearGradient(0, 0, 0, 300);
//         gradient.addColorStop(0, '#3d6dff');
//         gradient.addColorStop(1, '#1C1C1C');

//         this.barChart = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels,
//                 datasets: [
//                     {
//                         label: 'Ventes',
//                         data: ventes,
//                         backgroundColor: '#1C1C1C',
//                         borderRadius: 6,
//                         borderSkipped: false
//                     },
//                     {
//                         type: 'line',
//                         label: 'Revenu',
//                         data: revenus,
//                         borderColor: '#3d6dff',
//                         backgroundColor: 'rgba(61,109,255,0.16)',
//                         borderWidth: 2,
//                         tension: 0.35,
//                         fill: true,
//                         yAxisID: 'y1',
//                         pointRadius: 3,
//                         pointBackgroundColor: '#3d6dff'
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: { display: true, labels: { color: '#444' } },
//                     tooltip: {
//                         backgroundColor: 'rgba(0,0,0,.75)',
//                         padding: 10,
//                         cornerRadius: 6,
//                         callbacks: {
//                             label: context => {
//                                 if (context.dataset.type === 'line') {
//                                     return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
//                                 }
//                                 return `${context.dataset.label}: ${context.parsed.y} ventes`;
//                             }
//                         }
//                     }
//                 },
//                 scales: {
//                     x: {
//                         grid: { display: false },
//                         ticks: { font: { size: 11 }, color: '#888' }
//                     },
//                     y: {
//                         position: 'left',
//                         grid: { color: 'rgba(0,0,0,.05)' },
//                         ticks: { color: '#888', font: { size: 11 } }
//                     },
//                     y1: {
//                         position: 'right',
//                         grid: { display: false },
//                         ticks: {
//                             color: '#378ADD',
//                             font: { size: 11 },
//                             callback: value => `${value.toLocaleString('fr-FR')} FCFA`
//                         }
//                     }
//                 }
//             }
//         });
//     }

//     /**
//      * Met à jour le tableau des dernières ventes
//      */
//     updateDernieresVentes() {
//         const tableBody = document.getElementById('dernieres-ventes-body');
//         if (!tableBody || !this.data.dernieres_ventes) return;

//         let html = '';

//         if (this.data.dernieres_ventes.length === 0) {
//             html = '<tr><td colspan="5" class="text-center">Aucune vente trouvée</td></tr>';
//         } else {
//             this.data.dernieres_ventes.forEach(vente => {
//                 const statutClass = this.getStatutClass(vente.statut);
//                 html += `
//                     <tr>
//                         <td data-label="Nom" class="no-start">${vente.nom}</td>
//                         <td data-label="ID trans.">${vente.id_transaction}</td>
//                         <td data-label="Statut"><span class="statut ${statutClass}">${vente.statut}</span></td>
//                         <td data-label="Montant">${this.formatCurrency(vente.montant)}</td>
//                         <td data-label="Data">${vente.date}</td>
//                     </tr>
//                 `;
//             });
//         }

//         tableBody.innerHTML = html;
//     }

//     /**
//      * Formate un montant en devise FCFA
//      */
//     formatCurrency(amount) {
//         return new Intl.NumberFormat('fr-FR', {
//             style: 'decimal',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0
//         }).format(amount);
//     }

//     /**
//      * Retourne la classe CSS pour le statut
//      */
//     getStatutClass(statut) {
//         switch (statut) {
//             case 'Soldé':
//                 return 'statut-solde';
//             case 'Non Soldé':
//                 return 'statut-non-solde';
//             case 'Aucun paiement':
//                 return 'statut-aucun';
//             default:
//                 return 'statut-default';
//         }
//     }

//     /**
//      * Actualise toutes les données du dashboard
//      */
//     async refresh() {
//         try {
//             await this.fetchDashboardData();
//             this.updateMetrics();
//             this.updateVentesChart();
//             this.updateDernieresVentes();
//             console.log('Dashboard mis à jour avec succès');
//         } catch (error) {
//             console.error('Erreur lors de la mise à jour du dashboard:', error);
//             this.showError('Erreur lors du chargement des données');
//         }
//     }

//     /**
//      * Affiche un message d'erreur
//      */
//     showError(message) {
//         const errorEl = document.getElementById('dashboard-error');
//         if (errorEl) {
//             errorEl.textContent = message;
//             errorEl.style.display = 'block';
//             setTimeout(() => {
//                 errorEl.style.display = 'none';
//             }, 5000);
//         } else {
//             alert(message);
//         }
//     }

//     /**
//      * Initialise le dashboard
//      */
//     async init() {
//         // Chargement initial
//         await this.refresh();

//         // Actualisation automatique toutes les 5 minutes
//         setInterval(() => {
//             this.refresh();
//         }, 5 * 60 * 1000);
//     }
// }

// // Initialisation quand le DOM est chargé
// document.addEventListener('DOMContentLoaded', function() {
//     const dashboard = new DashboardAPI();
//     dashboard.init();

//     // Bouton de rafraîchissement manuel (optionnel)
//     const refreshBtn = document.getElementById('refresh-dashboard');
//     if (refreshBtn) {
//         refreshBtn.addEventListener('click', () => {
//             dashboard.refresh();
//         });
//     }
// });

// // Export pour utilisation dans d'autres fichiers
// window.DashboardAPI = DashboardAPI;

console.log("COUCOU");
