# Plan de Travail - DevFolio (8 semaines)

## Vue d'ensemble

**Durée** : 8 semaines (2 mois)  
**Méthodologie** : Sprints de 2 semaines  
**Paiement** : Orange Money uniquement (V1)  
**Structure** : 
```
office-work-mdg/
├── backend/   # Laravel 12 API REST (SPA indépendante)
└── frontend/  # React + TypeScript + Vite
```

---

## 🚀 Sprint 1 : Fondations (Semaines 1-2)

### Objectif
Infrastructure de base + Authentification complète

### Backend Laravel API REST

**Jour 1-2 : Configuration**
- [ ] Transformer backend actuel en API REST pure
- [ ] Supprimer routes web (garder API seulement)
- [ ] Configurer CORS pour frontend
- [ ] Installer Laravel Sanctum (auth API)
- [ ] Setup .env (DB, Mail)

**Jour 3-5 : Auth API**
- [ ] Migration users (+ username, avatar, title, bio, github_token, orange_money_number)
- [ ] POST /api/auth/register (avec email verification)
- [ ] POST /api/auth/login (return JWT token)
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/user
- [ ] POST /api/auth/forgot-password
- [ ] POST /api/auth/reset-password
- [ ] POST /api/auth/verify-email

**Jour 6-7 : Base de données**
- [ ] Migration `templates` (name, slug, is_premium, config_json)
- [ ] Migration `portfolios` (user_id, template_id, slug, subdomain, content_json)
- [ ] Migration `projects` (portfolio_id, title, technologies, github_url, images)
- [ ] Migration `subscriptions` (user_id, plan_type, status, orange_money_number)
- [ ] Migration `payments` (user_id, amount, orange_money_transaction_id, status)
- [ ] Seeder 3 templates gratuits (Minimal Light, Dark Developer, Classic)

**Jour 8-10 : Tests & Sécurité**
- [ ] Tests API Auth (PHPUnit/Pest)
- [ ] Middleware auth:sanctum
- [ ] Rate limiting (60/min auth, 10/min public)
- [ ] Validation stricte inputs

### Frontend React

**Jour 1-3 : Setup**
- [ ] Config Vite + React (SPA indépendante) + TypeScript
- [ ] Install: react-router-dom, @tanstack/react-query, zustand, axios
- [ ] Install: tailwindcss, shadcn/ui
- [ ] Config Tailwind
- [ ] Structure dossiers (components, pages, lib, hooks, stores, types)

**Jour 4-6 : Auth Frontend**
- [ ] Axios instance (lib/api.ts) avec interceptors
- [ ] Zustand authStore (user, token, login, logout)
- [ ] Page /register (form + validation Zod)
- [ ] Page /login
- [ ] Page /forgot-password
- [ ] Page /reset-password/:token
- [ ] ProtectedRoute component
- [ ] Toast notifications (sonner)

