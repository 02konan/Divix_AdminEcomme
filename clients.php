<?php include('./includes/header.php') ?>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <div class="icon me-2">
            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
                fill="currentColor" viewBox="0 0 24 24" >
                <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
                <path d="M22 11h-3V8h-2v3h-3v2h3v3h2v-3h3zM8 4a4 4 0 1 0 0 8 4 4 0 1 0 0-8M3 20h10c.55 0 1-.45 1-1v-1c0-2.76-2.24-5-5-5H7c-2.76 0-5 2.24-5 5v1c0 .55.45 1 1 1"/>
            </svg>
        </div>
        <div class="">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Nouveau client</h1>
            <span class="small text-muted">Formulaire d'ajout de clients</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form action="/client/add" id="clientForm" method="post" class="vstack g-2">
            
            <fieldset>
                <legend>
                    Personnelles
                </legend>
                <div class="d-flex  gap-2">
                    <div class="col mb-3">
                        <label for="" class="form-label">Nom complet</label>
                        <input type="text" name="nom" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                </div>
                <div class="d-flex  gap-2">
                    <div class="col mb-3">
                        <label for="" class="form-label">Commune</label>
                        <input type="text" name="commune" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                    <div class="col mb-3">
                        <label for="" class="form-label">Quartier</label>
                        <input type="text" name="quartier" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>
                    Coordonnées
                </legend>
                <div class="col mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email</label>
                    <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                </div>
                <div class="d-flex  gap-2">
                    <div class="col mb-3">
                        <label for="" class="form-label">Contact</label>
                        <input type="text" name="telephone" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                    <div class="col mb-3">
                        <label for="" class="form-label">Whatsapp</label>
                        <input type="text" name="whatsapp" class="form-control" id="" aria-describedby="emailHelp">
                    </div>
                </div>
            </fieldset>
      </div>
      <div class="modal-footer">
        <button type="submit" id="addClientBtn" class="btn btn-primary">Enregistrer</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
      </div>
      </form>
    </div>
  </div>
