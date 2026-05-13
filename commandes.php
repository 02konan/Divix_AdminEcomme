<?php include('./includes/header.php') ?>
<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasDetailsCommandes">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title">Détails commande</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
        <!-- Informations commande -->
        <h6 class="mb-3">Informations commande</h6>
        <div id="commandeDetailsInfo"></div>
        
        <hr class="my-4">
        
        <!-- Informations client -->
        <h6 class="mb-3">Informations client</h6>
        <div id="commandeDetailsClient"></div>
        
        <hr class="my-4">
        
        <!-- Liste des produits -->
        <h6 class="mb-3">Produits commandés</h6>
        <div id="commandeDetailsProduits"></div>
    </div>
    <div class="offcanvas-footer">
        <!-- Actions -->
        <div class="p-3 border-top d-flex gap-2">
            <button class="btn btn-sm btn-success d-flex align-items-center" id="livree" data-commande-id="" date-statut="livree"><i class="bx bx-scooter-delivery me-2"></i>Livrer</button>
            <button class="btn btn-sm btn-primary d-flex align-items-center me-auto" id="expediee" data-commande-id="" date-statut="expediee"><i class="bx bx-box-alt me-2"></i>Expédier</button>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <div class="icon me-2">
            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
                fill="currentColor" viewBox="0 0 24 24" >
                <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
                <path d="M12 2C9.24 2 7 4.24 7 7v1H4c-.55 0-1 .45-1 1v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-.55-.45-1-1-1h-3V7c0-2.76-2.24-5-5-5M9 7c0-1.65 1.35-3 3-3s3 1.35 3 3v1H9z"></path>
            </svg>
        </div>
        <div class="">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Nouvelle vente</h1>
            <span class="small text-muted">Formulaire d'ajout de vente</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form action="" class="vstack g-2">
            
            <fieldset>
                <legend>
                    Personnelles
                </legend>
                <div class="d-flex  gap-2">
                    <div class="col mb-3">
                        <label for="" class="form-label">Nom complet</label>
                        <input type="text" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                </div>
                <div class="d-flex  gap-2">
                    <div class="col mb-3">
                        <label for="" class="form-label">Commune</label>
                        <input type="text" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                    <div class="col mb-3">
                        <label for="" class="form-label">Quartier</label>
                        <input type="text" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>
                    Coordonnées
                </legend>
                <div class="col mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                </div>
                <div class="d-flex  gap-2">
                    <div class="col mb-3">
                        <label for="" class="form-label">Contact</label>
                        <input type="text" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                    <div class="col mb-3">
                        <label for="" class="form-label">Whatsapp</label>
                        <input type="text" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                </div>
            </fieldset>
            
            <fieldset>
                <legend>
                    Articles
                </legend>
                <div class="d-flex gap-2">
                    <div class="col mb-2">
                        <label class="form-label">Article</label>
                        <div class="position-relative">
                            <input type="text" class="form-control" id="articleSearch" placeholder="Rechercher un article..." autocomplete="off">
                            <ul class="list-group position-absolute w-100 shadow-sm" id="articleDropdown" style="display:none; max-height:180px; overflow-y:auto; top:100%; left:0; z-index:1055;"></ul>
                        </div>
                        <!-- Box articles sélectionnés -->
                        <div id="selectedArticlesBox" class="mt-2 p-2 rounded border bg-light">
                            <div class="d-flex flex-wrap gap-2 py-1 ps-1" id="selectedArticlesTags">
                                Auncun article selectionné
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>

            
            <fieldset>
                <legend>
                    Paiement
                </legend>
                <div class="d-flex gap-2">
                    <div class="col-3 mb-3">
                        <label for="" class="form-label">Statut</label>
                        <select class="form-select" name="" id="">
                            <option value="" selected disabled>--choisir--</option>
                            <option value="">Partiel</option>
                            <option value="">Total</option>
                        </select>
                    </div>
                    <div class="col mb-3">
                        <label for="" class="form-label">Montant total</label>
                        <input type="text" class="form-control" id="montantTotal" readonly placeholder="0 FCFA" disabled>
                    </div>
                    <div class="col mb-3">
                        <label for="" class="form-label">Versement</label>
                        <input type="text" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <div class="col mb-3">
                        <label for="" class="form-label">Frequence de paiement</label>
                        <select class="form-select" name="" id="">
                            <option value="" selected disabled>--choisir--</option>
                            <option value="">Mensuel</option>
                            <option value="">Hebdomadaire</option>
                            <option value="">Quotidienne</option>
                        </select>
                    </div>
                    <div class="col-3 mb-3">
                        <label for="" class="form-label">Durée</label>
                        <input type="number" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                </div>
            </fieldset>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
        <button type="button" class="btn btn-primary">Enregistrer</button>
      </div>
    </div>
  </div>