**Jour 7-10 : Layouts & Navigation**
- [ ] GuestLayout (navbar + footer)
- [ ] AuthLayout (sidebar)
- [ ] Page / (landing basique)
- [ ] Page /dashboard (vide pour l'instant)
- [ ] React Router setup

**✅ Livrables Sprint 1**
- Auth backend + frontend fonctionnel
- DB structurée avec 3 templates
- Landing page + Dashboard basiques

---

## 🎨 Sprint 2 : Templates & Éditeur (Semaines 3-4)

### Objectif
Système templates + Éditeur portfolio complet

### Backend

**Jour 1-3 : API Templates & Portfolios**
- [ ] TemplateController
  - GET /api/templates (avec filter is_premium)
  - GET /api/templates/{id}
- [ ] PortfolioController
  - GET /api/portfolios (mes portfolios)
  - POST /api/portfolios (créer depuis template_id)
  - GET /api/portfolios/{id}
  - PUT /api/portfolios/{id} (update content_json)
  - DELETE /api/portfolios/{id}
  - POST /api/portfolios/{id}/publish (is_published = true)
- [ ] PortfolioPolicy (user owns portfolio)
- [ ] Génération slug unique automatique

**Jour 4-7 : API Projects**
- [ ] ProjectController
  - GET /api/portfolios/{id}/projects
  - POST /api/portfolios/{id}/projects
  - PUT /api/projects/{id}
  - DELETE /api/projects/{id}
- [ ] Upload images projets (Storage local ou Cloudflare R2)
- [ ] Resize/optimize images (intervention/image)
- [ ] Validation: max 5 images/projet, 5MB/image
- [ ] POST /api/projects/{id}/images

**Jour 8-10 : Tests**
- [ ] Tests CRUD portfolios
- [ ] Tests CRUD projects
- [ ] Tests upload images
- [ ] Tests permissions (user can't edit others)

### Frontend

**Jour 1-3 : Galerie Templates**
- [ ] Page /templates
- [ ] Fetch GET /api/templates
- [ ] Affichage cards (thumbnail, nom, badge premium)
- [ ] Filter Free/Premium
- [ ] Modal preview template (iframe)
- [ ] Bouton "Use Template" → POST /api/portfolios

**Jour 4-7 : Dashboard**
- [ ] Page /dashboard
- [ ] Fetch GET /api/portfolios
- [ ] Liste portfolios (cards avec preview)
- [ ] Bouton "Create New Portfolio" → redirect /templates
- [ ] Actions par card:
  - Edit → /editor/{id}
  - View Live → /{username}
  - Duplicate → POST /api/portfolios/{id}/clone
  - Delete → DELETE /api/portfolios/{id} (modal confirmation)
- [ ] Stats: total portfolios, views (fake pour l'instant)

**Jour 8-14 : Éditeur Portfolio**
- [ ] Page /editor/:id
- [ ] Layout: Sidebar gauche + Panel central + Preview droite
- [ ] **Sidebar gauche** (menu sections):
  - Hero
  - About
  - Projects
  - Skills
  - Contact
- [ ] **Panel central** (formulaires):
  - Hero Section:
    - Input title, subtitle
    - Input CTA text + link
    - Upload avatar
  - About Section:
    - WYSIWYG editor (TipTap/Quill)
    - Upload image
    - Upload CV (PDF)
  - Projects Section:
    - Liste projects
    - Bouton Add Project (modal)
    - Form: title, description, technologies (tags), github_url, demo_url
    - Upload images (max 5)
    - Edit/Delete actions
  - Skills Section:
    - Tags input avec autocomplete
    - Sélection niveau (Débutant/Intermédiaire/Avancé/Expert)
  - Contact Section:
    - Input email, phone
    - Links socials (GitHub, LinkedIn, Twitter)
- [ ] **Preview droite** (iframe):
  - Render live portfolio HTML
  - Refresh automatique lors changement
- [ ] Autosave toutes les 30s (debounce)
- [ ] Bouton "Publish" → POST /api/portfolios/{id}/publish
- [ ] Loading states partout

**✅ Livrables Sprint 2**
- Galerie templates fonctionnelle
- Dashboard avec CRUD portfolios
- Éditeur complet opérationnel
- Preview temps réel

---

## 🐙 Sprint 3 : GitHub & Publication (Semaines 5-6)

### Objectif
Import GitHub automatique + Publication portfolios

### Backend

**Jour 1-4 : GitHub OAuth & Import**
- [ ] Créer GitHub OAuth App (client_id, client_secret)
- [ ] GET /api/github/auth (redirect vers GitHub OAuth)
- [ ] GET /api/github/callback (handle code, store github_token)
- [ ] GitHubService:
  - Fetch user repos via GitHub API
  - Parse README pour description
  - Extract languages (%)
- [ ] GET /api/github/repos (return liste repos)
- [ ] POST /api/github/import (body: portfolio_id, repo_ids[])
  - Créer projects automatiquement
- [ ] POST /api/github/sync (re-fetch repos, update projects)
- [ ] DELETE /api/github/disconnect (remove github_token)
- [ ] Queue Job: SyncGitHubReposJob (async)

**Jour 5-7 : Publication Portfolios**
- [ ] PortfolioRendererService:
  - Génération HTML statique depuis content_json + template
  - Injecter data dans template Blade
- [ ] Route publique GET /{username}
  - Fetch portfolio by user.username
  - Return HTML statique
- [ ] Sous-domaine automatique:
  - Config DNS wildcard `*.devfolio.io`
  - Nginx/Caddy routing sous-domaines
- [ ] SSL automatique (Let's Encrypt via Caddy)
- [ ] Génération sitemap.xml par portfolio
- [ ] Génération robots.txt

**Jour 8-10 : Custom Domains (Premium)**
- [ ] Migration `domains` (user_id, portfolio_id, domain, status)
- [ ] POST /api/domains (add custom domain)
- [ ] GET /api/domains/{id}/verify
  - Check DNS CNAME record
  - Update status si valid
- [ ] Instructions DNS pour user
- [ ] SSL automatique custom domains
- [ ] Middleware CheckSubscription (premium required)
- [ ] Limite 3 domains/user

### Frontend

**Jour 1-3 : GitHub Integration**
- [ ] Page /settings/github
- [ ] Bouton "Connect GitHub" → GET /api/github/auth (popup OAuth)
- [ ] Handle callback → fetch user
- [ ] GET /api/github/repos → afficher liste
- [ ] Checkboxes sélection repos
- [ ] Bouton "Import Selected" → POST /api/github/import
- [ ] Loading state import
- [ ] Affichage repos importés dans /editor
- [ ] Bouton "Sync GitHub" → POST /api/github/sync

**Jour 4-6 : Publication**
- [ ] Modal "Publish Portfolio" (depuis /editor):
  - Input subdomain (validation unique)
  - Input SEO title
  - Textarea SEO description
  - Bouton Confirm → POST /api/portfolios/{id}/publish
- [ ] Affichage URL publique après publish:
  - `https://{subdomain}.devfolio.io`
  - `https://devfolio.io/{username}`
- [ ] Bouton "View Live Site" (open new tab)
- [ ] Page publique /{username}:
  - Fetch portfolio data
  - Render HTML optimisé
  - Meta tags SEO
  - Open Graph tags

**Jour 7-10 : Custom Domains (Premium)**
- [ ] Page /settings/domains
- [ ] Form add domain:
  - Input domain name
  - Bouton Add → POST /api/domains
- [ ] Affichage instructions DNS:
  - "Add CNAME record: `www` → `devfolio.io`"
  - "Add CNAME record: `@` → `devfolio.io`"
- [ ] Bouton "Verify DNS" → GET /api/domains/{id}/verify
- [ ] Status badge (pending/active/failed)
- [ ] Liste domains avec delete action
- [ ] Premium gate (modal "Upgrade to Premium")

**✅ Livrables Sprint 3**
- GitHub OAuth + import fonctionnel
- Publication sur sous-domaine
- Preview publique live optimisée
- Custom domains (premium)

---

## 💰 Sprint 4 : Orange Money & Analytics (Semaine 7)

### Objectif
Intégration Orange Money + Analytics basiques

### Backend

**Jour 1-4 : Orange Money Integration**
- [ ] Créer compte marchand Orange Money
- [ ] Obtenir API credentials (merchant_id, api_key)
- [ ] Config .env ORANGE_MONEY_*
- [ ] OrangeMoneyService:
  - Initier paiement (montant, numéro OM)
  - Vérifier statut transaction
  - Callback webhook
- [ ] POST /api/subscription/checkout
  - Body: plan_type (monthly/yearly), orange_money_number
  - Create payment record (status: pending)
  - Call Orange Money API
  - Return transaction_id
- [ ] POST /api/subscription/webhook (Orange Money callback)
  - Verify signature
  - Update payment status (completed/failed)
  - If completed: create/update subscription
  - Send email confirmation
- [ ] GET /api/subscription (current subscription info)
- [ ] GET /api/subscription/history (liste payments)
- [ ] POST /api/subscription/cancel (ends_at = now + 30 days)

**Jour 5-6 : Restrictions Freemium**
- [ ] Middleware CheckSubscription:
  - Vérifier user->isPremium()
  - Si false et route premium → 402 Payment Required
- [ ] Dans PortfolioController->store():
  - Check user portfolios count
  - If >= 1 et !premium → error "Limit reached"
- [ ] Dans ProjectController->store():
  - Check portfolio projects count
  - If >= 3 et !premium → error "Limit reached"
- [ ] Templates premium hidden si !premium

**Jour 7-9 : Analytics Basiques**
- [ ] Migration `analytics` (portfolio_id, visitor_ip_hash, page_view, device, referrer, visited_at)
- [ ] POST /api/track (public endpoint)
  - Body: portfolio_id, page_view, device, referrer
  - Hash IP (RGPD)
  - Store analytics record
- [ ] GET /api/portfolios/{id}/analytics (premium)
  - Return stats:
    - Total views
    - Views last 7/30 days
    - Top referrers
    - Devices breakdown (mobile/desktop)
- [ ] Middleware premium sur analytics endpoint

**Jour 10 : Tests**
- [ ] Mock Orange Money API responses
- [ ] Test webhook signature verification
- [ ] Test subscription creation/update
- [ ] Test freemium restrictions
- [ ] Test analytics tracking

### Frontend

**Jour 1-3 : Page Pricing**
- [ ] Page /pricing
- [ ] Comparaison plans (2 cards):
  - **Gratuit**:
    - 1 portfolio
    - 3 projets
    - Templates basiques (3)
    - Sous-domaine
    - Branding
  - **Premium (2000 Ar/mois ou 20000 Ar/an)**:
    - Portfolios illimités
    - Projets illimités
    - Tous templates (8+)
    - GitHub sync auto
    - Custom domains (3)
    - Export code
    - Analytics
    - Pas branding
- [ ] Toggle mensuel/annuel (badge "-17%")
- [ ] Bouton "Start Free" → /register
- [ ] Bouton "Upgrade to Premium" → /settings/billing

**Jour 4-6 : Gestion Abonnement**
- [ ] Page /settings/billing
- [ ] GET /api/subscription → afficher plan actuel
- [ ] Si gratuit:
  - Card "Free Plan"
  - Bouton "Upgrade to Premium"
- [ ] Si premium:
  - Card "Premium Plan"
  - Date renouvellement
  - Montant
  - Bouton "Cancel Subscription" (modal confirmation)
- [ ] Form paiement Orange Money:
  - Input numéro Orange Money (format: 034 XX XXX XX)
  - Validation format
  - Select plan (monthly/yearly)
  - Bouton "Pay" → POST /api/subscription/checkout
  - Redirect confirmation page
- [ ] Page /payment/success:
  - Message "Payment processing..."
  - Poll GET /api/subscription toutes les 3s
  - Si active → redirect /dashboard (toast success)
- [ ] GET /api/subscription/history → liste paiements
  - Date, montant, status, reçu PDF

**Jour 7-9 : Analytics Dashboard (Premium)**
- [ ] Page /analytics/:id (premium gate)
- [ ] GET /api/portfolios/{id}/analytics
- [ ] Charts (Recharts):
  - Line chart: Views over time (7/30 days)
  - Pie chart: Devices (mobile/desktop/tablet)
  - Bar chart: Top 5 referrers
- [ ] Filters: 7 days / 30 days / All time
- [ ] Stats cards:
  - Total views
  - Unique visitors (fake pour V1)
  - Avg time on page (fake pour V1)
- [ ] Export CSV (bonus)

**Jour 10 : Restrictions UI**
- [ ] Dashboard:
  - Si 1 portfolio et !premium → banner "Upgrade to create more"
- [ ] Editor projects:
  - Si 3 projets et !premium → disable add button + tooltip
- [ ] Templates gallery:
  - Badge "Premium" sur templates premium
  - Modal "Upgrade Required" si click premium
- [ ] Modal "Upgrade to Premium":
  - Pricing comparison
  - Bouton → /settings/billing

**✅ Livrables Sprint 4**
- Orange Money paiements fonctionnels
- Webhooks abonnements
- Restrictions freemium appliquées
- Analytics basiques (premium)
- Page pricing + billing

---

## 🎯 Sprint 5 : Finalisation & Launch (Semaine 8)

### Objectif
Landing page SEO + Tests + Déploiement production

### Backend

**Jour 1-2 : Optimisations**
- [ ] Eager loading Eloquent (éviter N+1 queries)
- [ ] Indexes DB:
  - users(username, email)
  - portfolios(subdomain, user_id)
  - projects(portfolio_id)
- [ ] Cache templates (Redis optionnel)
- [ ] Compression responses (gzip)
- [ ] Queue jobs:
  - SendEmailVerificationJob
  - SyncGitHubReposJob
  - SendPaymentConfirmationJob

**Jour 3-4 : SEO & Sitemap**
- [ ] GET /sitemap.xml (global sitemap)
  - Liste tous portfolios publiés
  - Format XML standard
- [ ] Meta tags dynamiques portfolios publics:
  - title, description
  - og:title, og:description, og:image
  - twitter:card
- [ ] Schema.org markup (Person type):
  - name, jobTitle, url, sameAs (socials)
- [ ] robots.txt

**Jour 5 : Documentation**
- [ ] README.md:
  - Installation instructions
  - .env.example complet
  - Commands artisan
- [ ] API documentation (Swagger/Postman)
- [ ] Guide Orange Money setup
- [ ] Guide déploiement production

### Frontend

**Jour 1-3 : Landing Page Optimisée**
- [ ] Page / (refonte complète):
  - **Hero section**:
    - Titre: "Build Your Developer Portfolio in Minutes"
    - Sous-titre: "Import from GitHub, Choose a Template, Publish Instantly"
    - CTA: "Start Free" → /register
    - Animation/Illustration moderne
  - **Features section** (4 features):
    - GitHub Auto-Import (icon + description)
    - Beautiful Templates (carousel 3 templates)
    - Custom Domains (badge premium)
    - SEO Optimized (stats)
  - **Templates Preview**:
    - Carousel 5-6 templates
    - Bouton "View All" → /templates
  - **Pricing section**:
    - Cards Free vs Premium
    - Toggle monthly/yearly
    - Bouton "Get Started"
  - **FAQ section**:
    - 5-6 questions fréquentes (accordions)
  - **Footer**:
    - Links: About, Pricing, Templates, Blog (fake)
    - Legal: Privacy Policy, Terms of Service
    - Socials: Twitter, LinkedIn, GitHub
- [ ] Animations smooth (Framer Motion)
- [ ] Mobile responsive 100%

**Jour 4-5 : SEO Frontend**
- [ ] React Helmet Async:
  - Meta tags par page
  - Dynamiques portfolios publics
- [ ] sitemap.xml frontend (pages statiques)
- [ ] robots.txt
- [ ] Performance:
  - Lazy load images (React.lazy)
  - Code splitting routes
  - Minification Vite production
  - WebP images
  - CDN Cloudflare assets
- [ ] Lighthouse audit:
  - Performance > 90
  - Accessibility > 90
  - Best Practices > 90
  - SEO > 90

**Jour 6-7 : Tests E2E**
- [ ] Playwright/Cypress setup
- [ ] Tests:
  - Auth flow (register → verify email → login)
  - Create portfolio (select template → edit → publish)
  - GitHub import (OAuth → import repos)
  - Orange Money payment (mock webhook)
- [ ] Tests responsive (mobile/tablet/desktop)
- [ ] Tests cross-browser (Chrome/Firefox/Safari)

**Jour 8-10 : Finalisation**
- [ ] Fix tous bugs identifiés
- [ ] Review UX:
  - Loading states
  - Error messages
  - Success toasts
- [ ] Pages légales:
  - /legal/privacy (RGPD compliant)
  - /legal/terms (CGU/CGV)
  - /legal/cookies
- [ ] Guide utilisateur:
  - Page /help
  - 5-6 articles: "How to create portfolio", "GitHub import", etc.
- [ ] Setup support email: support@devfolio.io

### Déploiement Production

**Infrastructure**
- [ ] **Backend Railway/Render**:
  - Config env variables
  - DB production PlanetScale/Railway MySQL
  - Queue worker actif
  - Cron jobs:
    - `php artisan queue:work` (permanent)
    - `php artisan schedule:run` (daily GitHub sync premium users)
- [ ] **Frontend Vercel**:
  - Config env variables (VITE_API_URL)
  - Custom domain devfolio.io
  - Auto-deploy branch production
- [ ] **DNS Cloudflare**:
  - A record: devfolio.io → Vercel
  - CNAME: api.devfolio.io → Railway
  - CNAME wildcard: *.devfolio.io → Railway
  - SSL/HTTPS forcé
- [ ] **Monitoring**:
  - Sentry (error tracking backend + frontend)
  - UptimeRobot (ping /health toutes les 5 min)

**Lancement Beta**
- [ ] Soft launch (friends & family - 10 personnes)
- [ ] Corrections bugs critiques < 24h
- [ ] Public launch:
  - Post Reddit r/webdev ("Show & Tell")
  - Post Twitter/X + LinkedIn
  - Email liste (si waitlist avant)
- [ ] Product Hunt launch (J+7 après public launch)

**✅ Livrables Sprint 5**
- Landing page optimisée SEO
- Tests E2E passants
- Documentation complète
- App déployée production
- Beta lancée publiquement

---

## 📊 Post-Launch (Semaine 9+)

### Semaine 9-10 : Monitoring & Support

**Priorités immédiates**
- [ ] Surveiller Sentry (fix bugs < 24h)
- [ ] Répondre support emails < 24h
- [ ] Analyser feedback users
- [ ] Hotfixes si critiques

**Analytics Business**
- [ ] Setup Google Analytics
- [ ] Tracking conversions:
  - Inscription → Création portfolio → Publication → Premium
- [ ] Identifier points friction (où users drop)
- [ ] A/B test CTA landing page

**Support**
- [ ] Setup Intercom/Crisp live chat (optionnel)
- [ ] Enrichir FAQ (questions fréquentes users)
- [ ] Créer tutoriels vidéo (YouTube)

### Roadmap V2 (Mois 2-3)

**Must-Have**
- [ ] Export PDF portfolio
- [ ] Templates builder (créer ses propres templates)
- [ ] Collaboration mode (partage accès portfolio)
- [ ] Blog section optionnelle (markdown editor)

**Nice-to-Have**
- [ ] LinkedIn integration (import expérience auto)
- [ ] AI content suggestions (OpenAI API)
- [ ] Dark mode editor
- [ ] Mobile app (React Native)

**Paiements V2**
- [ ] Stripe (carte bancaire internationale)
- [ ] MVola (Mobile Money Madagascar)
- [ ] Airtel Money
- [ ] Multi-devises (USD, EUR)

---

## 📈 Métriques de Suivi

### Techniques (Hebdomadaire)
- Uptime % (objectif: > 99.5%)
- API response time (objectif: < 300ms)
- Erreurs Sentry (objectif: < 10/jour)
- Performance Lighthouse (objectif: > 90)
- Test coverage % (objectif: > 80%)

### Business (Hebdomadaire)
- Inscriptions totales
- Utilisateurs actifs (WAU/MAU)
- Portfolios créés
- Portfolios publiés (% conversion)
- Taux conversion gratuit → premium (objectif: > 10%)
- MRR (Monthly Recurring Revenue)
- Churn rate (objectif: < 10%)
- LTV (Lifetime Value)

### Objectifs 90 Jours
- 🎯 500 inscriptions
- 🎯 200 portfolios publiés
- 🎯 50 utilisateurs premium (100 000 Ar MRR)
- 🎯 Churn < 10%
- 🎯 NPS > 40

---

## ⚠️ Risques & Mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Orange Money API instable | Élevé | Validation manuelle paiements + retry logic |
| GitHub API rate limit | Moyen | Cache repos + queue jobs + GitHub Pro |
| Spam/Abuse gratuit | Moyen | Captcha + email verification + rate limiting |
| Pas de traction users | Critique | Validation marché AVANT dev (landing page test) |
| Downtime production | Élevé | Monitoring + backups quotidiens + rollback rapide |

---

## ✅ Checklist Go-Live

### Technique
- [ ] Tous tests backend passants
- [ ] Tous tests frontend E2E passants
- [ ] Performance Lighthouse > 90
- [ ] Audit sécurité fait
- [ ] SSL HTTPS partout
- [ ] Backups DB automatiques quotidiens
- [ ] Monitoring actif (Sentry + Uptime)
- [ ] Logs centralisés
- [ ] Orange Money API production configurée

### Business
- [ ] Orange Money marchand activé
- [ ] Webhooks testés en production
- [ ] CGU/CGV validées
- [ ] Politique confidentialité RGPD
- [ ] Support email fonctionnel (support@devfolio.io)
- [ ] Analytics configurées (Google Analytics)

### Marketing
- [ ] Landing page live
- [ ] SEO meta tags optimisés
- [ ] Social media setup (Twitter, LinkedIn)
- [ ] Liste email 20+ personnes (waitlist optionnel)
- [ ] Posts Reddit/Twitter préparés

---

## 🎯 Date Go-Live Cible

**Fin Semaine 8** 🚀

**Soft Launch** : Vendredi semaine 8 (friends & family)  
**Public Launch** : Lundi semaine 9 (Reddit/Twitter/LinkedIn)  
**Product Hunt** : Lundi semaine 10

---

**Plan validé et prêt à exécuter** ✅