</div>
<div class="content-wrapper d-flex flex-column gap-3">
    <div class="add-box d-flex align-items-center w-100 px-2 gap-2">
        <p class="m-0"><span class="text-muted">Dashboard / </span><span class="fw-medium">Clients</span></p>
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
            <span class="mx-1">Client</span>
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
                                <path d="M9 4a4 4 0 1 0 0 8 4 4 0 1 0 0-8m1 9H8c-2.76 0-5 2.24-5 5v1c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-1c0-2.76-2.24-5-5-5m5-9c-.47 0-.9.09-1.31.22C14.51 5.24 15 6.55 15 8s-.49 2.75-1.31 3.78c.41.13.84.22 1.31.22 2.28 0 4-1.72 4-4s-1.72-4-4-4m1 9h-1.11A6.97 6.97 0 0 1 17 18v1c0 .35-.07.69-.18 1H20c.55 0 1-.45 1-1v-1c0-2.76-2.24-5-5-5"></path>
                            </svg>
                        </div>
                        <span class="small text-muted">Total Clients</span>
                    </div>
                </div>
                <h1 class="mt-2"><span class="purecounter" data-purecounter-start="0" data-purecounter-end="320" data-purecounter-duration="1.0"></span></h1>
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
                                <path d="M14 11h8v2h-8zM8 4a4 4 0 1 0 0 8 4 4 0 1 0 0-8M3 20h10c.55 0 1-.45 1-1v-1c0-2.76-2.24-5-5-5H7c-2.76 0-5 2.24-5 5v1c0 .55.45 1 1 1"></path>
                            </svg>
                        </div>
                        <span class="small text-muted">Clients en prêt</span>
                    </div>
                    <span class="ms-auto badge badge-success">Cummulé</span>
                </div>
                <h1 class="mt-2"><span class="purecounter" data-purecounter-start="0" data-purecounter-end="22" data-purecounter-duration="1.0"></span></h1>
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
                                <path d="M8 4a4 4 0 1 0 0 8 4 4 0 1 0 0-8m1 9H7c-2.76 0-5 2.24-5 5v1c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-1c0-2.76-2.24-5-5-5m7-.41-2.29-2.29-1.41 1.41 3 3c.2.2.45.29.71.29s.51-.1.71-.29l5-5-1.41-1.41-4.29 4.29Z"></path>
                            </svg>
                        </div>
                        <span class="small text-muted">Clients passifs</span>
                    </div>
                    <span class="ms-auto badge badge-success">Cummulé</span>
                </div>
                <h1 class="mt-2"><span class="purecounter" data-purecounter-start="0" data-purecounter-end="298" data-purecounter-duration="1.0"></span></h1>
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
                                <path d="M12 6c-2.28 0-4 1.72-4 4s1.72 4 4 4 4-1.72 4-4-1.72-4-4-4m0 6c-1.18 0-2-.82-2-2s.82-2 2-2 2 .82 2 2-.82 2-2 2"/><path d="M12 2C6.49 2 2 6.49 2 12c0 3.26 1.58 6.16 4 7.98V20h.03c1.67 1.25 3.73 2 5.97 2s4.31-.75 5.97-2H18v-.02c2.42-1.83 4-4.72 4-7.98 0-5.51-4.49-10-10-10M8.18 19.02C8.59 17.85 9.69 17 11 17h2c1.31 0 2.42.85 2.82 2.02-1.14.62-2.44.98-3.82.98s-2.69-.35-3.82-.98m9.3-1.21c-.81-1.66-2.51-2.82-4.48-2.82h-2c-1.97 0-3.66 1.16-4.48 2.82A7.96 7.96 0 0 1 4 11.99c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.29-.97 4.36-2.52 5.82"/>
                            </svg>
                        </div>
                        <span class="small text-muted">Clients</span>
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
                            <tr class="table-light bg-primary">
                                <th class="text-muted" scope="col"><input class="form-check-input" type="checkbox" value="" id="checkDefault"></th>
                                <th class="text-muted" scope="col">CLIENT</th>
                                <th class="text-muted" scope="col">CONTACT</th>
                                <th class="text-muted" scope="col">LOCALISATION</th>
                                <th class="text-muted" scope="col">EMAIL</th>
                                <th class="text-muted" scope="col">DATE D'AJOUT</th>
                                <th class="text-muted text-end" scope="col">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row"><input class="form-check-input" type="checkbox" value=""></th>
                                <td data-label="Client">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar-initials bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-semibold" style="width:34px;height:34px;font-size:13px;flex-shrink:0">JD</div>
                                        <div>
                                            <p class="m-0 p-0">John Doe</p>
                                        </div>
                                    </div>
                                </td>
                                <td data-label="Contact">
                                    <p class="m-0 p-0">07 89 09 00 76</p>
                                </td>
                                <td data-label="Localisation">
                                    <p class="m-0 p-0">Cocody</p>
                                </td>
                                <td data-label="Email"><span class="text-muted">johndoe@email.com</span></td>
                                <td data-label="Date d'ajout"><span class="text-muted">12 Janvier 2023</span></td>
                                <td data-label="Action" class="no-print-col" style="text-align: end;">
                                    <div class="btn-group">
                                        <button class="btn btn-outline-secondary btn-sm td-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul class="dropdown-menu shadow-sm" style="z-index: 109;">
                                            <li><a class="dropdown-item" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 22c5.51 0 10-4.49 10-10S17.51 2 12 2 2 6.49 2 12s4.49 10 10 10M11 7h2v2h-2zm0 4h2v6h-2z"></path>
                                                </svg>
                                                <span class="ms-2">Détails</span>
                                            </a></li>
                                            <li><a class="dropdown-item" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path>
                                                </svg>
                                                <span class="ms-2">Modifier</span>
                                            </a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item text-danger" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
                                                </svg>
                                                <span class="ms-2">Supprimer</span>
                                            </a></li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><input class="form-check-input" type="checkbox" value=""></th>
                                <td data-label="Client">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar-initials bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center fw-semibold" style="width:34px;height:34px;font-size:13px;flex-shrink:0">AH</div>
                                        <div>
                                            <p class="m-0 p-0">Arthur Heros</p>
                                        </div>
                                    </div>
                                </td>
                                <td data-label="Contact">
                                    <p class="m-0 p-0">05 06 78 97 67</p>
                                </td>
                                <td data-label="Localisation">
                                    <p class="m-0 p-0">Yopougon</p>
                                </td>
                                <td data-label="Email"><span class="text-muted">artherheros@email.com</span></td>
                                <td data-label="Date d'ajout"><span class="text-muted">09 Août 2023</span></td>
                                <td data-label="Action" class="no-print-col" style="text-align: end;">
                                    <div class="btn-group">
                                        <button class="btn btn-outline-secondary btn-sm td-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul class="dropdown-menu shadow-sm" style="z-index: 109;">
                                            <li><a class="dropdown-item" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 22c5.51 0 10-4.49 10-10S17.51 2 12 2 2 6.49 2 12s4.49 10 10 10M11 7h2v2h-2zm0 4h2v6h-2z"></path>
                                                </svg>
                                                <span class="ms-2">Détails</span>
                                            </a></li>
                                            <li><a class="dropdown-item" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path>
                                                </svg>
                                                <span class="ms-2">Modifier</span>
                                            </a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item text-danger" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
                                                </svg>
                                                <span class="ms-2">Supprimer</span>
                                            </a></li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><input class="form-check-input" type="checkbox" value=""></th>
                                <td data-label="Client">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar-initials bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center fw-semibold" style="width:34px;height:34px;font-size:13px;flex-shrink:0">MK</div>
                                        <div>
                                            <p class="m-0 p-0">Marie Koné</p>
                                        </div>
                                    </div>
                                </td>
                                <td data-label="Contact">
                                    <p class="m-0 p-0">07 07 12 34 56</p>
                                </td>
                                <td data-label="Localisation">
                                    <p class="m-0 p-0">Plateau</p>
                                </td>
                                <td data-label="Email"><span class="text-muted">mariekone@email.com</span></td>
                                <td data-label="Date d'ajout"><span class="text-muted">03 Mars 2023</span></td>
                                <td data-label="Action" class="no-print-col" style="text-align: end;">
                                    <div class="btn-group">
                                        <button class="btn btn-outline-secondary btn-sm td-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul class="dropdown-menu shadow-sm" style="z-index: 109;">
                                            <li><a class="dropdown-item" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 22c5.51 0 10-4.49 10-10S17.51 2 12 2 2 6.49 2 12s4.49 10 10 10M11 7h2v2h-2zm0 4h2v6h-2z"></path>
                                                </svg>
                                                <span class="ms-2">Détails</span>
                                            </a></li>
                                            <li><a class="dropdown-item" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path>
                                                </svg>
                                                <span class="ms-2">Modifier</span>
                                            </a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item text-danger" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
                                                </svg>
                                                <span class="ms-2">Supprimer</span>
                                            </a></li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><input class="form-check-input" type="checkbox" value=""></th>
                                <td data-label="Client">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar-initials bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center fw-semibold" style="width:34px;height:34px;font-size:13px;flex-shrink:0">OT</div>
                                        <div>
                                            <p class="m-0 p-0">Oumar Touré</p>
                                        </div>
                                    </div>
                                </td>
                                <td data-label="Contact">
                                    <p class="m-0 p-0">05 05 65 43 21</p>
                                </td>
                                <td data-label="Localisation">
                                    <p class="m-0 p-0">Abobo</p>
                                </td>
                                <td data-label="Email"><span class="text-muted">—</span></td>
                                <td data-label="Date d'ajout"><span class="text-muted">17 Mai 2023</span></td>
                                <td data-label="Action" class="no-print-col" style="text-align: end;">
                                    <div class="btn-group">
                                        <button class="btn btn-outline-secondary btn-sm td-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul class="dropdown-menu shadow-sm" style="z-index: 109;">
                                            <li><a class="dropdown-item" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 22c5.51 0 10-4.49 10-10S17.51 2 12 2 2 6.49 2 12s4.49 10 10 10M11 7h2v2h-2zm0 4h2v6h-2z"></path>
                                                </svg>
                                                <span class="ms-2">Détails</span>
                                            </a></li>
                                            <li><a class="dropdown-item" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path>
                                                </svg>
                                                <span class="ms-2">Modifier</span>
                                            </a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item text-danger" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
                                                </svg>
                                                <span class="ms-2">Supprimer</span>
                                            </a></li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><input class="form-check-input" type="checkbox" value=""></th>
                                <td data-label="Client">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar-initials bg-info-subtle text-info rounded-circle d-flex align-items-center justify-content-center fw-semibold" style="width:34px;height:34px;font-size:13px;flex-shrink:0">FD</div>
                                        <div>
                                            <p class="m-0 p-0">Fatou Diallo</p>
                                        </div>
                                    </div>
                                </td>
                                <td data-label="Contact">
                                    <p class="m-0 p-0">01 01 98 76 54</p>
                                </td>
                                <td data-label="Localisation">
                                    <p class="m-0 p-0">Marcory</p>
                                </td>
                                <td data-label="Email"><span class="text-muted">fatoudiou@email.com</span></td>
                                <td data-label="Date d'ajout"><span class="text-muted">28 Juin 2023</span></td>
                                <td data-label="Action" class="no-print-col" style="text-align: end;">
                                    <div class="btn-group">
                                        <button class="btn btn-outline-secondary btn-sm td-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul class="dropdown-menu shadow-sm" style="z-index: 109;">
                                            <li><a class="dropdown-item" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 22c5.51 0 10-4.49 10-10S17.51 2 12 2 2 6.49 2 12s4.49 10 10 10M11 7h2v2h-2zm0 4h2v6h-2z"></path>
                                                </svg>
                                                <span class="ms-2">Détails</span>
                                            </a></li>
                                            <li><a class="dropdown-item" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path>
                                                </svg>
                                                <span class="ms-2">Modifier</span>
                                            </a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item text-danger" href="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
                                                </svg>
                                                <span class="ms-2">Supprimer</span>
                                            </a></li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
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
<?php include('./includes/footer.php') ?>