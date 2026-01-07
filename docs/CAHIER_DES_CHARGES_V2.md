# Cahier des Charges - DevFolio

## 1. Présentation du Projet

### 1.1 Nom du projet
**DevFolio** (nom provisoire)

### 1.2 Description
Plateforme SaaS permettant aux développeurs de créer, personnaliser et héberger leur portfolio professionnel en quelques minutes avec import automatique GitHub.

### 1.3 Objectifs
- Faciliter la création de portfolios pour développeurs
- Automatiser l'import de projets depuis GitHub
- Proposer un modèle freemium rentable
- Offrir une expérience utilisateur moderne et intuitive

### 1.4 Cible
- Développeurs juniors cherchant leur premier emploi
- Développeurs freelances cherchant des clients
- Étudiants en informatique
- Développeurs souhaitant améliorer leur présence en ligne

---

## 2. Architecture Technique

### 2.1 Structure du projet
```
office-work-mdg/
├── backend/     # Laravel 12 API REST (SPA indépendante)
└── frontend/    # React + TypeScript + Vite
```

### 2.2 Technologies

**Backend (API REST)**
- Laravel 12
- MySQL 8+
- Laravel Sanctum (authentification API)
- Orange Money API (paiements)
- GitHub API (import repos)
- Queue Laravel (jobs asynchrones)

**Frontend**
- React 18 (SPA indépendante)
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Query (gestion API)
- Zustand (state management)
- React Router (navigation)

**Infrastructure**
- Backend: Railway/Render
- Frontend: Vercel
- Base de données: PlanetScale/Railway MySQL
- Storage: Cloudflare R2 (images)
- Email: Resend/Mailgun
- DNS: Cloudflare

---

## 3. Fonctionnalités

### 3.1 Authentification

#### 3.1.1 Inscription
- Email + Mot de passe (min 8 caractères)
- Vérification email obligatoire
- Validation des données côté backend

#### 3.1.2 Connexion
- Email + Mot de passe
- Token JWT via Sanctum
- Remember me (30 jours)
- Logout (invalidation token)

#### 3.1.3 Récupération mot de passe
- Email avec lien de réinitialisation
- Token unique valide 60 minutes
- Création nouveau mot de passe

### 3.2 Gestion Profil Utilisateur

#### 3.2.1 Informations personnelles
- Nom complet
- Email (modifiable avec vérification)
- Photo de profil
- Titre professionnel (ex: "Full Stack Developer")
- Bio courte (500 caractères max)
- Localisation
- Liens réseaux sociaux (GitHub, LinkedIn, Twitter/X)

#### 3.2.2 Paramètres compte
- Modification mot de passe
- Suppression compte
- Gestion abonnement
- Historique paiements

### 3.3 Templates (Modèles de Portfolio)

#### 3.3.1 Templates Gratuits (3)
- **Minimal Light** : Design épuré, fond blanc
- **Dark Developer** : Theme sombre, accent cyan
- **Classic** : Design traditionnel professionnel

#### 3.3.2 Templates Premium (5+)
- **Neon Cyberpunk** : Effets néon, animations
- **Glassmorphism** : Effet verre, moderne
- **3D Interactive** : Elements 3D, parallaxe
- **Minimal Portfolio** : Ultra-minimaliste
- **Creative Bold** : Couleurs vives, typographie audacieuse

#### 3.3.3 Caractéristiques templates
- Responsive (mobile, tablet, desktop)
- Sections modulaires (Hero, About, Projects, Skills, Contact)
- Dark/Light mode toggle
- Animations smooth
- Optimisé SEO

### 3.4 Éditeur de Portfolio

#### 3.4.1 Édition contenu
- **Hero Section**
  - Titre principal
  - Sous-titre
  - CTA button (texte + lien)
  - Image/Avatar
  
- **About Section**
  - Texte description (WYSIWYG editor)
  - Image optionnelle
  - Téléchargement CV (PDF)

- **Projects Section**
  - Ajout manuel ou import GitHub
  - Par projet :
    - Titre
    - Description (500 caractères)
    - Technologies utilisées (tags)
    - Images/Screenshots (5 max)
    - Liens (démo, GitHub)
    - Date de réalisation

