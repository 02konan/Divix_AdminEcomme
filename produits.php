<?php include('./includes/header.php') ?>

<div class="offcanvas border-0 shadow offcanvas-end" tabindex="-1" id="offcanvasDetails" aria-labelledby="offcanvasRightLabel">
    <div class="offcanvas-header border-bottom">
        <div class="d-flex align-items-center gap-2">
            <h5 class="offcanvas-title m-0" id="offcanvasRightLabel">Détails du produit</h5>
            <span class="status-badge active" id="offcanvasDetailsStatusBadge">Actif</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body p-0" id="offcanvasDetailsBody">
        <div class="text-center py-5 text-muted">Sélectionnez un produit pour voir ses détails.</div>
    </div>

    <!-- Actions -->
    <div class="p-3 border-top d-flex gap-2">
        <button class="btn btn-sm btn-primary d-flex align-items-center" id="editProduitBtn" data-edit-id="" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class='bx bx-edit me-1'></i>Modifier</button>
    </div>
</div>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <div class="modal-header">
            <div class="icon me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 7H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2h-5c-1.1 0-2-.9-2-2v-3c0-1.1.9-2 2-2h5V9c0-1.1-.9-2-2-2"/><path d="M17 13h5v3h-5zm-.43-10.82a1 1 0 0 0-.93-.11L8.01 5H17V3c0-.33-.16-.64-.43-.82"/>
                </svg>
            </div>
            <div>
                <h1 class="modal-title fs-5" id="exampleModalLabel">Nouveau Produit</h1>
                <span class="small text-muted" id="subExampleModalLabel">Formulaire d'ajout de produit</span>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <form method="post" enctype="multipart/form-data" id="produitForm" class="vstack gap-2">
            <input type="hidden" id="produit_edit_id" name="edit_id">
            <fieldset>
                <legend>Informations générales</legend>
                <div class="d-flex gap-2">
                    <div class="col mb-3">
                        <label for="produitNom" class="form-label">Nom du produit <span class="small text-danger">*</span></label>
                        <input type="text" class="form-control" id="produitNom" name="nom" placeholder="ex: iPhone 15 Pro" required>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <div class="col mb-3">
                        <label for="produitCategorieLabel" class="form-label">Catégorie <span class="small text-danger">*</span></label>
                        <input type="text" class="form-control" id="produitCategorieLabel" placeholder="--choisir--" name="categorie_label" list="list-categorie" autocomplete="off" required>
                        <input type="hidden" id="produitCategorieId" name="categorie">
                        <datalist id="list-categorie"></datalist>
                        <small class="text-muted form-text">Si vous changez la catégorie, la sous-catégorie sera réinitialisée.</small>
                    </div>
                    <div class="col mb-3">
                        <label for="produitSousCategorieLabel" class="form-label">Sous-catégorie <span class="small text-danger">*</span></label>
                        <input type="text" class="form-control" id="produitSousCategorieLabel" placeholder="--choisir--" name="sous_categorie_label" list="list-sous-categorie" autocomplete="off" required>
                        <input type="hidden" id="produitSousCategorieId" name="sous_categorie">
                        <datalist id="list-sous-categorie"></datalist>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <div class="col mb-3">
                        <label for="produitDescLabel" class="form-label">Description <span class="small text-danger">*</span></label>
                        <textarea class="form-control" id="produitDescLabel" placeholder="Tapez la description du produit" name="description" autocomplete="off" required></textarea>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <div class="col mb-3">
                        <label for="produitCaractLabel" class="form-label">Caractéristique</label>
                        <textarea class="form-control" id="produitCaractLabel" placeholder="Tapez les caractéristiques du produit" name="caracteristique" autocomplete="off"></textarea>
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>Prix & Stock</legend>
                <div class="d-flex gap-2">
                    <div class="col mb-3">
                        <label for="produitPrixAchat" class="form-label">Prix Vente(FCFA) <span class="small text-danger">*</span></label>
                        <input type="number" class="form-control" id="produitPrixAchat" name="prix_vente" placeholder="0" required>
                    </div>
                    <div class="col mb-3">
                        <label for="produitStock" class="form-label">Quantité en stock <span class="small text-danger">*</span></label>
                        <input type="number" class="form-control" id="produitStock" name="stock" placeholder="0" required>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <div class="col mb-3">
                        <label for="produitStockMin" class="form-label">Seuil d'alerte stock <span class="small text-danger">*</span></label>
                        <input type="number" class="form-control" id="produitStockMin" name="stock_min" placeholder="ex: 5" required>
                    </div>
                    <div class="col mb-3">
                        <label for="produitStatut" class="form-label">Statut <span class="small text-danger">*</span></label>
                        <select class="form-select" id="produitStatut" name="statut" required style="pointer-events: none;">
                            <option value="" selected disabled>--choisir--</option>
                            <option value="En stock">En stock</option>
                            <option value="Stock faible">Stock faible</option>
                            <option value="Rupture">Rupture</option>
                        </select>
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>Visuel du Produits</legend>
                <div class="col mb-3">
                    <label for="produitImages" class="form-label">Images (ordinateur) <span class="small text-muted">Multiples autorisées</span></label>
                    <input type="file" class="form-control" id="produitImages" name="images[]" accept="image/*" multiple>
                </div>
                <div class="col mb-3">
                    <label for="produitImageUrls" class="form-label">Images en ligne</label>
                    <textarea class="form-control" id="produitImageUrls" name="image_urls" rows="3" placeholder="Collez une URL par ligne"></textarea>
                    <div class="form-text">Ajoutez une ou plusieurs URL d'images, une par ligne.</div>
                </div>
            </fieldset>
            
            <!-- Section de gestion des images (visible uniquement en modification) -->
            <fieldset id="imagesManagementSection" style="display: none;">
                <legend>Gestion des images</legend>
                
                <!-- Images existantes -->
                <div class="mb-3">
                    <label class="form-label">Images actuelles</label>
                    <div id="existingImagesContainer" class="row g-2">
                        <!-- Les images existantes seront chargées ici dynamiquement -->
                    </div>
                </div>
                
                <!-- Ajout de nouvelles images -->
                <div class="col mb-3">
                    <label for="produitImagesNew" class="form-label">Ajouter des images <span class="small text-muted">Multiples autorisées</span></label>
                    <input type="file" class="form-control" id="produitImagesNew" name="new_images[]" accept="image/*" multiple>
                    <div class="form-text">Sélectionnez une ou plusieurs images à ajouter au produit.</div>
                </div>
                
                <!-- URLs d'images en ligne -->
                <div class="col mb-3">
                    <label for="produitImageUrlsNew" class="form-label">Ajouter des images en ligne</label>
                    <textarea class="form-control" id="produitImageUrlsNew" name="new_image_urls" rows="2" placeholder="Collez une URL par ligne"></textarea>
                    <div class="form-text">Ajoutez une ou plusieurs URL d'images, une par ligne.</div>
                </div>
            </fieldset>
        </form> 
      </div> 
      <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" id="submitProduitBtn" class="btn btn-primary">Enregistrer</button>
      </div>
    </div>    
  </div>    