</div>
<div class="content-wrapper d-flex flex-column gap-3">
    <div class="add-box d-flex align-items-center w-100 px-2 gap-2">
        <p class="m-0"><span class="text-muted">Dashboard / </span><span class="fw-medium">Commandes</span></p>
        <button class="ms-auto btn btn-sm btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                fill="currentColor" viewBox="0 0 24 24" >
                <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
                <path d="m21.8 6.4-2.7-3.6c-.38-.5-.97-.8-1.6-.8h-11c-.63 0-1.23.3-1.6.8L2.2 6.4h.01c-.13.18-.21.37-.21.6v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-.23-.09-.42-.21-.59h.01ZM13 14v4h-2v-4H8l4-4 4 4zM5 6l1.5-2h11L19 6z"></path>
            </svg>
            <span class="mx-1">Exporter
            </span>
        </button>
        <button class=" btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                fill="currentColor" viewBox="0 0 24 24" >
                <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"></path>
            </svg>
            <span class="mx-1">Commande</span>
        </button>
    </div>
    <div class="w-100 row g-3 px-0 mx-0">
        <div class="col-md-4 col-lg-4 card-group">
            <div class="card feature-card border-0 shadow-sm p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-center gap-2">
                        <div class="icon">
                            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                                fill="currentColor" viewBox="0 0 24 24" >
                                <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
                                <path d="M12 2C9.24 2 7 4.24 7 7v1H4c-.55 0-1 .45-1 1v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-.55-.45-1-1-1h-3V7c0-2.76-2.24-5-5-5M9 7c0-1.65 1.35-3 3-3s3 1.35 3 3v1H9z"></path>
                            </svg>
                        </div>
                        <span class="small text-muted">Total commandes</span>
                    </div>
                    <!-- <span class="ms-auto badge badge-success">+12% ce John Does</span> -->
                </div>
                <h1 class="mt-2"><span id="countertotal_commandes"></span></h1>
            </div>
        </div>
        <div class="col-md-4 col-lg-4 card-group">
            <div class="card feature-card border-0 shadow-sm p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-center gap-2">
                        <div class="icon">
                            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                                fill="currentColor" viewBox="0 0 24 24" >
                                <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
                                <path d="M20 7H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2h-5c-1.1 0-2-.9-2-2v-3c0-1.1.9-2 2-2h5V9c0-1.1-.9-2-2-2"></path><path d="M17 13h5v3h-5zm-.43-10.82a1 1 0 0 0-.93-.11L8.01 5H17V3c0-.33-.16-.64-.43-.82"></path>
                            </svg>
                        </div>
                        <span class="small text-muted">Montant des commandes</span>
                    </div>
                    <span class="ms-auto badge badge-success">Cummulé</span>
                </div>
                <h1 class="mt-2"><span id="counterchiffre_affaire"></span><span class="small franc text-muted"> FCFA</span></h1>
            </div>
        </div>
        <div class="col-md-4 col-lg-4 card-group">
            <div class="card feature-card border-0 shadow-sm p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-center gap-2">
                        <div class="icon">
                            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                                fill="currentColor" viewBox="0 0 24 24" >
                                <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
                                <path d="M12 2C8.02 2 4 3.37 4 6v12c0 2.63 4.02 4 8 4s8-1.37 8-4V6c0-2.63-4.02-4-8-4m0 18c-3.72 0-6-1.29-6-2v-1.27c1.54.84 3.78 1.27 6 1.27s4.46-.43 6-1.27V18c0 .71-2.28 2-6 2m0-4c-3.72 0-6-1.29-6-2v-1.27c1.54.84 3.78 1.27 6 1.27s4.46-.43 6-1.27V14c0 .71-2.28 2-6 2m0-4c-3.72 0-6-1.29-6-2V8.73C7.54 9.57 9.78 10 12 10s4.46-.43 6-1.27V10c0 .71-2.28 2-6 2m0-4C8.28 8 6 6.71 6 6s2.28-2 6-2 6 1.29 6 2-2.28 2-6 2"></path>
                            </svg>
                        </div>
                        <span class="small text-muted">Rev. Journalié</span>
                    </div>
                    <span class="ms-auto badge badge-success">Cummulé</span>
                </div>
                <h1 class="mt-2"><span id="counterchiffre_affaire_jour"></span><span class="small franc text-muted"> FCFA</span></h1>
            </div>
        </div>
    </div>
    <div class="w-100 row g-3 px-0 mx-0">
        <div class="col-md-12 col-lg-12 card-group">
            <div class="card feature-card border-0 shadow-sm p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-center gap-2">
                        <div class="icon">
                            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                                fill="currentColor" viewBox="0 0 24 24" >
                                <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
                                <path d="M16 16H2v2h14v4l6-5-6-5zM8 1 2 6l6 5V7h14V5H8z"></path>
                            </svg>
                        </div>
                        <span class="small text-muted">Commandes</span>
                    </div>
                    <div class="ms-auto d-flex gap-2">
                        <select name="" id="" class="form-select rounded-pill">
                            <option value="" disabled>Choisir</option>
                            <option value="">Tous</option>
                            <option value="">Soldé</option>
                            <option value="">En cours</option>
                        </select>
                        <form action="" class="d-flex align-items-center rounded-pill" id="searchForm">
                            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                                fill="currentColor" viewBox="0 0 24 24" >
                                <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
                                <path d="M10.5 19c1.98 0 3.81-.69 5.25-1.83L20 21.42l1.41-1.41-4.25-4.25a8.47 8.47 0 0 0 1.83-5.25c0-4.69-3.81-8.5-8.5-8.5S2 5.81 2 10.5 5.81 19 10.5 19m0-15c3.58 0 6.5 2.92 6.5 6.5S14.08 17 10.5 17 4 14.08 4 10.5 6.92 4 10.5 4"></path>
                            </svg>
                            <input type="text" class="ms-2" placeholder="Recherche..." id="searchInput" name="searchInput">
                        </form>
                    </div>
                </div>
                <div class="table-responsive mt-3">
                    <table class="table last-command align-middle">
                        <thead>
                            <tr class="table-light">
                                <th class="text-muted" scope="col"><input class="form-check-input" type="checkbox" value="" id="checkDefault"></th>
                                <th class="text-muted" scope="col">REFERENCE</th>
                                <th class="text-muted" scope="col">CLIENT</th>
                                <th class="text-muted" scope="col">PRODUITS</th>
                                <th class="text-muted" scope="col">MONTANT</th>
                                <th class="text-muted" scope="col">STATUT</th>
                                <th class="text-muted" scope="col">DATE</th>
                                <th class="text-muted text-end" scope="col">ACTION</th>
                            </tr>
                        </thead>
                        <tbody id="result-commandes">
                            <!-- générer dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- ── Pagination flottante ── -->
<div class="float-pag" id="floatPag">
    <button class="pg-btn" id="btnPrev">
        <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
            fill="currentColor" viewBox="0 0 24 24" >
            <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
            <path d="M14.29 6.29 8.59 12l5.7 5.71 1.42-1.42-4.3-4.29 4.3-4.29z"></path>
        </svg>
    </button>
    <div id="pgNums">
        <button class="pg-btn active">1</button>
        <button class="pg-btn">2</button>
        <button class="pg-btn">3</button>
        <button class="pg-btn">4</button>
    </div>
    <button class="pg-btn" id="btnNext">
        <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
            fill="currentColor" viewBox="0 0 24 24" >
            <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
            <path d="m9.71 17.71 5.7-5.71-5.7-5.71-1.42 1.42 4.3 4.29-4.3 4.29z"></path>
        </svg>
    </button>
</div>
<?php include('./includes/footer.php') ?>