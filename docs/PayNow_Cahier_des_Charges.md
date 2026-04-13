# PayNow — Cahier des charges & Plan de travail

> Passerelle de paiement internationale · React + TypeScript + Tailwind · Laravel + MySQL

---

## 01 — Présentation du projet

### Vision
PayNow est une **passerelle de paiement (Payment Gateway)** qui permet à tout développeur d'intégrer plusieurs méthodes de paiement via un bouton unique et une page de checkout hébergée.

### Positionnement
Comme Stripe ou PayPal, mais orienté marché international avec support natif **Mobile Money africain** (MVola, Airtel, Orange) en plus des cartes internationales.

### Charte graphique

| Nom | Code hex | Usage |
|-----|----------|-------|
| Dark Navy | `#2C2E43` | Fond principal, navbar |
| Mid Purple | `#595260` | Surfaces cards, sidebar |
| Light Gray | `#B2B1B9` | Textes secondaires, placeholders |
| PayNow Yellow | `#FFD523` | Accent, boutons CTA, highlights |
| White | `#FFFFFF` | Textes sur fond sombre |

---

## 02 — Acteurs du système

| Acteur | Rôle |
|--------|------|
| **Marchand** | Développeur qui intègre PayNow dans son app via SDK + clé API |
| **Client final** | Utilisateur de l'app marchand qui effectue le paiement sur la page PayNow |
| **Admin PayNow** | Gère les marchands, les providers, les commissions et les litiges |

---

## 03 — Méthodes de paiement supportées

- Visa / Mastercard (via Stripe)
- MVola (Telma Madagascar)
- Airtel Money
- Orange Money
- PayPal
- Virement bancaire
- Crypto — USDT/USDC (Phase 3)

---

## 04 — Modules fonctionnels

| Module | Description | Priorité |
|--------|-------------|----------|
| Auth marchands | Inscription, connexion, profil, clés API | **Must have** |
| Page checkout | Page de paiement hébergée sur PayNow | **Must have** |
| SDK JavaScript | Bouton + redirection pour apps web | **Must have** |
| Transactions | Historique, statuts, reçus PDF | **Must have** |
| Webhooks | Notification async au marchand | **Must have** |
| Dashboard marchand | Stats, solde, retraits | **Must have** |
| Intégration Stripe | Visa/Mastercard via Stripe | **Must have** |
| MVola API | Paiement mobile money Madagascar | **Must have** |
| Airtel / Orange API | Paiement mobile money Afrique | Should have |
| SDK PHP/Laravel | Package Composer pour apps Laravel | Should have |
| Admin panel | Gestion marchands, litiges, stats globales | Should have |
| Fraud detection | Limites, alertes, blocage IP | Should have |
| SDK Mobile | React Native / Flutter | Nice to have |
| Crypto payments | USDT, USDC via Coinbase Commerce | Nice to have |

---

## 05 — Stack technique

### Frontend
- React.js + TypeScript
- Tailwind CSS (palette PayNow)
- React Query (gestion état serveur)
- Zustand (état global)

### Backend
- Laravel 11
- MySQL
- Laravel Queues + Redis (jobs async)
- Laravel Sanctum (authentification API)

### Infrastructure
- HTTPS / SSL obligatoire
- Webhooks sortants
- Cron Jobs (vérification statuts)
- Storage S3 (reçus PDF)

### Providers externes
- Stripe API (cartes)
- MVola API (Telma)
- Airtel Money API
- Orange Money API
- PayPal SDK

---

## 06 — Architecture du système

```
[App Marchand]
     |
     | SDK PayNow (npm / Composer)
     |
     v
[Page Checkout PayNow]  <-- checkout.paynow.com/pay/{token}
     |
     | Laravel API REST
     |
[Payment Router]
     |
     |-----> Stripe API      (Visa / Mastercard)
     |-----> MVola API       (Mobile Money)
     |-----> Airtel API      (Mobile Money)
     |-----> Orange API      (Mobile Money)
     |-----> PayPal SDK
     |
     v
[Webhook Dispatcher]  --> notifie le marchand
     |
[MySQL + Redis Queue]
```

---

## 07 — Plan de travail (10 semaines)

### Phase 1 — Setup & fondations
**Durée : Semaine 1**

- Initialiser le projet Laravel 11 + React + MySQL
- Configurer Tailwind CSS avec la palette PayNow
- Créer les migrations de base :
  - `merchants` (id, name, email, password, status)
  - `api_keys` (id, merchant_id, key_hash, name, last_used_at)
  - `transactions` (id, merchant_id, amount, currency, status, provider, metadata)
  - `webhooks` (id, merchant_id, url, secret, events)
  - `webhook_logs` (id, webhook_id, transaction_id, status, attempts, payload)
- Mettre en place Laravel Sanctum pour l'auth
- Configurer les variables d'environnement (.env)

---

### Phase 2 — Auth marchands + Dashboard
**Durée : Semaine 2**

