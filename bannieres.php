<?php include('./includes/header.php') ?>

<div class="modal fade" id="bannerModal" tabindex="-1" aria-labelledby="bannerModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <div class="modal-header">
            <div class="icon me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.86l2.43-3.02 1.5 1.5V7h-10v8h5.96z"></path>
                </svg>
            </div>
            <div>
                <h1 class="modal-title fs-5" id="bannerModalLabel">Nouvelle Bannière</h1>
                <span class="small text-muted">Formulaire d'ajout de bannière</span>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <form method="post" enctype="multipart/form-data" id="bannerForm" class="vstack gap-2">
            <input type="hidden" id="banner_edit_id" name="banner_id" value="">
            <fieldset>
                <legend>Informations générales</legend>
                <div class="mb-3">
                    <label for="bannerTitre" class="form-label">Titre <span class="small text-danger">*</span></label>
                    <input type="text" class="form-control" id="bannerTitre" name="titre" placeholder="ex: Solde d'été" required>
                </div>
                <div class="mb-3">
                    <label for="bannerDescription" class="form-label">Description</label>
                    <textarea class="form-control" id="bannerDescription" name="description" rows="3" placeholder="Description de la bannière"></textarea>
                </div>
                <div class="d-flex gap-2">
                    <div class="col mb-3">
                        <label for="bannerType" class="form-label">Type <span class="small text-danger">*</span></label>
                        <select class="form-select" id="bannerType" name="type" required>
                            <option value="" selected disabled>--choisir--</option>
                            <option value="a_la_une">À la une</option>
                            <option value="banner">Bannière</option>
                            <option value="event">Événement</option>
                            <option value="promo">Promotion</option>
                            <option value="marquee">Défilant</option>
                        </select>
                    </div>
                    <div class="col mb-3 banner-link-field">
                        <label for="bannerLien" class="form-label">Lien</label>
                        <input type="url" class="form-control" id="bannerLien" name="lien" placeholder="https://...">
                    </div>
                </div>
            </fieldset>
            
            <fieldset class="banner-produit-field" style="display: none;">
                <legend>Produit lié</legend>
                <div class="mb-3">
                    <label for="bannerProduit" class="form-label">Produit <span class="small text-danger">*</span></label>
                    <select class="form-select" id="bannerProduit" name="id_produit">
                        <option value="" selected disabled>-- Choisir un produit --</option>
                    </select>
                    <div class="form-text">Sélectionnez le produit à mettre en avant</div>
                </div>
            </fieldset>

            <fieldset class="banner-description-field">
                <legend>Description</legend>
                <div class="mb-3">
                    <textarea class="form-control" id="bannerDescription" name="description" rows="3" placeholder="Description de la bannière"></textarea>
                </div>
            </fieldset>
            <fieldset class="banner-image-field">
                <legend>Visuel</legend>
                <div class="mb-3">
                    <label for="bannerImage" class="form-label">Image <span class="small text-danger banner-image-required">*</span></label>
                    <input type="file" class="form-control" id="bannerImage" name="image" accept="image/*">
                    <div class="form-text">Format recommandé: 1920x1080px (16:9)</div>
                </div>
                <div id="bannerImagePreview" class="mb-3 d-none">
                    <img src="" alt="Aperçu" class="img-fluid rounded" style="max-height: 200px;">
                </div>
            </fieldset>

            <fieldset class="banner-dates-field">
                <legend>Dates</legend>
                <div class="d-flex gap-2">
                    <div class="col mb-3">
                        <label for="bannerDateDebut" class="form-label">Date de début</label>
                        <input type="datetime-local" class="form-control" id="bannerDateDebut" name="date_debut">
                    </div>
                    <div class="col mb-3">
                        <label for="bannerDateFin" class="form-label">Date de fin</label>
                        <input type="datetime-local" class="form-control" id="bannerDateFin" name="date_fin">
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>Statut</legend>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="bannerActive" name="active" checked>
                    <label class="form-check-label" for="bannerActive">Activé</label>
                </div>
            </fieldset>

        </form> 
      </div> 
      <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" id="submitBannerBtn" class="btn btn-primary">Enregistrer</button>
        </div>
    </div>    
  </div>    
</div>

<div class="content-wrapper d-flex flex-column gap-3">
    <div class="add-box d-flex align-items-center w-100 px-2 gap-2">
        <p class="m-0 me-auto"><span class="text-muted">Dashboard / </span><span class="fw-medium">Bannières</span></p>
        <!-- <button type="button" class="ms-auto btn btn-sm btn-dark d-flex align-items-center gap-1">
            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                fill="currentColor" viewBox="0 0 24 24" >
                <path d="m21.8 6.4-2.7-3.6c-.38-.5-.97-.8-1.6-.8h-11c-.63 0-1.23.3-1.6.8L2.2 6.4h.01c-.13.18-.21.37-.21.6v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-.23-.09-.42-.21-.59h.01ZM13 14v4h-2v-4H8l4-4 4 4zM5 6l1.5-2h11L19 6z"></path>
            </svg>
            <span>Exporter</span>
        </button> -->
        <button class="btn btn-sm btn-primary d-flex align-items-center gap-1" data-bs-toggle="modal" data-bs-target="#bannerModal">
            <i class='bx bx-plus'></i>
            <span>Bannière</span>
        </button>
    </div>

    <div class="w-100 row g-3 px-0 mx-0">
        <div class="col-md-12 col-lg-12 card-group">
            <div class="card feature-card border-0 shadow-sm p-3">
                <div class="d-flex w-100 align-items-center gap-2 mb-3">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.86l2.43-3.02 1.5 1.5V7h-10v8h5.96z"></path>
                        </svg>
                    </div>
                    <span class="small text-muted">Bannières</span>
                    <form class="d-flex align-items-center rounded-pill ms-auto" id="searchForm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10.5 19c1.98 0 3.81-.69 5.25-1.83L20 21.42l1.41-1.41-4.25-4.25a8.47 8.47 0 0 0 1.83-5.25c0-4.69-3.81-8.5-8.5-8.5S2 5.81 2 10.5 5.81 19 10.5 19m0-15c3.58 0 6.5 2.92 6.5 6.5S14.08 17 10.5 17 4 14.08 4 10.5 6.92 4 10.5 4"></path>
                        </svg>
                        <input type="text" class="ms-2" placeholder="Recherche..." id="searchInput" name="searchInput">
                    </form>
                </div>

                <div id="banners-list" class="row g-3">
                    <!-- Bannières générées dynamiquement -->
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
            <path d="m9.71 17.71 5.7-5.71-5.7-5.71-1.42 1.42 4.3 4.29-4.3 4.29z"></path>
        </svg>
    </button>
</div>

<div class="offcanvas border-0 shadow offcanvas-end" tabindex="-1" id="offcanvasDetails" aria-labelledby="offcanvasRightLabel">
    <div class="offcanvas-header border-bottom">
        <div class="d-flex align-items-center gap-2">
            <h5 class="offcanvas-title m-0" id="offcanvasRightLabel">Détails de la bannière</h5>
            <span class="status-badge active" id="offcanvasDetailsStatusBadge">Actif</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body p-0" id="offcanvasDetailsBody">
        <div class="text-center py-5 text-muted">Sélectionnez une bannière pour voir ses détails.</div>
    </div>
    <div class="p-3 border-top d-flex gap-2">
        <button class="btn btn-sm btn-primary d-flex align-items-center" data-id="" id="bannerEditBtn"><i class='bx bx-edit me-1'></i>Modifier</button>
    </div>
</div>

<?php include('./includes/footer.php') ?>