- **Skills Section**
  - Ajout compétences techniques
  - Niveau (Débutant, Intermédiaire, Avancé, Expert)
  - Icônes technologies automatiques
  - Groupement par catégorie (Frontend, Backend, Outils, etc.)

- **Experience Section** (optionnel)
  - Postes occupés
  - Entreprises
  - Dates
  - Descriptions

- **Contact Section**
  - Email
  - Téléphone (optionnel)
  - Réseaux sociaux
  - Formulaire de contact (avec protection spam)

#### 3.4.2 Personnalisation design
- **Couleurs**
  - Palette prédéfinie (10 choix)
  - Couleur primaire custom
  - Couleur secondaire custom
  
- **Typographie**
  - Choix de 5 combinaisons de polices Google Fonts
  
- **Layout**
  - Ordre des sections (drag & drop)
  - Activation/désactivation sections
  
- **Animations**
  - Choix intensité animations (Aucune, Légère, Moyenne, Intense)

#### 3.4.3 Fonctionnalités éditeur
- Preview en temps réel
- Mode mobile/desktop preview
- Sauvegarde automatique (toutes les 30 secondes)
- Historique versions (retour arrière)
- Duplication portfolio

### 3.5 Import GitHub

#### 3.5.1 Connexion GitHub
- OAuth GitHub
- Permissions : lecture repos publics
- Stockage token sécurisé

#### 3.5.2 Import automatique
- Liste tous les repos publics
- Sélection repos à importer
- Import données :
  - Nom repo
  - Description
  - Langages utilisés (%)
  - Nombre stars/forks
  - Date création
  - Lien repo
  - README (extraction description)
  - Topics/Tags

#### 3.5.3 Synchronisation
- Bouton "Sync GitHub" dans dashboard
- Mise à jour automatique hebdomadaire (premium)
- Notification si nouveaux repos détectés

### 3.6 Hébergement & Publication

#### 3.6.1 Sous-domaine gratuit
- Format : `username.devfolio.io`
- Configuration automatique
- SSL/HTTPS automatique
- Redirection www automatique

#### 3.6.2 Domaine personnalisé (Premium)
- Ajout domaine custom
- Instructions configuration DNS
- Vérification domaine
- SSL/HTTPS automatique
- Maximum 3 domaines par compte

#### 3.6.3 Export code (Premium)
- Export HTML/CSS/JS complet
- Package ZIP téléchargeable
- Instructions déploiement incluses

### 3.7 SEO & Analytics

#### 3.7.1 Optimisation SEO
- Meta title/description customisables
- Open Graph tags (partage réseaux sociaux)
- Sitemap.xml automatique
- Robots.txt
- Schema.org markup (Person)
- Performance optimisée (Lighthouse 90+)

#### 3.7.2 Analytics (Premium)
- Nombre de visiteurs (jour/semaine/mois)
- Pages vues
- Provenance trafic
- Appareils utilisés
- Pas de cookies tiers (RGPD compliant)

### 3.8 Abonnements & Paiements (Orange Money)

#### 3.8.1 Plan Gratuit
- 1 portfolio actif
- 3 projets maximum
- Templates basiques (3)
- Sous-domaine devfolio.io
- Branding "Powered by DevFolio"

#### 3.8.2 Plan Premium (2000 Ar/mois ou 20000 Ar/an)
- Portfolios illimités
- Projets illimités
- Tous templates (8+)
- Import/Sync GitHub automatique
- Domaine personnalisé (3 max)
- Export code source
- Analytics détaillés
- Pas de branding
- Support prioritaire

#### 3.8.3 Gestion paiements Orange Money
- Intégration Orange Money API
- Paiement mobile money uniquement
- Abonnement mensuel/annuel
- Annulation à tout moment
- Remboursement 14 jours
- Reçu de paiement automatique par email
- Numéro Orange Money requis pour paiement
- Validation manuelle paiement (webhook Orange Money)
- Historique paiements dans compte utilisateur

---

## 4. Contraintes & Règles Métier

### 4.1 Sécurité
- HTTPS obligatoire partout
- Validation stricte toutes entrées utilisateur
- Rate limiting API (60 req/min authentifié, 10 req/min public)
- Protection CSRF
- Sanitization contenu HTML (XSS)
- Mots de passe hashés (bcrypt)
- Tokens JWT expiration 24h
- Refresh tokens 30 jours