</div> 

<div class="content-wrapper d-flex flex-column gap-3">
    <div class="add-box d-flex align-items-center w-100 px-2 gap-2">
        <p class="m-0 me-auto"><span class="text-muted">Dashboard / </span><span class="fw-medium">Produits</span></p>
        <button class=" btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"></path>
            </svg>
            <span class="mx-1">Produit</span>
        </button>
    </div>
    <div class="w-100 row g-3 px-0 mx-0">
        <div class="col-md-4 col-lg-4 card-group">
            <div class="card feature-card border-0 shadow-sm p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-center gap-2">
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="m21.72 8-1.77-5.32A1 1 0 0 0 19 2H6c-.38 0-.72.21-.89.55L2.39 8h19.34ZM2 20c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V9H2z"></path>
                            </svg>
                        </div>
                        <span class="small text-muted">Total produits</span>
                    </div>
                </div>
                <h1 class="mt-2"><span id="countertotal_produits"></span></h1>
            </div>
        </div>
        <div class="col-md-4 col-lg-4 card-group">
            <div class="card feature-card border-0 shadow-sm p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-center gap-2">
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="m21.95 8.68-2-6A1 1 0 0 0 19 2H6c-.38 0-.73.21-.89.55l-3 6s0 .03-.01.04c0 .02-.01.04-.02.07q-.06.15-.06.3V20c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V8.97c0-.1-.01-.19-.05-.29ZM6.62 4h11.66l1.33 4H4.62zM20 19H4v-9h16z"/>
                            </svg>
                        </div>
                        <span class="small text-muted">Produits</span>
                    </div>
                    <span class="ms-auto badge badge-danger">En rupture</span>
                </div>
                <h1 class="mt-2"><span id="counteren_rupture"></span></h1>
            </div>
        </div>
        <div class="col-md-4 col-lg-4 card-group">
            <div class="card feature-card border-0 shadow-sm p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-center gap-2">
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="m21.95 8.68-2-6A1 1 0 0 0 19 2H6c-.38 0-.73.21-.89.55l-3 6s0 .03-.01.04c0 .02-.01.04-.02.07q-.06.15-.06.3V20c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V8.97c0-.1-.01-.19-.05-.29ZM6.62 4h11.66l1.33 4H4.62zM20 19H4v-9h16z"/>
                            </svg>
                        </div>
                        <span class="small text-muted">Produits</span>
                    </div>
                    <span class="ms-auto badge badge-pending">Stock faible</span>
                </div>
                <h1 class="mt-2"><span id="counterstock_faible"></span></h1>
            </div>
        </div>
    </div>
    <div class="w-100 row g-3 px-0 mx-0">
        <div class="col-md-12 col-lg-12 card-group">
            <div class="card feature-card border-0 shadow-sm p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-center gap-2 me-auto">
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="m21.72 8-1.77-5.32A1 1 0 0 0 19 2H6c-.38 0-.72.21-.89.55L2.39 8h19.34ZM2 20c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V9H2z"></path>
                            </svg>
                        </div>
                        <span class="small text-muted">Produits</span>
                    </div>
                </div>
                <div class="product-section mt-4">
                    <div class="row g-4" id="result-products" data-aos="fade-up" data-aos-delay="0">
                        <!-- Générer dynamiquement -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Pagination flottante -->
<div class="float-pag" id="floatPag">
    <button class="pg-btn" id="btnPrev">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="m9.71 17.71 5.7-5.71-5.7-5.71-1.42 1.42 4.3 4.29-4.3 4.29z"></path>
        </svg>
    </button>
</div>

<?php include('./includes/footer.php') ?>