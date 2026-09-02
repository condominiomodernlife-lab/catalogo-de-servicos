const fs = require('fs');
const path = require('path');

const dir = __dirname;
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

const categoryIcons = {
  'Climatização & Refrigeração': '❄️',
  'Elétrica & Eletrônica': '⚡',
  'Construção & Reformas': '🛠️',
  'Serviços Domésticos & Manutenção': '🧹',
  'Saúde & Médicos': '🩺',
  'Gastronomia, Alimentos & Festas': '🍕',
  'Fretes, Mudanças & Veículos': '🚚',
  'Pet & Veterinária': '🐾',
  'Beleza & Cuidados Pessoais': '✂️',
  'Tecnologia & Informática': '💻',
  'Costura, Estofados & Decoração': '🧵',
  'Outros / Gerais': '📦'
};

const sortedCategories = Object.entries(categoriesMap).sort((a,b) => b[1] - a[1]);

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  
  <!-- Security & Reputation Meta Tags -->
  <meta name="description" content="Serviços BF - Guia Inteligente de Serviços e Fornecedores com Banco de Dados em Tempo Real.">
  <meta name="author" content="Serviços BF">
  <meta name="robots" content="index, follow">
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="Serviços BF - Guia de Fornecedores">
  <meta property="og:description" content="Guia de fornecedores e prestadores de serviços recomendados com sincronização em tempo real.">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Serviços BF">

  <!-- PWA & Mobile Install Meta Tags -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#1e3c72">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Serviços BF">
  <link rel="apple-touch-icon" href="/icon-192.svg">
  <link rel="icon" type="image/svg+xml" href="/icon-192.svg">
  <link rel="shortcut icon" href="/icon-192.svg">

  <title>Serviços BF - Guia de Fornecedores</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  
  <!-- Supabase Cloud DB Library -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

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
    .db-status-badge {
      font-size: 0.78rem;
      padding: 0.35em 0.75em;
      border-radius: 50px;
    }
  </style>
