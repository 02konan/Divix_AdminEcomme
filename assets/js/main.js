new PureCounter();

/* ── Données par période ── */
const ranges = {
    '7j': {
    labels: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
    revenus: [3200, 4100, 3800, 5200, 4700, 3100, 2900],
    visites: [820, 1050, 970, 1300, 1180, 780, 610],
    bars:    [38, 52, 44, 61, 55, 30, 27]
    },
    '30j': {
    labels:  ['S1','S2','S3','S4'],
    revenus: [18400, 22100, 19800, 23900],
    visites: [4600, 5500, 4950, 5980],
    bars:    [210, 260, 235, 285]
    },
    '90j': {
    labels:  ['Jan','Fév','Mar'],
    revenus: [58000, 71000, 84200],
    visites: [14500, 17750, 21050],
    bars:    [690, 840, 990]
    }
};

let lineChart, barChart, doughnutChart;

/* ── Line chart double axe ── */
function buildLine(r) {
    const d = ranges[r];
    if (lineChart) lineChart.destroy();
    const lineChartEl = document.getElementById('lineChart');
    if (!lineChartEl) {
        console.warn('Élément #lineChart non trouvé');
        return;
    }
    lineChart = new Chart(lineChartEl, {
    type: 'line',
    data: {
        labels: d.labels,
        datasets: [
        {
            label: 'Revenus',
            data: d.revenus,
            borderColor: '#378ADD',
            backgroundColor: 'rgba(55,138,221,.08)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#378ADD',
            tension: .4,
            fill: true
        },
        {
            label: 'Visites',
            data: d.visites,
            borderColor: '#1D9E75',
            backgroundColor: 'rgba(29,158,117,.06)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#1D9E75',
            tension: .4,
            fill: true,
            yAxisID: 'y2'
        }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: 'rgba(0,0,0,.75)', padding: 10, cornerRadius: 6 }
        },
        scales: {
        x: { grid: { color: 'rgba(0,0,0,.05)' }, ticks: { font: { size: 11 }, color: '#888' } },
        y: {
            grid: { color: 'rgba(0,0,0,.05)' },
            ticks: { font: { size: 11 }, color: '#888', callback: v => '€' + Math.round(v / 1000) + 'k' },
            position: 'left'
        },
        y2: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: '#1D9E75', callback: v => Math.round(v / 1000) + 'k' },
            position: 'right'
        }
        }
    }
    });
}

/* ── Bar chart ── */
function buildBar(r) {
    const barChartEl = document.getElementById('barChart');
    if (!barChartEl) {
        console.warn('Élément #barChart non trouvé');
        return;
    }

    const d = ranges[r];
    const target = d.bars.length > 4 ? 250 : 50;

    if (barChart) barChart.destroy();

    const ctx = barChartEl.getContext('2d');

    // 🎨 Création du dégradé (vertical)
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, '#3d6dff');   // couleur en haut
    gradient.addColorStop(1, '#008cff');   // couleur en bas

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: d.labels,
            datasets: [
                {
                    label: 'En cours',
                    data: d.bars,
                    backgroundColor: '#1C1C1C',
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Dernière',
                    data: d.bars.map(() => target),
                    backgroundColor: gradient, // 👈 dégradé ici
                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,.75)',
                    padding: 10,
                    cornerRadius: 6
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 }, color: '#888' }
                },
                y: {
                    grid: { color: 'rgba(0,0,0,.05)' },
                    ticks: { font: { size: 11 }, color: '#888' }
                }
            }
        }
    });
}

/* ── Doughnut (une seule fois) ── */
function buildDoughnut() {
    const doughnutChartEl = document.getElementById('doughnutChart');
    if (!doughnutChartEl) {
        console.warn('Élément #doughnutChart non trouvé');
        return;
    }
    doughnutChart = new Chart(doughnutChartEl, {
    type: 'doughnut',
    data: {
        labels: ['Organique','Direct','Référent','Payant'],
        datasets: [{
        data: [42, 28, 18, 12],
        backgroundColor: ['#378ADD','#7F77DD','#1D9E75','#EF9F27'],
        borderWidth: 0,
        hoverOffset: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: 'rgba(0,0,0,.75)', padding: 10, cornerRadius: 6 }
        }
    }
    });
}

/* ── Switcher période ── */
function setRange(r, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    buildLine(r);
    buildBar(r);
}

/* ── Init ── */
// Attendre le chargement du DOM avant d'initialiser les graphiques
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        buildBar('7j');
        const audio = document.getElementById('notificationSound');
        if (audio) {
            audio.volume = 1;
            audio.load();

            const unlockAudio = () => {
                audio.muted = true;
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.muted = false;
                    console.info('Notification audio déverrouillée');
                }).catch(error => {
                    audio.muted = false;
                    console.warn('Impossible de déverrouiller le son de notification :', error);
                });
            };
            document.addEventListener('click', unlockAudio, { once: true });
            document.addEventListener('keydown', unlockAudio, { once: true });
        }
    });
} else {
    buildBar('7j');
}

// Requête asynchrone pour la déconnexion
document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    fetch('./api/logout.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = './login.php';
        } else {
            console.error('Erreur lors de la déconnexion:', data.message);
        }
    })
    .catch(error => {
        console.error('Erreur réseau:', error);
    });
});


let isPlaying = false;

function playNotificationSound() {
    const audio = document.getElementById('notificationSound');
    if (!audio || isPlaying) return;

    isPlaying = true;
    audio.currentTime = 0;
    audio.muted = false;
    audio.play().catch(error => {
        console.warn('Notification audio bloquée :', error);
        isPlaying = false;
    });

    audio.onended = () => {
        isPlaying = false; 
    };
}

let previousCommandCount = null;

setInterval(() => {
    const formData = new FormData();
    formData.append('action', 'getNumberCommandes');
    // Supprimé le paramètre page pour charger tous les produits

    fetch('./api/commandes.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            
           const badgeNewCommandes = document.getElementById('new_commandes')
           const currentCount = data.number;
           
            if (badgeNewCommandes) {
                badgeNewCommandes.textContent = data.number
            }

            if (previousCommandCount !== null && currentCount !== previousCommandCount && currentCount > previousCommandCount) {
                playNotificationSound();
            }

            previousCommandCount = currentCount;

        } else {
            console.warn('Polling commandes : réponse non succès', data);
        }
    })
    .catch(error => console.error('Erreur lors du polling des commandes:', error));
}, 2000);