### 4.2 Performances
- Temps chargement page < 3 secondes
- API response time < 300ms
- Images optimisées automatiquement (WebP)
- Lazy loading images
- CDN pour assets statiques

### 4.3 Limites techniques
- Taille max upload image : 5 MB
- Taille max upload CV : 10 MB
- Formats images acceptés : JPG, PNG, WebP
- Format CV : PDF uniquement
- Longueur max bio : 500 caractères
- Longueur max description projet : 500 caractères
- Nombre max images par projet : 5

### 4.4 Conformité légale
- RGPD compliant (EU)
- Politique de confidentialité
- CGU/CGV
- Cookies banner (si analytics)
- Droit à l'oubli (suppression données)
- Export données personnelles (RGPD)

---

## 5. API REST Endpoints

### 5.1 Authentification
```
POST   /api/auth/register          - Inscription
POST   /api/auth/login             - Connexion
POST   /api/auth/logout            - Déconnexion
POST   /api/auth/forgot-password   - Demande reset password
POST   /api/auth/reset-password    - Reset password
POST   /api/auth/verify-email      - Vérification email
GET    /api/auth/user              - User connecté
```

### 5.2 Profil Utilisateur
```
GET    /api/profile                - Infos profil
PUT    /api/profile                - Modifier profil
POST   /api/profile/avatar         - Upload avatar
DELETE /api/profile                - Supprimer compte
```

### 5.3 Templates
```
GET    /api/templates              - Liste templates
GET    /api/templates/{id}         - Détail template
```

### 5.4 Portfolios
```
GET    /api/portfolios             - Liste mes portfolios
POST   /api/portfolios             - Créer portfolio
GET    /api/portfolios/{id}        - Détail portfolio
PUT    /api/portfolios/{id}        - Modifier portfolio
DELETE /api/portfolios/{id}        - Supprimer portfolio
POST   /api/portfolios/{id}/publish - Publier portfolio
POST   /api/portfolios/{id}/clone  - Dupliquer portfolio
GET    /api/portfolios/{id}/export - Export code (premium)
```

### 5.5 Projets
```
GET    /api/portfolios/{id}/projects        - Liste projets
POST   /api/portfolios/{id}/projects        - Ajouter projet
PUT    /api/portfolios/{id}/projects/{pid}  - Modifier projet
DELETE /api/portfolios/{id}/projects/{pid}  - Supprimer projet
POST   /api/projects/{id}/images            - Upload image projet
```

### 5.6 GitHub
```
GET    /api/github/auth            - URL OAuth GitHub
GET    /api/github/callback        - Callback OAuth
GET    /api/github/repos           - Liste repos GitHub
POST   /api/github/import          - Importer repos sélectionnés
POST   /api/github/sync            - Synchroniser repos
DELETE /api/github/disconnect      - Déconnecter GitHub
```

### 5.7 Domaines (Premium)
```
GET    /api/domains                - Liste domaines
POST   /api/domains                - Ajouter domaine
DELETE /api/domains/{id}           - Supprimer domaine
POST   /api/domains/{id}/verify    - Vérifier configuration DNS
```

### 5.8 Abonnements (Orange Money)
```
GET    /api/subscription           - Détails abonnement actuel
POST   /api/subscription/checkout  - Initier paiement Orange Money
POST   /api/subscription/webhook   - Webhook Orange Money
GET    /api/subscription/history   - Historique paiements
POST   /api/subscription/cancel    - Annuler abonnement
```

### 5.9 Analytics (Premium)
```
GET    /api/portfolios/{id}/analytics - Stats portfolio
```

---

## 6. Pages Frontend

### 6.1 Pages publiques (non connecté)
```
/                      - Landing page
/templates             - Galerie templates
/pricing               - Page tarifs
/login                 - Connexion
/register              - Inscription
/forgot-password       - Mot de passe oublié
/reset-password/:token - Réinitialisation password
/verify-email/:token   - Vérification email
/{username}            - Portfolio public user
```

### 6.2 Pages authentifiées
```
/dashboard             - Dashboard principal
/editor/:id            - Éditeur portfolio
/editor/new            - Nouveau portfolio
/settings/profile      - Paramètres profil
/settings/account      - Paramètres compte
/settings/billing      - Facturation & abonnement
/analytics/:id         - Analytics portfolio (premium)
```

---

## 7. Base de Données

### 7.1 Tables principales