</head>
<body>

  <!-- Admin Bar -->
  <div class="admin-bar">
    <div class="container d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div>
        <i class="bi bi-shield-lock-fill me-2"></i>
        <strong>Modo Administrador Ativo (Serviços BF)</strong> — Banco de dados em nuvem ativado.
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-primary text-dark" onclick="syncAllToSupabase()">
          <i class="bi bi-cloud-upload me-1"></i> Sincronizar Supabase
        </button>
        <button class="btn btn-sm btn-outline-warning text-dark" onclick="changeAdminPasswordModal()">
          <i class="bi bi-key me-1"></i> Senha
        </button>
        <button class="btn btn-sm btn-dark" onclick="logoutAdmin()">
          <i class="bi bi-box-arrow-right me-1"></i> Sair
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
            <h1 class="fw-bold mb-0"><i class="bi bi-journal-bookmark-fill me-2"></i>Serviços BF</h1>
            <span id="db-status" class="badge bg-success-subtle text-success border border-success-subtle db-status-badge">
              <i class="bi bi-wifi me-1"></i> Supabase Realtime On
            </span>
          </div>
          <p class="mb-0 text-white-50">Encontre prestadores de serviços recomendados perto de você.</p>
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
                <h3 class="fw-bold mb-0" id="stat-cats">${sortedCategories.length}</h3>
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
          <!-- Search Box -->
          <div class="col-lg-3 col-md-12">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0 rounded-start-pill ps-3">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input type="text" id="search-input" class="form-control border-start-0 search-box rounded-end-pill" 
                     placeholder="Buscar por serviço, nome, @insta...">
            </div>
          </div>

          <!-- Category Select Dropdown -->
          <div class="col-lg-3 col-md-6">
            <select id="category-select" class="form-select rounded-pill">
              <option value="NONE" selected>📂 Selecione uma Categoria...</option>
              <option value="ALL">📋 Todas as Categorias (${totalContacts})</option>
              ${sortedCategories.map(([cat, count]) => `
                <option value="${cat.replace(/"/g, '&quot;')}">${categoryIcons[cat] || '🏷️'} ${cat} (${count})</option>
              `).join('')}
            </select>
          </div>

          <!-- Rating Select Dropdown -->
          <div class="col-lg-2 col-md-6">
            <select id="min-rating-select" class="form-select rounded-pill">
              <option value="0">⭐ Avaliações</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 Estrelas)</option>
              <option value="4">⭐⭐⭐⭐+ (4 Estrelas ou +)</option>
              <option value="3">⭐⭐⭐+ (3 Estrelas ou +)</option>
              <option value="insta">📸 Com Instagram</option>
              <option value="unrated">Sem Avaliação</option>
            </select>
          </div>

          <!-- Admin & Action Buttons -->
          <div class="col-lg-4 col-md-12 text-lg-end text-center">
            <!-- PWA Install Button -->
            <button id="pwa-install-btn" class="btn btn-warning rounded-pill me-1 text-dark fw-semibold" onclick="promptInstallPWA()">
              <i class="bi bi-phone-vibrate me-1"></i> Instalar App
            </button>

            <button id="admin-login-btn" class="btn btn-outline-secondary rounded-pill me-1" onclick="promptAdminLogin()">
              <i class="bi bi-lock me-1"></i> Admin
            </button>

            <button class="btn btn-success rounded-pill me-1 admin-only" onclick="triggerVcfUpload()">
              <i class="bi bi-file-earmark-arrow-up me-1"></i> VCF
            </button>
            <input type="file" id="vcf-file-input" accept=".vcf" multiple style="display:none;" onchange="handleVCFFileSelect(event)">

            <button class="btn btn-primary rounded-pill me-1 admin-only" onclick="openAddModal()">
              <i class="bi bi-plus-lg me-1"></i> Novo
            </button>
            <div class="btn-group admin-only">
              <button class="btn btn-outline-success rounded-pill dropdown-toggle" data-bs-toggle="dropdown">
                <i class="bi bi-download"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow">
                <li><a class="dropdown-item" href="#" onclick="exportCSV(event)"><i class="bi bi-file-earmark-excel me-2 text-success"></i>Exportar CSV</a></li>
                <li><a class="dropdown-item" href="#" onclick="exportJSON(event)"><i class="bi bi-filetype-json me-2 text-primary"></i>Exportar JSON</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="exportBlacklist(event)"><i class="bi bi-shield-x me-2"></i>Baixar contatos_excluidos.json</a></li>
              </ul>
            </div>
            <button id="toggle-favs-btn" class="btn btn-outline-warning rounded-pill ms-1" title="Ver Favoritos">
              <i class="bi bi-star-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Info Bar -->
    <div class="d-flex justify-content-between align-items-center mb-3 text-muted">
      <div><strong id="visible-count">0</strong> contatos exibidos</div>
      <div class="d-flex align-items-center gap-3">
        <div id="active-category-label" class="fw-semibold text-primary">Selecione uma categoria ou pesquise acima</div>
        <button id="reset-edits-btn" class="btn btn-sm btn-link text-muted p-0 text-decoration-none admin-only" onclick="resetChanges()">
          <i class="bi bi-arrow-counterclockwise"></i> Restaurar originais
        </button>
      </div>
    </div>

    <!-- Contacts Grid -->
    <div class="row g-3" id="contacts-grid">
      <!-- Initial Landing / Empty State or Filtered Cards -->
    </div>
  </div>

  <!-- Modal Instruções de Instalação PWA iOS/Android -->
  <div class="modal fade" id="pwaModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow">
        <div class="modal-header border-bottom-0 pb-0">
          <h5 class="modal-title fw-bold"><i class="bi bi-phone me-2 text-primary"></i>Instalar Serviços BF</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="text-center mb-3">
            <div class="bg-primary-subtle text-primary d-inline-flex p-3 rounded-circle mb-2">
              <i class="bi bi-phone-vibrate display-5"></i>
            </div>
            <h6 class="fw-bold">Adicione o Serviços BF à sua Tela Inicial</h6>
            <p class="text-muted small mb-0">Acesse o guia de fornecedores como um aplicativo nativo no celular, sem precisar digitar o site!</p>
          </div>

          <div class="card border-0 bg-light rounded-3 p-3 mb-3">
            <h6 class="fw-bold text-dark mb-2"><i class="bi bi-apple me-1"></i> No iPhone / iPad (Safari):</h6>
            <ol class="small text-muted mb-0 ps-3">
              <li class="mb-1">Toque no ícone de <strong>Compartilhar</strong> <i class="bi bi-box-arrow-up text-primary"></i> (na barra inferior do Safari).</li>
              <li>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong> <i class="bi bi-plus-square text-primary"></i>.</li>
            </ol>
          </div>

          <div class="card border-0 bg-light rounded-3 p-3">
            <h6 class="fw-bold text-dark mb-2"><i class="bi bi-android2 me-1 text-success"></i> No Android (Chrome / Samsung):</h6>
            <ol class="small text-muted mb-0 ps-3">
              <li class="mb-1">Toque nos <strong>3 pontinhos</strong> <i class="bi bi-three-dots-vertical"></i> no canto superior do navegador.</li>
              <li>Clique em <strong>"Instalar Aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
            </ol>
          </div>
        </div>
        <div class="modal-footer border-top-0 pt-0">
          <button type="button" class="btn btn-primary rounded-pill px-4 w-100" data-bs-dismiss="modal">Entendido!</button>
        </div>
      </div>
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
                  ${sortedCategories.map(([c]) => `<option value="${c.replace(/"/g, '&quot;')}">`).join('')}
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
    
    // Configuração Supabase Realtime
    const SUPABASE_URL = 'https://ioakxfrwgykxkgnrzxqz.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWt4ZnJ3Z3lreGtnbnJ6eHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTY5NjEsImV4cCI6MjEwMzkzMjk2MX0.pWL-sJa1ueuKCVaP5EfFLvghbeI3YM-PZ5o2fGSC-RM';
    const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
    let supabaseContacts = null;

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
          console.log('PWA ServiceWorker ativo no escopo:', reg.scope);
        }).catch(err => {
          console.log('ServiceWorker PWA:', err);
        });
      });
    }

    // PWA Install Prompt Event
    let deferredPrompt = null;
    const pwaModal = new bootstrap.Modal(document.getElementById('pwaModal'));

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    function promptInstallPWA() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('Usuário aceitou a instalação do PWA');
          }
          deferredPrompt = null;
        });
      } else {
        pwaModal.show();
      }
    }

    // Admin state
    const DEFAULT_PASS = 'admin123';
    let isAdmin = sessionStorage.getItem('is_admin') === 'true';

    // LocalStorage data
    let customEdits = JSON.parse(localStorage.getItem('contacts_edits') || '{}');
    let deletedIds = JSON.parse(localStorage.getItem('contacts_deleted') || '[]');
    let addedContacts = JSON.parse(localStorage.getItem('contacts_added') || '[]');
    let favorites = JSON.parse(localStorage.getItem('fav_contacts') || '[]');
    let ratings = JSON.parse(localStorage.getItem('ratings_contacts') || '{}');

    let currentCategory = 'NONE';
    let onlyFavorites = false;
    let minRatingFilter = 0;

    const grid = document.getElementById('contacts-grid');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const minRatingSelect = document.getElementById('min-rating-select');
    const visibleCount = document.getElementById('visible-count');
    const activeCategoryLabel = document.getElementById('active-category-label');
    const toggleFavsBtn = document.getElementById('toggle-favs-btn');
    const statTotal = document.getElementById('stat-total');
    const statInsta = document.getElementById('stat-insta');
    const resetEditsBtn = document.getElementById('reset-edits-btn');
    const adminLoginBtn = document.getElementById('admin-login-btn');

    const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));

    // Carregamento Supabase em Tempo Real
    async function loadSupabaseData() {
      if (!supabaseClient) return;
      try {
        const { data, error } = await supabaseClient.from('contatos').select('*');
        if (!error && data && data.length > 0) {
          supabaseContacts = data;
          document.getElementById('db-status').innerHTML = '<i class="bi bi-wifi me-1"></i> Supabase Online (' + data.length + ')';
          renderContacts();
        }
      } catch (err) {
        console.log('Supabase read info:', err);
      }
    }

    // Iniciar escuta de alterações Realtime
    if (supabaseClient) {
      loadSupabaseData();
      supabaseClient.channel('realtime-contatos')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contatos' }, () => {
          console.log('Alteração Realtime vinda do Supabase!');
          loadSupabaseData();
        })
        .subscribe();
    }

    // Sincronizar todos os contatos no Supabase (Botão no Admin Bar)
    async function syncAllToSupabase() {
      if (!isAdmin) return;
      if (!supabaseClient) {
        alert('Supabase SDK não carregado.');
        return;
      }
      if (!confirm('Deseja enviar os ' + INITIAL_CONTACTS.length + ' contatos estáticos para o seu banco Supabase agora?')) return;

      alert('⏳ Enviando contatos para o Supabase... Aguarde mensagem de confirmação.');
      
      const payload = INITIAL_CONTACTS.map(c => ({
        filename: c.filename,
        name: c.name,
        org: c.org || '',
        category: c.category || 'Outros / Gerais',
        phone_primary: c.phone_primary || '',
        instagram: c.instagram || '',
        wa_link: c.wa_link || '',
        email: c.email || '',
        wa_description: c.wa_description || '',
        rating: c.rating || 0
      }));

      // Inserir em lotes de 100
      let successCount = 0;
      for (let i = 0; i < payload.length; i += 100) {
        const batch = payload.slice(i, i + 100);
        const { error } = await supabaseClient.from('contatos').upsert(batch, { onConflict: 'filename' });
        if (!error) successCount += batch.length;
      }

      alert('✅ ' + successCount + ' contatos sincronizados com sucesso no Supabase!');
      loadSupabaseData();
    }

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
      const baseList = supabaseContacts || INITIAL_CONTACTS;
      let list = [];

      for (let c of baseList) {
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

    function selectCategoryByName(catName) {
      categorySelect.value = catName;
      currentCategory = catName;
      activeCategoryLabel.innerText = 'Categoria: ' + (catName === 'ALL' ? 'Todas' : catName);
      renderContacts();
    }

    function showAllContacts() {
      categorySelect.value = 'ALL';
      currentCategory = 'ALL';
      activeCategoryLabel.innerText = 'Exibindo Todos os Contatos';
      renderContacts();
    }

    function renderContacts() {
      const activeList = getActiveDataset();
      const query = searchInput.value.toLowerCase().trim();

      // Check if user is in initial empty state
      if (currentCategory === 'NONE' && !query && !onlyFavorites && minRatingFilter === 0) {
        visibleCount.innerText = 0;
        activeCategoryLabel.innerText = 'Selecione uma categoria ou pesquise acima';
        grid.innerHTML = \`
          <div class="col-12 text-center py-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <div class="mb-3">
                <i class="bi bi-search text-primary display-4"></i>
              </div>
              <h4 class="fw-bold text-dark mb-2">Qual serviço você procura hoje?</h4>
              <p class="text-muted mb-4 mx-auto" style="max-width: 550px;">
                Selecione uma categoria no menu acima ou digite na barra de busca (ex: <i>eletricista, pedreiro, dentista, marmita, ar condicionado</i>).
              </p>
              <div class="d-flex justify-content-center flex-wrap gap-2 mb-3">
                <button class="btn btn-outline-primary rounded-pill px-3 py-2" onclick="selectCategoryByName('Climatização & Refrigeração')">❄️ Climatização & Refrigeração</button>
                <button class="btn btn-outline-primary rounded-pill px-3 py-2" onclick="selectCategoryByName('Construção & Reformas')">🛠️ Construção & Reformas</button>
                <button class="btn btn-outline-primary rounded-pill px-3 py-2" onclick="selectCategoryByName('Saúde & Médicos')">🩺 Saúde & Médicos</button>
                <button class="btn btn-outline-primary rounded-pill px-3 py-2" onclick="selectCategoryByName('Gastronomia, Alimentos & Festas')">🍕 Gastronomia & Festas</button>
                <button class="btn btn-outline-primary rounded-pill px-3 py-2" onclick="selectCategoryByName('Serviços Domésticos & Manutenção')">🧹 Serviços Domésticos</button>
              </div>
              <div>
                <button class="btn btn-sm btn-link text-muted text-decoration-none" onclick="showAllContacts()">
                  <i class="bi bi-grid-3x3-gap me-1"></i> Ver todos os \${activeList.length} contatos cadastrados
                </button>
              </div>
            </div>
          </div>
        \`;
        updateStats(activeList);
        return;
      }

      grid.innerHTML = '';
      let count = 0;

      for (let i = 0; i < activeList.length; i++) {
        const c = activeList[i];
        const userRating = ratings[c.filename] !== undefined ? ratings[c.filename] : (c.rating || 0);

        // Filter by category
        if (currentCategory !== 'ALL' && currentCategory !== 'NONE' && c.category !== currentCategory) {
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
            <button class="action-btn action-btn-danger" onclick="deleteContact('\${escapeHtml(c.filename)}', '\${escapeHtml(c.name)}')" title="Excluir Contato Permanentemente">
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

      if (count === 0) {
        grid.innerHTML = \`
          <div class="col-12 text-center py-5 text-muted">
            <i class="bi bi-emoji-frown display-4 mb-2 d-block"></i>
            <h5>Nenhum contato encontrado para a pesquisa/filtro.</h5>
            <p>Tente buscar por termos mais genéricos ou selecionar outra categoria.</p>
          </div>
        \`;
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

      // Sincronizar nota no Supabase
      if (supabaseClient) {
        supabaseClient.from('contatos').update({ rating: score }).eq('filename', filename);
      }
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

    // VCF Browser Importer Logic
    function triggerVcfUpload() {
      if (!isAdmin) return;
      document.getElementById('vcf-file-input').click();
    }

    function handleVCFFileSelect(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      let processedCount = 0;
      let newContactsAdded = 0;
      const activeList = getActiveDataset();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = async function(e) {
          const text = e.target.result;
          const parsedList = parseVCFBrowser(text, file.name);
          
          for (let newC of parsedList) {
            if (deletedIds.includes(newC.filename)) continue;

            const cleanPhone = newC.phone_primary ? newC.phone_primary.replace(/\\D/g, '') : '';
            const cleanName = newC.name.toLowerCase().trim();

            const existing = activeList.find(c => {
              const cp = c.phone_primary ? c.phone_primary.replace(/\\D/g, '') : '';
              if (cleanPhone && cleanPhone.length >= 8 && cp === cleanPhone) return true;
              if (c.name.toLowerCase().trim() === cleanName) return true;
              return false;
            });

            if (!existing) {
              addedContacts.push(newC);
              activeList.push(newC);
              newContactsAdded++;

              // Enviar direto para o Supabase
              if (supabaseClient) {
                await supabaseClient.from('contatos').upsert([{
                  filename: newC.filename,
                  name: newC.name,
                  org: newC.org || '',
                  category: newC.category || 'Outros / Gerais',
                  phone_primary: newC.phone_primary || '',
                  instagram: newC.instagram || '',
                  wa_link: newC.wa_link || '',
                  email: newC.email || '',
                  wa_description: newC.wa_description || '',
                  rating: 0
                }]);
              }
            }
          }

          processedCount++;
          if (processedCount === files.length) {
            localStorage.setItem('contacts_added', JSON.stringify(addedContacts));
            showAllContacts();
            alert('✅ Importação concluída! ' + newContactsAdded + ' novo(s) contato(s) adicionado(s) com sucesso ao catálogo.');
            document.getElementById('vcf-file-input').value = '';
          }
        };
        reader.readAsText(file);
      }
    }

    const categoryRulesJS = [
      { name: 'Climatização & Refrigeração', keywords: ['ar condicionado', 'refrigera', 'geladeira', 'split', 'clima', 'freezer', 'boiller', 'aquecedor'] },
      { name: 'Elétrica & Eletrônica', keywords: ['eletric', 'eletrec', 'eletronica', 'eletrônica', 'tomada', 'câmera', 'camera', 'tv', 'luz', 'iluminação'] },
      { name: 'Construção & Reformas', keywords: ['pedreiro', 'marceneiro', 'marcenaria', 'pintor', 'gesso', 'vidraceiro', 'vidro', 'serralhe', 'esquadria', 'obra', 'reforma', 'granito', 'mármore', 'marmore', 'piso', 'arquitet', 'engenhar'] },
      { name: 'Serviços Domésticos & Manutenção', keywords: ['diaria', 'diarista', 'faxina', 'passadeira', 'limpeza', 'sofá', 'sofa', 'dedetiza', 'detetiza', 'bombeiro', 'encanador', 'chaveiro', 'desentupidora', 'cuidador', 'babá', 'baba', 'reparos', 'conserto'] },
      { name: 'Saúde & Médicos', keywords: ['dentista', 'médic', 'medic', 'doutor', 'dra.', 'dr.', 'dra ', 'dr ', 'clínica', 'clinica', 'odontolog', 'fisioterap', 'fono', 'psicól', 'psicol', 'geriatra', 'pneumo', 'dermato', 'endocrino', 'pediatra', 'podólog', 'podolog', 'ortoped', 'hospital', 'farmácia', 'farmacia', 'nutri', 'terapeuta'] },
      { name: 'Gastronomia, Alimentos & Festas', keywords: ['buffet', 'bolo', 'doce', 'confeit', 'salgado', 'cerveja', 'bar', 'restaurante', 'pizzar', 'coxinha', 'empada', 'café', 'cafe', 'lanch', 'churrasc', 'garçom', 'festa', 'balão', 'balao', 'marmita', 'comida', 'peixaria', 'açougu', 'acougu', 'frutas', 'ovos', 'queijo', 'bebida', 'rotisseria', 'padaria', 'cerimonial'] },
      { name: 'Fretes, Mudanças & Veículos', keywords: ['frete', 'mudança', 'mudanca', 'uber', 'motorista', 'borrachar', 'mecânic', 'mecanic', 'carro', 'auto', 'insulfilm', 'bateria', 'pneu', 'oficina', 'veículo', 'veiculo', 'transporte', 'reboque'] },
      { name: 'Pet & Veterinária', keywords: ['pet', 'veterinár', 'veterinar', 'vet', 'canil', 'tosa', 'banho', 'cachorro', 'gato', 'ração', 'racao', 'animal'] },
      { name: 'Beleza & Cuidados Pessoais', keywords: ['salão', 'salao', 'manicure', 'sobrancelha', 'cabelo', 'maquiad', 'barbearia', 'barbeiro', 'unha', 'estétic', 'estetic', 'depila', 'massag', 'podologia'] },
      { name: 'Tecnologia & Informática', keywords: ['informática', 'informatica', 'computador', 'notebook', 'manutenção', 'suporte', 'tecnologia', 'cartucho', 'impressora', 'internet', 'site', 'software'] },
      { name: 'Costura, Estofados & Decoração', keywords: ['costura', 'costureira', 'roupa', 'bordado', 'ateliê', 'atelie', 'uniforme', 'cortina', 'persiana', 'estofad', 'papel de parede', 'decora', 'moldura', 'toldo'] }
    ];

    function getCategoryJS(text) {
      const lower = text.replace(/X-ABLabel:Celular/gi, '').replace(/TYPE=CELL/gi, '').toLowerCase();
      for (const rule of categoryRulesJS) {
        if (rule.keywords.some(kw => lower.includes(kw))) {
          return rule.name;
        }
      }
      return 'Outros / Gerais';
    }

    function extractInstagramJS(text) {
      if (!text) return '';
      const regex = /@([a-zA-Z0-9_\\.]+)/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        let handle = match[1];
        handle = handle.replace(/\\.vcf$/i, '').replace(/\\.$/, '');
        const lower = handle.toLowerCase();
        if (['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'bol.com.br', 'vcf'].includes(lower)) continue;
        if (handle.length >= 3) return '@' + handle;
      }
      return '';
    }

    function parseVCFBrowser(vcfText, filename) {
      const unfolded = vcfText.replace(/\\r?\\n[ \\t]/g, '');
      const vcards = unfolded.split(/END:VCARD/i).filter(v => v.includes('BEGIN:VCARD'));
      const parsedContacts = [];

      for (const vcard of vcards) {
        const lines = vcard.split(/\\r?\\n/);
        let fn = '';
        let org = '';
        let title = '';
        let phones = [];
        let emails = [];
        let waDesc = '';
        let waName = '';
        let note = '';

        for (let line of lines) {
          line = line.trim();
          if (!line) continue;
          const colonIdx = line.indexOf(':');
          if (colonIdx === -1) continue;

          const rawKey = line.substring(0, colonIdx);
          let val = line.substring(colonIdx + 1);

          const keyUpper = rawKey.toUpperCase();
          if (keyUpper.startsWith('FN')) {
            fn = val;
          } else if (keyUpper.startsWith('N;') || keyUpper === 'N') {
            if (!fn) {
              const parts = val.split(';').filter(Boolean);
              fn = parts.reverse().join(' ');
            }
          } else if (keyUpper.startsWith('ORG')) {
            org = val.replace(/;/g, ' ').trim();
          } else if (keyUpper.startsWith('TITLE')) {
            title = val;
          } else if (keyUpper.includes('TEL')) {
            if (val) phones.push(val);
          } else if (keyUpper.includes('EMAIL')) {
            if (val) emails.push(val);
          } else if (keyUpper.includes('X-WA-BIZ-DESCRIPTION')) {
            waDesc = val;
          } else if (keyUpper.includes('X-WA-BIZ-NAME')) {
            waName = val;
          } else if (keyUpper.startsWith('NOTE')) {
            note = val;
          }
        }

        if (!fn || fn.trim() === '') {
          fn = (filename || 'contato').replace(/\\.vcf$/i, '');
        }

        const cleanPhones = [];
        const waLinks = [];
        for (let p of phones) {
          let digits = p.replace(/\\D/g, '');
          if (!digits) continue;
          let waDigits = digits;
          if (digits.length === 10 || digits.length === 11) waDigits = '55' + digits;
          let formatted = p;
          if (digits.length === 11 && digits.startsWith('55')) {
            const ddd = digits.substring(2, 4);
            const num = digits.substring(4);
            formatted = \`(\${ddd}) \${num.substring(0, 5)}-\${num.substring(5)}\`;
          } else if (digits.length === 13 && digits.startsWith('55')) {
            const ddd = digits.substring(2, 4);
            const num = digits.substring(4);
            formatted = \`+55 (\${ddd}) \${num.substring(0, 5)}-\${num.substring(5)}\`;
          } else if (digits.length === 11) {
            const ddd = digits.substring(0, 2);
            const num = digits.substring(2);
            formatted = \`(\${ddd}) \${num.substring(0, 5)}-\${num.substring(5)}\`;
          }
          cleanPhones.push(formatted);
          waLinks.push(\`https://wa.me/\${waDigits}\`);
        }

        const fullText = (filename || '') + ' ' + fn + ' ' + org + ' ' + waDesc + ' ' + note;
        const instagram = extractInstagramJS(fullText);
        const category = getCategoryJS(fullText);

        parsedContacts.push({
          filename: (filename || ('import_' + Date.now())).replace(/\\.vcf$/i, '') + '_' + Math.random().toString(36).substring(2, 7) + '.vcf',
          name: fn.trim(),
          org: (org || waName || '').trim(),
          title: title.trim(),
          category: category,
          phones: cleanPhones,
          phone_primary: cleanPhones[0] || '',
          wa_link: waLinks[0] || '',
          email: emails[0] || '',
          wa_description: waDesc.trim(),
          note: note.trim(),
          instagram: instagram,
          rating: 0
        });
      }

      return parsedContacts;
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

    async function saveContact() {
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

      const updatedObj = {
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

      if (id) {
        customEdits[id] = updatedObj;
        localStorage.setItem('contacts_edits', JSON.stringify(customEdits));
        if (supabaseClient) {
          await supabaseClient.from('contatos').upsert([{ filename: id, ...updatedObj }]);
        }
      } else {
        const newFilename = 'novo_' + Date.now() + '.vcf';
        const newObj = { filename: newFilename, ...updatedObj, note: '' };
        addedContacts.push(newObj);
        localStorage.setItem('contacts_added', JSON.stringify(addedContacts));
        if (supabaseClient) {
          await supabaseClient.from('contatos').upsert([newObj]);
        }
      }

      contactModal.hide();
      renderContacts();
    }

    async function deleteContact(filename, name) {
      if (!isAdmin) return;
      if (confirm('Tem certeza que deseja EXCLUIR PERMANENTEMENTE o contato "' + name + '"?\\n\\nEle será adicionado à lista negra e excluído do banco de dados.')) {
        if (!deletedIds.includes(filename)) {
          deletedIds.push(filename);
        }
        localStorage.setItem('contacts_deleted', JSON.stringify(deletedIds));
        if (supabaseClient) {
          await supabaseClient.from('contatos').delete().eq('filename', filename);
        }
        renderContacts();
      }
    }

    function resetChanges() {
      if (!isAdmin) return;
      if (confirm('Deseja descartar as alterações locais e retornar aos dados originais?')) {
        localStorage.removeItem('contacts_edits');
        localStorage.removeItem('contacts_deleted');
        localStorage.removeItem('contacts_added');
        customEdits = {};
        deletedIds = [];
        addedContacts = [];
        currentCategory = 'NONE';
        categorySelect.value = 'NONE';
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

    function exportBlacklist(e) {
      e.preventDefault();
      downloadFile(JSON.stringify(deletedIds, null, 2), 'contatos_excluidos.json', 'application/json');
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

    // Category select handler
    categorySelect.addEventListener('change', (e) => {
      const val = e.target.value;
      currentCategory = val;
      activeCategoryLabel.innerText = 'Categoria: ' + (val === 'ALL' ? 'Todas' : (val === 'NONE' ? 'Nenhuma' : val));
      renderContacts();
    });

    // Search input handler
    searchInput.addEventListener('input', () => {
      if (currentCategory === 'NONE' && searchInput.value.trim().length > 0) {
        currentCategory = 'ALL';
        categorySelect.value = 'ALL';
      }
      renderContacts();
    });

    // Rating select handler
    minRatingSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      minRatingFilter = (val === 'unrated' || val === 'insta') ? val : parseInt(val, 10);
      if (minRatingFilter !== 0 && currentCategory === 'NONE') {
        currentCategory = 'ALL';
        categorySelect.value = 'ALL';
      }
      renderContacts();
    });

    // Favorites toggle handler
    toggleFavsBtn.addEventListener('click', () => {
      onlyFavorites = !onlyFavorites;
      if (onlyFavorites) {
        toggleFavsBtn.classList.remove('btn-outline-warning');
        toggleFavsBtn.classList.add('btn-warning');
        if (currentCategory === 'NONE') {
          currentCategory = 'ALL';
          categorySelect.value = 'ALL';
        }
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
fs.writeFileSync(path.join(dir, 'index.html'), htmlContent, 'utf8');
console.log('build_html.js atualizado com o nome Serviços BF!');