- Inscription marchand (nom, email, mot de passe, nom de l'app)
- Connexion / déconnexion sécurisée
- Génération de clés API (publique + secrète)
- Révocation et renouvellement des clés
- Dashboard marchand : stats basiques (total transactions, volume, taux de succès)
- Layout général avec thème PayNow appliqué

---

### Phase 3 — Page checkout PayNow
**Durée : Semaine 3**

- Route publique : `checkout.paynow.com/pay/{token}`
- Validation du token (signé JWT, expiré après 30 min)
- Formulaire de saisie selon la méthode choisie
- Sélecteur de méthode de paiement (Carte, MVola, Airtel, Orange...)
- Page de succès avec récapitulatif
- Page d'échec avec message d'erreur clair
- Page "en attente" pour Mobile Money (polling)

---

### Phase 4 — Intégration Stripe (cartes bancaires)
**Durée : Semaine 4**

- Créer le `PaymentRouter` Laravel (pattern Strategy)
- Créer le `StripeProvider` (classe dédiée Stripe)
- Intégrer le SDK PHP Stripe
- Gérer `PaymentIntent` (create, confirm, cancel)
- Gérer les remboursements (refunds)
- Gérer les webhooks entrants Stripe (events)
- Tester le flux complet end-to-end en mode sandbox

---

### Phase 5 — Système Webhooks + Transactions
**Durée : Semaine 5**

- Jobs Laravel pour l'envoi asynchrone des webhooks
- Retry automatique en cas d'échec (3 tentatives, backoff exponentiel)
- Signature HMAC des webhooks (sécurité)
- Historique complet des transactions avec filtres
- Export CSV des transactions
- Génération et téléchargement de reçu PDF

---

### Phase 6 — SDK JavaScript (package npm)
**Durée : Semaine 6**

- Package npm `paynow-js`
- Bouton PayNow avec redirection vers la page checkout
- Callbacks : `onSuccess(transaction)` / `onError(error)` / `onClose()`
- Support TypeScript (types inclus)
- Documentation complète (README + exemples)
- Page de démonstration interactive

**Exemple d'intégration :**
```javascript
import PayNow from 'paynow-js';

const paynow = new PayNow({ publicKey: 'pk_live_xxxx' });

paynow.pay({
  amount: 25000,
  currency: 'MGA',
  reference: 'ORDER-001',
  onSuccess: (tx) => console.log('Paiement réussi', tx),
  onError: (err) => console.error('Échec', err),
});
```

---

### Phase 7 — Mobile Money (MVola, Airtel, Orange)
**Durée : Semaines 7–8**

- Créer `MvolaProvider`, `AirtelProvider`, `OrangeProvider`
- Intégrer MVola API (Telma Madagascar)
- Intégrer Airtel Money API (Africa)
- Intégrer Orange Money API (Africa)
- Gestion des statuts async (polling + webhook provider)
- Page "en attente" avec timer et instructions pour le client
- Gestion des expirations et annulations

---

### Phase 8 — Admin panel + Sécurité + Déploiement
**Durée : Semaines 9–10**

- Panel admin : liste marchands, activation/suspension
- Stats globales : volume, revenus, top marchands
- Gestion des litiges et remboursements manuels
- Détection fraude : limites par transaction, alertes, blacklist IP
- Chiffrement des données sensibles (AES-256)
- Audit logs complets
- Configuration serveur (Nginx, SSL, PHP-FPM)
- Déploiement production
- Mise en place monitoring (UptimeRobot, Sentry)

---

## 08 — Modèle de données principal

```sql
-- Marchands
merchants: id, name, email, password, business_name, 
           country, status, created_at

-- Clés API
api_keys: id, merchant_id, name, public_key, secret_key_hash, 
          is_active, last_used_at

-- Transactions
transactions: id, merchant_id, reference, amount, currency,
              status (pending/success/failed/refunded),
              provider (stripe/mvola/airtel/orange),
              provider_transaction_id, metadata, created_at

-- Webhooks endpoints
webhooks: id, merchant_id, url, secret, events[], is_active

-- Logs webhooks
webhook_logs: id, webhook_id, transaction_id, 
              http_status, attempts, next_retry_at, payload
```

---

## 09 — Exigences de sécurité

### Obligatoires
- HTTPS sur toutes les routes (SSL/TLS)
- Clés API hashées en base (SHA-256, jamais en clair)
- Tokens de transaction signés (JWT, expiration 30 min)
- Validation HMAC des webhooks entrants
- Rate limiting sur l'API (100 req/min par clé)
- Chiffrement des données bancaires (Stripe gère les cartes, jamais stockées)
- Protection CSRF sur les formulaires
- Headers de sécurité (CSP, HSTS, X-Frame-Options)

### Recommandées
- 2FA pour les comptes marchands
- Logs d'audit complets (qui a fait quoi, quand)
- IP whitelisting optionnel pour les marchands
- Détection de doublons de transaction (idempotency keys)
- Conformité PCI-DSS niveau 1

---

## 10 — Critères de succès (MVP)

| Critère | Objectif |
|---------|----------|
| **Onboarding** | Un marchand peut s'inscrire, obtenir une clé API et recevoir un premier paiement en moins de 15 minutes |
| **Performance** | Page checkout chargée en moins de 2 secondes |
| **Webhook** | Notification envoyée en moins de 5 secondes après confirmation |
| **Fiabilité** | Zéro transaction perdue · Retry webhook automatique |
| **Logs** | Toutes les erreurs provider sont loggées et consultables |

---

## 11 — Roadmap post-MVP

| Version | Fonctionnalités |
|---------|----------------|
| v1.0 | MVP : Stripe + MVola + SDK JS + Dashboard |
| v1.1 | Airtel Money + Orange Money + SDK PHP |
| v1.2 | Admin panel complet + Fraud detection |
| v2.0 | SDK Mobile (React Native) + Crypto payments |
| v2.1 | Marketplace (split payments) + Abonnements récurrents |

---

*Document généré pour le projet PayNow — Version 1.0*