**users**
- id, name, email, username, password, avatar, title, bio, location
- github_id, github_token, github_username
- orange_money_number (nouveau)
- subscription_plan, subscription_ends_at
- email_verified_at, created_at, updated_at

**templates**
- id, name, slug, description, thumbnail, preview_url
- category, is_premium, price
- html_structure, css_styles, config_json
- created_at, updated_at

**portfolios**
- id, user_id, template_id, title, slug
- subdomain, custom_domain, is_published
- content_json, seo_title, seo_description
- theme_config, analytics_enabled
- created_at, updated_at

**projects**
- id, portfolio_id, title, description
- technologies (JSON), github_url, demo_url
- images (JSON), is_featured, order, source
- created_at, updated_at

**subscriptions**
- id, user_id, orange_money_transaction_id
- plan_type (monthly/yearly), status
- amount, orange_money_number
- trial_ends_at, ends_at
- created_at, updated_at

**payments** (nouveau pour Orange Money)
- id, user_id, subscription_id
- amount, currency (MGA - Ariary)
- orange_money_number, orange_money_transaction_id
- status (pending/completed/failed)
- payment_date, created_at

**domains**
- id, user_id, portfolio_id, domain
- status, verified_at
- created_at, updated_at

**analytics**
- id, portfolio_id, visitor_ip_hash
- page_view, device, referrer
- visited_at

---

## 8. Livrables

### 8.1 Code source
- Repository Git (branches: develop, production)
- Documentation code (comments)
- Tests unitaires (backend)
- Tests E2E (frontend critiques)

### 8.2 Documentation
- README.md (installation)
- API Documentation (Swagger/OpenAPI)
- Guide utilisateur
- Guide Orange Money intégration

### 8.3 Déploiement
- Backend déployé (Railway/Render)
- Frontend déployé (Vercel)
- Base de données configurée
- SSL/HTTPS activé
- Monitoring configuré
- Orange Money API configurée

---

## 9. Planning Prévisionnel

**Phase 1 (Semaines 1-2) : Fondations**
- Setup projet backend/frontend
- Auth API + Frontend
- Base de données + migrations

**Phase 2 (Semaines 3-4) : Core Features**
- Templates système
- Éditeur portfolio basique
- Preview temps réel

**Phase 3 (Semaines 5-6) : Avancé**
- GitHub OAuth + import
- Publication portfolios
- Domaines custom

**Phase 4 (Semaine 7) : Monétisation**
- Intégration Orange Money API
- Gestion abonnements
- Analytics

**Phase 5 (Semaine 8) : Finalisation**
- Landing page + SEO
- Tests complets
- Documentation
- Lancement beta

---

## 10. Critères de Succès

### 10.1 Techniques
- ✅ 100% endpoints API fonctionnels
- ✅ Tests unitaires > 80% coverage
- ✅ Performance Lighthouse > 90
- ✅ Mobile responsive 100%
- ✅ Zéro erreur console production
- ✅ Orange Money paiements fonctionnels

### 10.2 Business
- 🎯 20+ inscriptions beta (semaine 1)
- 🎯 10% conversion gratuit → payant
- 🎯 200 utilisateurs payants (mois 6)
- 🎯 Taux churn < 10% mensuel
- 🎯 400 000 Ar+ MRR (mois 6)

### 10.3 UX
- ✅ Création portfolio < 10 minutes
- ✅ Satisfaction utilisateur > 4/5
- ✅ Support < 24h réponse
- ✅ Uptime > 99.5%
- ✅ Paiement Orange Money < 2 minutes

---

## 11. Notes importantes

### 11.1 Paiement Orange Money uniquement
- **Pas de Stripe** pour la V1
- **Pas de carte bancaire** pour la V1
- Uniquement Orange Money Madagascar
- Prix en Ariary (MGA)
- Validation manuelle paiements si nécessaire
- Interface simple pour numéro Orange Money

### 11.2 Version 2 (futur)
- Ajout Stripe (carte bancaire)
- Ajout MVola
- Ajout Airtel Money
- Paiement international
- Multi-devises

### 11.3 Priorités V1
1. Auth fonctionnel
2. Éditeur portfolio complet
3. GitHub import
4. Orange Money intégration
5. Publication portfolios
6. Landing page SEO

**Document validé pour développement** ✅