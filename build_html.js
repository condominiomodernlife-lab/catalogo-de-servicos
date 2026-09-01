const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\alcsilva\\Downloads\\contatos';
const contactsData = fs.readFileSync(path.join(dir, 'catalogo_contatos.json'), 'utf8');
const contacts = JSON.parse(contactsData);

const totalContacts = contacts.length;
const categoriesMap = {};
let waBizCount = 0;
let instaCount = 0;

for (const c of contacts) {
  categoriesMap[c.category] = (categoriesMap[c.category] || 0) + 1;
  if (c.wa_description) waBizCount++;
  if (c.instagram) instaCount++;
}

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catálogo de Serviços - com Instagram & Fotos</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <style>
    :root {
      --primary-color: #0d6efd;
      --wa-green: #25d366;
      --insta-gradient: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      --bg-light: #f8f9fa;
    }
    body {
      background-color: #f4f6f9;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      padding-bottom: 60px;
    }
    .header-banner {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 2.5rem 0;
      border-radius: 0 0 1.5rem 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .stat-card {
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(8px);
      border-radius: 12px;
      padding: 1rem;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .search-box {
      border-radius: 50px;
      padding-left: 1.25rem;
      padding-right: 1.25rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      border: 1px solid #ced4da;
      font-size: 1.05rem;
    }
    .category-badge {
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
      font-weight: 500;
      padding: 0.5em 0.9em;
      border-radius: 50px;
      margin-right: 0.3rem;
      margin-bottom: 0.5rem;
      display: inline-block;
    }
    .category-badge.active {
      box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
    }
    .contact-card {
      border: none;
      border-radius: 16px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      background: white;
      height: 100%;
      box-shadow: 0 2px 10px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
    }
    .contact-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    }
    .btn-whatsapp {
      background-color: var(--wa-green);
      color: white;
      font-weight: 600;
      border-radius: 50px;
      padding: 0.4rem 0.9rem;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      text-decoration: none;
      font-size: 0.88rem;
    }
    .btn-whatsapp:hover {
      background-color: #1da851;
      color: white;
    }
    .btn-instagram {
      background: var(--insta-gradient);
      color: white;
      font-weight: 600;
      border-radius: 50px;
      padding: 0.4rem 0.9rem;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      text-decoration: none;
      font-size: 0.88rem;
    }
    .btn-instagram:hover {
      opacity: 0.92;
      color: white;
    }
    .avatar-wrapper {
      position: relative;
      width: 48px;
      height: 48px;
      flex-shrink: 0;
    }
    .insta-ring {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      padding: 2.5px;
      background: var(--insta-gradient);
      box-shadow: 0 2px 6px rgba(0,0,0,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      background: #ffffff;
      display: block;
    }
    .avatar-circle-fallback {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #e9ecef;
      color: #495057;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.05rem;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
      flex-shrink: 0;
    }
    .insta-badge-icon {
      position: absolute;
      bottom: -2px;
      right: -2px;
      background: var(--insta-gradient);
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .star-rating {
      color: #ffc107;
      cursor: pointer;
      font-size: 1.1rem;
    }
    .star-rating i {
      margin-right: 2px;
      transition: transform 0.1s;
    }
    .star-rating i:hover {
      transform: scale(1.2);
    }
    .fav-star {
      cursor: pointer;
      color: #ccc;
      transition: color 0.2s;
    }
    .fav-star.active {
      color: #ffc107;
    }
    .biz-desc {
      background: #f8f9fa;
      border-left: 3px solid #25d366;
      padding: 0.5rem 0.75rem;
      font-size: 0.88rem;
      border-radius: 0 8px 8px 0;
      color: #495057;
    }
    .action-btn {
      color: #6c757d;
      background: transparent;
      border: none;
      padding: 4px 8px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .action-btn:hover {
      background: #e9ecef;
      color: #212529;
    }
    .action-btn-danger:hover {
      background: #f8d7da;
      color: #dc3545;
    }
    .admin-only {
      display: none !important;
    }
    body.is-admin .admin-only {
      display: inline-block !important;
    }
    .admin-bar {
      background: #fff3cd;
      color: #664d03;
      border-bottom: 1px solid #ffecb5;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      display: none;
    }
    body.is-admin .admin-bar {
      display: block;
    }
  </style>
</head>
<body>

  <!-- Admin Bar -->
  <div class="admin-bar">
    <div class="container d-flex justify-content-between align-items-center">
      <div>
        <i class="bi bi-shield-lock-fill me-2"></i>
        <strong>Modo Administrador Ativo</strong> — Você pode adicionar fotos do Instagram, editar e excluir contatos.
      </div>
      <div>
        <button class="btn btn-sm btn-outline-warning text-dark me-2" onclick="changeAdminPasswordModal()">
          <i class="bi bi-key me-1"></i> Alterar Senha
        </button>
        <button class="btn btn-sm btn-dark" onclick="logoutAdmin()">
          <i class="bi bi-box-arrow-right me-1"></i> Sair do Modo Admin
        </button>
      </div>
    </div>
  </div>

  <!-- Header Banner -->
  <header class="header-banner">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-7">
          <div class="d-flex align-items-center gap-2 mb-2">
            <h1 class="fw-bold mb-0"><i class="bi bi-journal-bookmark-fill me-2"></i>Catálogo de Serviços</h1>
          </div>
          <p class="mb-0 text-white-50">Guia inteligente de fornecedores com imagens e perfis do Instagram.</p>
        </div>
        <div class="col-md-5 mt-3 mt-md-0">
          <div class="row g-2">
            <div class="col-4">
              <div class="stat-card">
                <h3 class="fw-bold mb-0" id="stat-total">${totalContacts}</h3>
                <small class="text-white-50">Contatos</small>
              </div>
            </div>
            <div class="col-4">
              <div class="stat-card">
                <h3 class="fw-bold mb-0" id="stat-cats">${Object.keys(categoriesMap).length}</h3>
                <small class="text-white-50">Categorias</small>
              </div>
            </div>
            <div class="col-4">
              <div class="stat-card">
                <h3 class="fw-bold mb-0" id="stat-insta">${instaCount}</h3>
                <small class="text-white-50">com Instagram</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="container">
    <!-- Search & Control Toolbar -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-4">
        <div class="row g-3 align-items-center">
          <div class="col-lg-5 col-md-12">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0 rounded-start-pill ps-3">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input type="text" id="search-input" class="form-control border-start-0 search-box rounded-end-pill" 
                     placeholder="Buscar por nome, serviço, @instagram, empresa...">
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <select id="min-rating-select" class="form-select rounded-pill">
              <option value="0">⭐ Todas as Avaliações</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 Estrelas)</option>
              <option value="4">⭐⭐⭐⭐+ (4 Estrelas ou +)</option>
              <option value="3">⭐⭐⭐+ (3 Estrelas ou +)</option>
              <option value="insta">📸 Com Instagram Apenas</option>
              <option value="unrated">Sem Avaliação</option>
            </select>
          </div>
          <div class="col-lg-4 col-md-6 text-end">
            <!-- Normal User Mode Login Button -->
            <button id="admin-login-btn" class="btn btn-outline-secondary rounded-pill me-2" onclick="promptAdminLogin()">
              <i class="bi bi-lock me-1"></i> Área Admin
            </button>

            <!-- Admin Only Buttons -->
            <button class="btn btn-primary rounded-pill me-2 admin-only" onclick="openAddModal()">
              <i class="bi bi-plus-lg me-1"></i> Novo Contato
            </button>
            <div class="btn-group admin-only">
              <button class="btn btn-outline-success rounded-pill dropdown-toggle" data-bs-toggle="dropdown">
                <i class="bi bi-download me-1"></i> Exportar
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow">
                <li><a class="dropdown-item" href="#" onclick="exportCSV(event)"><i class="bi bi-file-earmark-excel me-2 text-success"></i>Exportar CSV</a></li>
                <li><a class="dropdown-item" href="#" onclick="exportJSON(event)"><i class="bi bi-filetype-json me-2 text-primary"></i>Exportar JSON</a></li>
              </ul>
            </div>
            <button id="toggle-favs-btn" class="btn btn-outline-warning rounded-pill ms-1" title="Ver Favoritos">
              <i class="bi bi-star-fill"></i>
            </button>
          </div>
        </div>

        <hr class="my-3 text-muted opacity-25">

        <!-- Category Pills -->
        <div id="categories-container" class="d-flex flex-wrap align-items-center">
          <span class="badge bg-primary category-badge active" data-category="ALL">
            Todos (${totalContacts})
          </span>
          ${Object.entries(categoriesMap).sort((a,b) => b[1] - a[1]).map(([cat, count]) => `
            <span class="badge bg-light text-dark border category-badge" data-category="${cat.replace(/"/g, '&quot;')}">
              ${cat} (${count})
            </span>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Results Info Bar -->
    <div class="d-flex justify-content-between align-items-center mb-3 text-muted">
      <div>Exibindo <strong id="visible-count">${totalContacts}</strong> contatos</div>
      <div class="d-flex align-items-center gap-3">
        <div id="active-category-label" class="fw-semibold text-primary">Categoria: Todas</div>
        <button id="reset-edits-btn" class="btn btn-sm btn-link text-muted p-0 text-decoration-none admin-only" onclick="resetChanges()">
          <i class="bi bi-arrow-counterclockwise"></i> Restaurar dados originais
        </button>
      </div>
    </div>

    <!-- Contacts Grid -->
    <div class="row g-3" id="contacts-grid">
      <!-- Generated via JS -->
    </div>
  </div>

  <!-- Modal para Editar/Adicionar Contato (Admin Only) -->
  <div class="modal fade" id="contactModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow">
        <div class="modal-header border-bottom-0 pb-0">
          <h5 class="modal-title fw-bold" id="modalTitle">Editar Contato</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="contactForm">
            <input type="hidden" id="edit-id">
            <div class="mb-3">
              <label class="form-label fw-semibold small">Nome Completo / Prestador *</label>
              <input type="text" id="edit-name" class="form-control rounded-3" required placeholder="Ex: João Eletricista">
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold small">Empresa / Negócio</label>
                <input type="text" id="edit-org" class="form-control rounded-3" placeholder="Ex: EletroVix Ltda">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold small">Categoria</label>
                <input type="text" id="edit-category" class="form-control rounded-3" list="categoryOptions" placeholder="Ex: Elétrica & Eletrônica">
                <datalist id="categoryOptions">
                  ${Object.keys(categoriesMap).map(c => `<option value="${c.replace(/"/g, '&quot;')}">`).join('')}
                </datalist>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold small">Instagram (@perfil)</label>
                <div class="input-group">
                  <span class="input-group-text bg-light text-danger"><i class="bi bi-instagram"></i></span>
                  <input type="text" id="edit-insta" class="form-control rounded-end-3" placeholder="Ex: @nomedoperfil">
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold small">Telefone / WhatsApp</label>
                <input type="text" id="edit-phone" class="form-control rounded-3" placeholder="Ex: (27) 99999-8888">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small">E-mail</label>
              <input type="email" id="edit-email" class="form-control rounded-3" placeholder="Ex: contato@email.com">
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small">Descrição de Serviços / WhatsApp Business</label>
              <textarea id="edit-desc" class="form-control rounded-3" rows="2" placeholder="Resumo dos serviços prestados..."></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small">Avaliação Inicial</label>
              <select id="edit-rating" class="form-select rounded-3">
                <option value="0">Sem Avaliação</option>
                <option value="5">⭐⭐⭐⭐⭐ (5 Estrelas - Excelente)</option>
                <option value="4">⭐⭐⭐⭐ (4 Estrelas - Muito Bom)</option>
                <option value="3">⭐⭐⭐ (3 Estrelas - Padrão)</option>
                <option value="2">⭐⭐ (2 Estrelas - Regular)</option>
                <option value="1">⭐ (1 Estrela - Atenção)</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer border-top-0 pt-0">
          <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary rounded-pill px-4" onclick="saveContact()">Salvar</button>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    const INITIAL_CONTACTS = ${JSON.stringify(contacts)};
    
    // Admin state
    const DEFAULT_PASS = 'admin123';
    let isAdmin = sessionStorage.getItem('is_admin') === 'true';

    // LocalStorage data
    let customEdits = JSON.parse(localStorage.getItem('contacts_edits') || '{}');
    let deletedIds = JSON.parse(localStorage.getItem('contacts_deleted') || '[]');
    let addedContacts = JSON.parse(localStorage.getItem('contacts_added') || '[]');
    let favorites = JSON.parse(localStorage.getItem('fav_contacts') || '[]');
    let ratings = JSON.parse(localStorage.getItem('ratings_contacts') || '{}');

    let currentCategory = 'ALL';
    let onlyFavorites = false;
    let minRatingFilter = 0;

    const grid = document.getElementById('contacts-grid');
    const searchInput = document.getElementById('search-input');
    const visibleCount = document.getElementById('visible-count');
    const activeCategoryLabel = document.getElementById('active-category-label');
    const toggleFavsBtn = document.getElementById('toggle-favs-btn');
    const minRatingSelect = document.getElementById('min-rating-select');
    const statTotal = document.getElementById('stat-total');
    const statInsta = document.getElementById('stat-insta');
    const resetEditsBtn = document.getElementById('reset-edits-btn');
    const adminLoginBtn = document.getElementById('admin-login-btn');

    const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));

    function applyAdminState() {
      if (isAdmin) {
        document.body.classList.add('is-admin');
        adminLoginBtn.style.display = 'none';
      } else {
        document.body.classList.remove('is-admin');
        adminLoginBtn.style.display = 'inline-block';
      }
    }

    function promptAdminLogin() {
      const currentPass = localStorage.getItem('admin_pass') || DEFAULT_PASS;
      const pwd = prompt('🔐 Área Restrita do Administrador\\n\\nPor favor, digite a senha de administrador:');
      if (pwd === null) return;

      if (pwd === currentPass) {
        isAdmin = true;
        sessionStorage.setItem('is_admin', 'true');
        applyAdminState();
        renderContacts();
        alert('✅ Login efetuado com sucesso! Modo Administrador ativado.');
      } else {
        alert('❌ Senha incorreta.');
      }
    }

    function logoutAdmin() {
      isAdmin = false;
      sessionStorage.removeItem('is_admin');
      applyAdminState();
      renderContacts();
    }

    function changeAdminPasswordModal() {
      const currentPass = localStorage.getItem('admin_pass') || DEFAULT_PASS;
      const oldPwd = prompt('Digite a senha atual:');
      if (oldPwd !== currentPass) {
        if (oldPwd !== null) alert('❌ Senha incorreta.');
        return;
      }
      const newPwd = prompt('Digite a NOVA senha de administrador:');
      if (newPwd && newPwd.trim().length >= 3) {
        localStorage.setItem('admin_pass', newPwd.trim());
        alert('✅ Senha de administrador alterada com sucesso!');
      } else if (newPwd !== null) {
        alert('A senha deve ter pelo menos 3 caracteres.');
      }
    }

    function getActiveDataset() {
      let list = [];
      for (let c of INITIAL_CONTACTS) {
        if (deletedIds.includes(c.filename)) continue;
        if (customEdits[c.filename]) {
          list.push({ ...c, ...customEdits[c.filename] });
        } else {
          list.push({ ...c });
        }
      }
      for (let a of addedContacts) {
        if (deletedIds.includes(a.filename)) continue;
        if (customEdits[a.filename]) {
          list.push({ ...a, ...customEdits[a.filename] });
        } else {
          list.push({ ...a });
        }
      }
      return list;
    }

    function updateStats(activeDataset) {
      statTotal.innerText = activeDataset.length;
      let countInsta = 0;
      for (let c of activeDataset) {
        if (c.instagram) countInsta++;
      }
      statInsta.innerText = countInsta;

      const hasChanges = Object.keys(customEdits).length > 0 || deletedIds.length > 0 || addedContacts.length > 0;
      if (isAdmin && hasChanges) {
        resetEditsBtn.style.display = 'inline-block';
      } else {
        resetEditsBtn.style.display = 'none';
      }
    }

    function getInitials(name) {
      if (!name) return '?';
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    function handleAvatarError(imgEl, initials) {
      imgEl.onerror = null;
      const ring = imgEl.closest('.insta-ring');
      if (ring) {
        ring.outerHTML = '<div class="avatar-circle-fallback">' + initials + '</div>';
      }
    }

    function renderAvatar(c) {
      const handle = (c.instagram || '').replace(/^@/, '');
      const initials = escapeHtml(getInitials(c.name));
      if (handle) {
        const imgUrl = 'https://unavatar.io/instagram/' + encodeURIComponent(handle);
        return \`
          <div class="avatar-wrapper">
            <div class="insta-ring">
              <img src="\${imgUrl}" class="avatar-img" alt="" 
                   onerror="handleAvatarError(this, '\${initials}')">
            </div>
            <div class="insta-badge-icon"><i class="bi bi-instagram"></i></div>
          </div>
        \`;
      }
      return \`
        <div class="avatar-wrapper">
          <div class="avatar-circle-fallback">\${initials}</div>
        </div>
      \`;
    }

    function renderStarRating(filename, currentScore) {
      let starsHtml = '';
      for (let star = 1; star <= 5; star++) {
        const iconClass = star <= currentScore ? 'bi-star-fill' : 'bi-star';
        starsHtml += \`<i class="bi \${iconClass}" onclick="setRating('\${escapeHtml(filename)}', \${star})" title="\${star} estrela(s)"></i>\`;
      }
      return \`<div class="star-rating d-inline-block">\${starsHtml}</div>\`;
    }

    function renderContacts() {
      const activeList = getActiveDataset();
      const query = searchInput.value.toLowerCase().trim();
      grid.innerHTML = '';
      let count = 0;

      for (let i = 0; i < activeList.length; i++) {
        const c = activeList[i];
        const userRating = ratings[c.filename] !== undefined ? ratings[c.filename] : (c.rating || 0);

        // Filter by category
        if (currentCategory !== 'ALL' && c.category !== currentCategory) {
          continue;
        }

        // Filter by favorites
        if (onlyFavorites && !favorites.includes(c.filename)) {
          continue;
        }

        // Filter by rating / instagram
        if (minRatingFilter === 'insta') {
          if (!c.instagram) continue;
        } else if (minRatingFilter === 'unrated') {
          if (userRating > 0) continue;
        } else if (minRatingFilter > 0) {
          if (userRating < minRatingFilter) continue;
        }

        // Filter by search query
        if (query) {
          const matchText = (c.name + ' ' + c.org + ' ' + c.category + ' ' + c.phone_primary + ' ' + (c.instagram || '') + ' ' + c.wa_description + ' ' + c.note).toLowerCase();
          if (!matchText.includes(query)) {
            continue;
          }
        }

        count++;
        const isFav = favorites.includes(c.filename);

        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';
        
        let waButtonHtml = '';
        if (c.wa_link || c.phone_primary) {
          const waUrl = c.wa_link || ('https://wa.me/55' + c.phone_primary.replace(/\\D/g, ''));
          waButtonHtml = \`
            <a href="\${waUrl}" target="_blank" class="btn-whatsapp">
              <i class="bi bi-whatsapp"></i> WhatsApp
            </a>
          \`;
        }

        let instaButtonHtml = '';
        if (c.instagram) {
          const cleanInsta = c.instagram.replace(/^@/, '');
          instaButtonHtml = \`
            <a href="https://instagram.com/\${encodeURIComponent(cleanInsta)}" target="_blank" class="btn-instagram me-1" title="Ver Instagram \${escapeHtml(c.instagram)}">
              <i class="bi bi-instagram"></i> \${escapeHtml(c.instagram)}
            </a>
          \`;
        }

        let orgHtml = c.org ? \`<div class="text-muted small mb-1"><i class="bi bi-building me-1"></i>\${escapeHtml(c.org)}</div>\` : '';
        let bizDescHtml = c.wa_description ? \`
          <div class="biz-desc mt-2">
            <i class="bi bi-info-circle me-1"></i> \${escapeHtml(c.wa_description)}
          </div>
        \` : '';

        let adminButtonsHtml = '';
        if (isAdmin) {
          adminButtonsHtml = \`
            <button class="action-btn" onclick="openEditModal('\${escapeHtml(c.filename)}')" title="Editar Contato">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="action-btn action-btn-danger" onclick="deleteContact('\${escapeHtml(c.filename)}', '\${escapeHtml(c.name)}')" title="Excluir Contato">
              <i class="bi bi-trash"></i>
            </button>
          \`;
        }

        col.innerHTML = \`
          <div class="card contact-card p-3">
            <div class="d-flex align-items-start justify-content-between mb-2">
              <div class="d-flex align-items-center gap-2" style="min-width: 0;">
                \${renderAvatar(c)}
                <div class="text-truncate">
                  <h6 class="fw-bold mb-0 text-dark text-truncate">\${escapeHtml(c.name)}</h6>
                  <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small" style="font-size: 0.75rem;">
                    \${escapeHtml(c.category)}
                  </span>
                </div>
              </div>
              <div class="d-flex align-items-center gap-1 ms-2 flex-shrink-0">
                <i class="bi bi-star-fill fav-star me-1 \${isFav ? 'active' : ''}" onclick="toggleFav('\${escapeHtml(c.filename)}', this)" title="Favorito"></i>
                \${adminButtonsHtml}
              </div>
            </div>

            \${orgHtml}

            <!-- Star Rating Control -->
            <div class="d-flex align-items-center justify-content-between my-2 p-2 bg-light rounded-3">
              <small class="text-muted fw-semibold">Avaliação:</small>
              \${renderStarRating(c.filename, userRating)}
            </div>

            <div class="text-dark small">
              \${c.phone_primary ? \`<div><i class="bi bi-telephone text-muted me-1"></i> \${escapeHtml(c.phone_primary)}</div>\` : ''}
              \${c.email ? \`<div><i class="bi bi-envelope text-muted me-1"></i> \${escapeHtml(c.email)}</div>\` : ''}
            </div>

            \${bizDescHtml}

            <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div class="d-flex align-items-center gap-1">
                \${instaButtonHtml}
              </div>
              \${waButtonHtml}
            </div>
          </div>
        \`;
        grid.appendChild(col);
      }

      visibleCount.innerText = count;
      updateStats(activeList);
    }

    function escapeHtml(str) {
      if (!str) return '';
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function setRating(filename, score) {
      if (ratings[filename] === score) {
        delete ratings[filename];
      } else {
        ratings[filename] = score;
      }
      localStorage.setItem('ratings_contacts', JSON.stringify(ratings));
      renderContacts();
    }

    function toggleFav(filename, el) {
      const idx = favorites.indexOf(filename);
      if (idx > -1) {
        favorites.splice(idx, 1);
        el.classList.remove('active');
      } else {
        favorites.push(filename);
        el.classList.add('active');
      }
      localStorage.setItem('fav_contacts', JSON.stringify(favorites));
      if (onlyFavorites) renderContacts();
    }

    // Modal Actions: Add / Edit (Admin Only)
    function openAddModal() {
      if (!isAdmin) return;
      document.getElementById('modalTitle').innerText = 'Adicionar Novo Contato';
      document.getElementById('edit-id').value = '';
      document.getElementById('contactForm').reset();
      contactModal.show();
    }

    function openEditModal(filename) {
      if (!isAdmin) return;
      const activeList = getActiveDataset();
      const item = activeList.find(c => c.filename === filename);
      if (!item) return;

      document.getElementById('modalTitle').innerText = 'Editar Contato (Admin)';
      document.getElementById('edit-id').value = item.filename;
      document.getElementById('edit-name').value = item.name || '';
      document.getElementById('edit-org').value = item.org || '';
      document.getElementById('edit-category').value = item.category || 'Outros / Gerais';
      document.getElementById('edit-insta').value = item.instagram || '';
      document.getElementById('edit-phone').value = item.phone_primary || '';
      document.getElementById('edit-email').value = item.email || '';
      document.getElementById('edit-desc').value = item.wa_description || '';
      document.getElementById('edit-rating').value = ratings[item.filename] !== undefined ? ratings[item.filename] : (item.rating || 0);

      contactModal.show();
    }

    function saveContact() {
      if (!isAdmin) return;
      const id = document.getElementById('edit-id').value;
      const name = document.getElementById('edit-name').value.trim();
      if (!name) {
        alert('Por favor, informe o nome do contato.');
        return;
      }

      const org = document.getElementById('edit-org').value.trim();
      const category = document.getElementById('edit-category').value.trim() || 'Outros / Gerais';
      let insta = document.getElementById('edit-insta').value.trim();
      if (insta && !insta.startsWith('@')) insta = '@' + insta;

      const phone = document.getElementById('edit-phone').value.trim();
      const email = document.getElementById('edit-email').value.trim();
      const desc = document.getElementById('edit-desc').value.trim();
      const ratingVal = parseInt(document.getElementById('edit-rating').value, 10);

      let digits = phone.replace(/\\D/g, '');
      let waLink = '';
      if (digits) {
        if (digits.length === 10 || digits.length === 11) digits = '55' + digits;
        waLink = 'https://wa.me/' + digits;
      }

      if (id) {
        customEdits[id] = {
          name,
          org,
          category,
          instagram: insta,
          phone_primary: phone,
          phones: phone ? [phone] : [],
          wa_link: waLink,
          email,
          wa_description: desc,
          rating: ratingVal
        };
        localStorage.setItem('contacts_edits', JSON.stringify(customEdits));
        if (ratingVal > 0) {
          ratings[id] = ratingVal;
          localStorage.setItem('ratings_contacts', JSON.stringify(ratings));
        }
      } else {
        const newFilename = 'novo_' + Date.now() + '.vcf';
        const newObj = {
          filename: newFilename,
          name,
          org,
          category,
          instagram: insta,
          phone_primary: phone,
          phones: phone ? [phone] : [],
          wa_link: waLink,
          email,
          wa_description: desc,
          note: '',
          rating: ratingVal
        };
        addedContacts.push(newObj);
        localStorage.setItem('contacts_added', JSON.stringify(addedContacts));
        if (ratingVal > 0) {
          ratings[newFilename] = ratingVal;
          localStorage.setItem('ratings_contacts', JSON.stringify(ratings));
        }
      }

      contactModal.hide();
      renderContacts();
    }

    function deleteContact(filename, name) {
      if (!isAdmin) return;
      if (confirm('Tem certeza que deseja excluir "' + name + '" do catálogo?')) {
        deletedIds.push(filename);
        localStorage.setItem('contacts_deleted', JSON.stringify(deletedIds));
        renderContacts();
      }
    }

    function resetChanges() {
      if (!isAdmin) return;
      if (confirm('Deseja descartar todas as edições, adições e exclusões e retornar ao catálogo original?')) {
        localStorage.removeItem('contacts_edits');
        localStorage.removeItem('contacts_deleted');
        localStorage.removeItem('contacts_added');
        customEdits = {};
        deletedIds = [];
        addedContacts = [];
        renderContacts();
      }
    }

    // Export Helpers
    function exportCSV(e) {
      e.preventDefault();
      const list = getActiveDataset();
      let csv = '\uFEFFNome;Empresa;Categoria;Avaliacao;Telefone;Instagram;WhatsApp Link;Email;Descrição WhatsApp;Notas\\n';
      for (let c of list) {
        const score = ratings[c.filename] !== undefined ? ratings[c.filename] : (c.rating || 0);
        const escapeCsv = (str) => '"' + (str || '').replace(/"/g, '""') + '"';
        csv += [
          escapeCsv(c.name),
          escapeCsv(c.org),
          escapeCsv(c.category),
          escapeCsv(score ? score.toString() : ''),
          escapeCsv(c.phone_primary),
          escapeCsv(c.instagram),
          escapeCsv(c.wa_link),
          escapeCsv(c.email),
          escapeCsv(c.wa_description),
          escapeCsv(c.note)
        ].join(';') + '\\n';
      }
      downloadFile(csv, 'catalogo_contatos_atualizado.csv', 'text/csv;charset=utf-8;');
    }

    function exportJSON(e) {
      e.preventDefault();
      const list = getActiveDataset().map(c => {
        const score = ratings[c.filename] !== undefined ? ratings[c.filename] : (c.rating || 0);
        return { ...c, rating: score };
      });
      downloadFile(JSON.stringify(list, null, 2), 'catalogo_contatos_atualizado.json', 'application/json');
    }

    function downloadFile(content, filename, contentType) {
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Category click handler
    document.getElementById('categories-container').addEventListener('click', (e) => {
      const badge = e.target.closest('.category-badge');
      if (!badge) return;

      document.querySelectorAll('.category-badge').forEach(b => {
        b.classList.remove('active', 'bg-primary');
        b.classList.add('bg-light', 'text-dark', 'border');
      });

      badge.classList.remove('bg-light', 'text-dark', 'border');
      badge.classList.add('active', 'bg-primary');

      currentCategory = badge.dataset.category;
      activeCategoryLabel.innerText = 'Categoria: ' + (currentCategory === 'ALL' ? 'Todas' : currentCategory);
      renderContacts();
    });

    // Search input handler
    searchInput.addEventListener('input', renderContacts);

    // Rating select handler
    minRatingSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      minRatingFilter = (val === 'unrated' || val === 'insta') ? val : parseInt(val, 10);
      renderContacts();
    });

    // Favorites toggle handler
    toggleFavsBtn.addEventListener('click', () => {
      onlyFavorites = !onlyFavorites;
      if (onlyFavorites) {
        toggleFavsBtn.classList.remove('btn-outline-warning');
        toggleFavsBtn.classList.add('btn-warning');
      } else {
        toggleFavsBtn.classList.remove('btn-warning');
        toggleFavsBtn.classList.add('btn-outline-warning');
      }
      renderContacts();
    });

    // Initial render
    applyAdminState();
    renderContacts();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(dir, 'catalogo_servicos.html'), htmlContent, 'utf8');
console.log('Catálogo HTML com layout de logo/avatar corrigido em catalogo_servicos.html');
