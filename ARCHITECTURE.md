# Architecture Complète - Conciergerie DesRuelle

## 📋 Vue d'Ensemble

Plateforme SPA Vue.js 3 pour gestion de conciergerie. Les clients demandent des devis, les responsables les valident et assignent les techs, les techs exécutent et rapportent, paiement bloqué jusqu'à validation complète.

**Tech Stack**: Vue 3 + Vite, Pinia, Axios, Vue Router, JWT, Stripe, MySQL

**Base de Données**: 7 tables (users, services_catalogue, demandes_devis, prestations, affectation_techniciens, disponibilites, avis)

---

## 🏗️ Stack Technologique

### Frontend
- **Vue.js 3** : Framework réactif, composants SPA (Single Page App)
- **Pinia** : State management centralisé (7 stores : auth, services, demandes, prestations, utilisateurs, disponibilites, notifications)
- **Axios** : Client HTTP REST avec intercepteurs JWT
- **Vue Router** : Navigation + route guards (authentication, authorization par rôle)
- **Vite** : Bundler ultra-rapide (dev + build)
- **@stripe/vue3** : Intégration paiement

### Backend (Node.js/Express) - À développer
- **Endpoints REST** : Authentification, services, demandes, prestations, techs, dispo, avis, paiements
- **JWT** : Tokens stockés localStorage client, refresh automatique
- **Middleware** : Auth (vérify token), CORS, validation données

### Base de Données (MySQL)
- **users**: id, nom, prenom, email, password, telephone, adresse, role (user|tech|responsable)
- **services_catalogue**: id, categorie (propreté|multiservices), nom_service, description, est_recurrent
- **demandes_devis**: id, client_id, service_id, date_souhaitee, description_besoin, **statut_devis** (en_attente|envoyé|refusé|accepté)
- **prestations**: id, demande_id, client_id, service_id, prix_final, temps_estime, date_heure_rdv, **statut_paiement** (attente|bloqué|libéré), **statut_travail** (programmé|en_cours|terminé|incident|annulé), retour_technicien, raison_incident, date_annulation, raison_annulation
- **affectation_techniciens**: id, prestation_id, tech_id
- **disponibilites**: id, user_id, date_debut, date_fin, est_disponible
- **avis**: id, prestation_id, client_id, note (1-5), commentaire

### Design
- **Couleurs DesRuelle**: Bordeaux (#8b1e2c), Gris (#666666), Blanc (#ffffff)
- **Responsive**: Mobile-first (clients + techs en déplacement)

---

## 🎯 Structure Pages par Univers

### 🌍 1. UNIVERS PUBLIC (Avant Connexion)

**DA**: Gris + Blanc + Bordeaux (CTA)

#### `accueil.vue`
- **Hero banner** : Texte crochet "Vos petits projets, notre spécialité"
- **Carnousel avis** : 3-4 avis clients (note 5*, photo, texte)
- **Services populaires** : 3-4 cartes (images, noms, "Demander un devis")
- **CTA bottoms** : "Découvrir tous les services" → `/prestations`, "Nous contacter" → `/contact`
- **Footer** : Info contact, liens rapides
- **Lien `Connexion`** en haut droit

#### `prestations.vue` (Nos Prestations)
- **Catalogue complet** :
  - **Propreté** : Nettoyage extérieur, ménage régulier, vitrerie, etc.
  - **Multiservices** : Peinture, plomberie, électricité, etc.
- **Pour chaque service** : Image, nom, description, "Demander un devis" (→ `/connexion` si guest, → step2 si user)
- **Filtres** : Par catégorie (Propreté / Multiservices)
- **Responsive** : Grid 3 colonnes → 1 colonne mobile

#### `apropos.vue` (À Propos)
- **Hero** : "L'histoire de DesRuelle"
- **Section valeurs** : Mission, vision, values (texte + icônes)
- **Team** : Photos + noms + rôles (préparatoires)
- **Stats** : "500+ clients satisfaits", "2000+ interventions", "Depuis 2005"
- **Témoignages** : Quelques avis clients (carousel)

#### `contact.vue` (Contact + Devis)
- **Formulaire** : Nom, Email, Téléphone, Message (libre), Sujet (dropdown: "Demande spéciale", "Bug", "Partenariat")
- **Utilise composant `formulaire-contact.vue`**
- **Success toast** : "Merci, on vous recontacte bientôt!"
- **Info contact en bas** : Adresse, tel, email

#### `connexion-inscription.vue` (Auth Unique)
- **Tab toggle** : "Se connecter" | "Créer un compte"
- **TAB 1: Connexion**
  - Inputs: Email, Mot de passe
  - Checkbox "Se souvenir de moi"
  - Bouton "Connexion"
  - Lien "Mot de passe oublié?" (optionnel phase 2)
  - Utilise composant `formulaire-connexion.vue`
- **TAB 2: Inscription**
  - Inputs: Nom, Prénom, Email, Téléphone, Adresse, Mot de passe (x2)
  - Checkbox conditions d'usage
  - Bouton "Créer mon compte"
  - Auto-login après succès
  - Utilise composant `formulaire-inscription.vue`
- **Redirect** : Après login → `/dashboard` (client) | `/tech/dashboard` (tech) | `/responsable/dashboard` (respo)

---

### 👤 2. ESPACE CLIENT (Rôle: user)

#### `client/dashboard.vue` (Dashboard Client)
- **Widget 1: Prochaine intervention** :
  - Si prestation en cours : Nom du tech, date/heure, adresse, status (Programmée/En cours)
  - Si aucune : "Aucune intervention"
  - Bouton "Voir détails" → `/suivi-commande/:id`
- **Widget 2: Historique récent** :
  - Tableau des 5 dernières prestations
  - Colonnes: Service, Date, Status, Actions (Revoir / Laisser avis)
- **Bouton CTA principal** : "Nouvelle demande" → `/client/nouveau-devis` (step 1)
- **Barre nav** : Dashboard | Mes demandes | Paiements | Profil

#### `client/nouveau-devis-etape1.vue` (Step 1: Choix Service)
- **Titre**: "Nouvelle demande - Étape 1/3"
- **Affiche services** en cartes (via composant `carte-service.vue`)
- **Filtres**: Propreté | Multiservices | Tous
- **Recherche** par nom service
- **Action**: Click sur service → store demandes + redirect Step 2
- **Couleur**: Bordeaux pour bouton "Suivant"

#### `client/nouveau-devis-etape2.vue` (Step 2: Date/Heure)
- **Titre**: "Nouvelle demande - Étape 2/3"
- **Calendrier interactif** (composant `calendrier.vue`):
  - Vue mensuelle par défaut
  - Peut switcher jour/semaine (optionnel)
  - Click sur date → affiche créneaux horaires (08:00, 09:00, ..., 17:00, pas 12-13h pour déjeuner)
  - Créneaux gris = déjà occupés (voir dispo techs depuis BDD)
  - Créneaux verts = disponibles
- **Action**: Choisir date + heure → store demandes + redirect Step 3

#### `client/nouveau-devis-etape3.vue` (Step 3: Validation)
- **Titre**: "Nouvelle demande - Étape 3/3"
- **Résumé**: Service, Date souhaitée, Heure, Adresse (auto-remplie du profil)
- **Textarea**: "Description détaillée de votre besoin" (optionnel mais recommandé)
- **Bouton** : "Confirmer ma demande" → POST /demandes via store demandes
- **Success** : Toast "Demande créée! Le responsable vous propose un devis dans les 24h" → redirect `/suivi-demande/:demande_id`

#### `client/suivi-commande.vue` (Suivi Prestation - Timeline)
- **Timeline verticale** des statuts (Bande gauche colorée) :
  1. ✅ Demande créée (gris)
  2. ✅ Devis proposé (gris ou en_attente de clic)
  3. ⏳ Attente acceptation (gris) → **Action**: "Accepter devis" bouton bordeaux OU "Refuser" gris
  4. ✅ Accepté (gris ou bordeaux)
  5. 💳 Paiement requis (gris ou orange) → **Action**: "Payer maintenant" → `/client/paiement/:prestation_id`
  6. ✅ Payé (gris puis green)
  7. 👨‍🔧 Technicien assigné (gris) → Affiche **numéro du tech** + téléphone
  8. 🔧 En cours (gris puis en bleu/bordeaux si en_cours)
  9. ✅ Terminé (green)
  10. ⭐ En attente d'avis (gris) → **Action**: "Laisser un avis" → `/client/avis/:prestation_id`
  11. 💰 Paiement libéré (green) → "Votre tech a reçu son paiement"

- **Boutons contextuels** :
  - Si prestations < 24h avant RDV : "Annuler" → modal-annulation (raison requise)
  - Si > 24h avant RDV : "Annuler" grisé / désactivé
  - Si terminé et pas d'avis : "Laisser avis" → `/client/avis`

- **Info complément** :
  - Statut paiement current
  - Numéro de commande
  - Service détails (prix, description)

#### `client/paiement.vue` (Checkout Sécurisé)
- **Card paiement** :
  - Logo Stripe
  - Infos commande (Service, Date, Prix)
  - **Méthodes de paiement** : Apple Pay, PayPal, Carte Bancaire (via Stripe Elements)
  - Bouton "Payer {montant}€" (bordeaux)
- **Après paiement succès** :
  - Store prestations → update statut_paiement = 'bloqué', statut_travail = 'programmé'
  - Toast "Paiement confirmé! Votre tech est assigné et vous contactera"
  - Redirect `/suivi-commande/:id`
- **Erreur paiement** : Toast rouge avec raison (ex: "Carte refusée")

#### `client/mes-avis.vue` (Avis Clients)
- **Liste des prestations terminées sans avis**
- **Pour chaque** : Service, Date, Tech name
- **Bouton**: "Laisser un avis" → modal-avis
- **Liste des avis laissés** : Note + commentaire posté

---

### 🛠️ 3. ESPACE TECHNIQUE (Rôle: tech)

#### `tech/dashboard.vue` (Vue du Jour / RDV Assignés)
- **En haut**: "Bienvenue, {firstname}!" + date du jour
- **Section 1: Interventions du jour**
  - Tableau : Heure | Service | Client nom | Adresse | Status | Actions
  - Status color: Programmée (gris), En cours (bleu), Terminée (green)
  - Boutons:
    - "Démarrer" (si programmée) → status = en_cours, appel API PUT /prestations/:id/status
    - "Terminer" (si en_cours) → modal-retour-tech
    - "Détails" → fiche-intervention (read-only)
- **Section 2: Demain + reste semaine**
  - Brief list (2 colonnes) : Date | Service | Client

#### `tech/calendrier.vue` (Gestion Dispo + Vue Mensuelle)
- **Haut**: Calendrier mensuel
- **Bas**: Tableau dispo actuelles :
  - Colonnes: Date début, Date fin, Status (Dispo/Occup), Actions (Modifier/Supprimer)
- **Bouton + "Ajouter une disponibilité"** → `formulaire-dispo.vue`
  - Input: Date + Heure début + Heure fin
  - Validation: 08:00 → 17:00, no overlap avec autres dispo
  - Soumet → POST /disponibilites

#### `tech/fiche-intervention.vue` (Détails Mission)
- **Détails**:
  - Service nom + description
  - Client: Nom, Téléphone
  - Adresse complète
  - Date/Heure RDV
  - Prix (pour info)
  - **Description client** (du devis)
- **Boutons**:
  - "Démarrer l'intervention" (if status=programmé) → update status=en_cours + toast "Mission démarrée"
  - "Terminer" (if status=en_cours) → modal-retour-tech

#### `tech/completer-intervention.vue` (Formulaire Retour)
- **Modal retour-tech**:
  - Textarea "Description du travail réalisé" (requis)
  - Textarea "Observations / Remarques"
  - Checkbox "Incident rencontré?"
    - Si OUI → Textarea "Décrire l'incident"
  - Boutons: "Valider retour" | "Annuler"
- **Soumet** → PUT /prestations/:id/complete avec {retour_technicien, raison_incident}
- **Status update** : statut_travail = 'terminé' OU 'incident'
- **Toast succès**: "Merci! Votre rapport a été envoyé au responsable"
- **Redirect** → `/tech/dashboard`

#### `tech/alertes.vue` (Notifications)
- **Cloche en header**
- **Page dédiée** affichant:
  - "Votre intervention de demain a été annulée" (client canceled < 24h)
  - "Nouvelles dispo ont été trouvées pour vous" (algo matching)
  - "Le responsable a modifié votre intervention" (changement adresse/heure/service)
- **Statuts**: Lue | Non lue (différent visuel)
- **Bouton** "Marquer tout comme lu"

---

### 👑 4. ESPACE GESTION (Rôle: responsable)

#### `responsable/dashboard.vue` (Dashboard Respo)
- **Widget 1: Compteur devis**
  - Grand nombre rouge : "5 devis en attente"
  - Lien "Traiter" → `/responsable/demandes`
- **Widget 2: Incidents du jour**
  - "2 incidents" (rouge)
  - List: "Tech absent à 10h30" | "Client demande annulation"
  - Lien "Voir" → `/responsable/incidents`
- **Widget 3: Vue rapide RDV**
  - Calendrier mini (semaine actuelle)
  - Pastilles colorées = RDV (vert=ok, orange=en_cours, rouge=incident)
- **Widget 4: Stats**
  - Prestations ce mois: 34
  - Taux satisfaction: 4.8/5
  - Paiements en attente: 2500€

#### `responsable/demandes.vue` (Centralisation Demandes Devis)
- **Tableau filtrable**:
  - Colonnes: # | Service | Client | Date souhaitée | Status | Actions
  - Filter par status : En attente | Envoyé | Accepté | Refusé
  - Search par nom client
  - Sort par date souhaitée
- **Actions button**:
  - "Traiter" (if status=en_attente) → `/responsable/devis/:id/repondre`
  - "Voir devis envoyé" (if status=envoyé)
  - "Supprimer" (if status=refusé)
- **Statut color**:
  - En attente : Gris
  - Envoyé : Orange
  - Accepté : Vert
  - Refusé : Rouge

#### `responsable/devis-repondre.vue` (Répondre au Devis)
- **Affiche demande détails** (client, service, date souhaitée, description)
- **Formulaire réponse**:
  - Input: **Prix final** (€)
  - Input: **Temps estimé** (heures) ex: 2.5
  - Input: **Nombre de techs requis** ex: 1, 2, 3
  - Textarea: **Description du devis** (optionnel)
- **Bouton "Envoyer le devis"** :
  - Valide fields
  - POST /demandes/:id/devis avec {prix, temps, nb_techs}
  - Update statut_devis = 'envoyé'
  - Toast "Devis envoyé au client!"
  - Redirect `/responsable/demandes`
- **Bouton "Refuser"** →  statut_devis = 'refusé' + modal raison annulation

#### `responsable/calendrier.vue` (Planning Global - Drag & Drop)
- **Vue calendrier mensuelle** (composant `calendrier.vue`)
  - Chaque RDV affiché comme bloc coloré (couleur = tech assigné OU gris si non assigné)
  - Click sur RDV → affiche détails en modal
- **À côté**: **Liste techs disponibles** (ou bottom panel)
  - Available techs for selected date (selon disponibilites BDD)
  - Affiche: Nom tech, crenel (08:00-17:00), nb missions ce jour
- **Drag & Drop**:
  - Drag "RDV gris" + drop sur tech name → popup confirme assignation
  - Update affectation_techniciens table
  - Toast "Tech {name} assigné à {service} le {date}"
  - Notif auto envoyée au tech
- **Alternativement (click method)**:
  - Click RDV → modal "Assigner un tech"
  - Dropdown techs disponibles ce jour
  - Clic → confirm

#### `responsable/incidents.vue` (Gestion Incidents)
- **Tableau incidents**:
  - Colonnes: Service | Client | Raison | Date | Status
  - Filter status: Nouveau | En cours | Résolu
  - Search par client/service
- **Raisons possibles**:
  - "Tech a signalé incident sur site" → voir rapport tech
  - "Client a demandé annulation < 24h" → voir raison client
  - "Incident non spécifié"
- **Actions**:
  - "Voir détails" → modal affichant rapport complet
  - "Marquer résolu" → close incident
  - "Contacter client" → send notification
  - "Remboursement?" (si cas urgent) → modal confirme + update statut_paiement

#### `responsable/validation-paiements.vue` (Libération Paiements)
- **Tableau prestations terminées** avec statut_paiement = 'bloqué'
- **Colonnes**: Service | Client | Date | Avis client | Rapport tech | Actions
- **Pour chaque**:
  - Affiche: Note client (1-5*), Commentaire client
  - Affiche: Rapport tech, Incident? (OUI/NON)
  - Si incident → affiche raison incident
- **Actions**:
  - "Valider et libérer le paiement"
    - Vérifie avis > 3* ET rapport complet
    - Si incident → modal confirme "Incident noté: {raison}. Confirmer libération?"
    - PUT /prestations/:id/validate → statut_paiement = 'libéré'
    - Toast "Paiement libéré au tech {name}"
  - "Retenir paiement" (motif spécial)
    - Modal: "Raison de retenue?" (textarea)
    - Update statut = retain pour phase 2
  - "Contacter client/tech" → notification

---

### ➕ 5. PAGES / FONCTIONNALITÉS ADDITIONNELLES

#### `profil.vue` (Gestion Profil - Tous Rôles)
- **Affiche données user** (pré-remplies depuis store auth)
  - Nom, Prénom
  - Email (read-only)
  - Téléphone
  - Adresse, Code postal, Ville
  - Rôle (read-only)
- **Bouton "Modifier"** → inputs editable
  - Validation téléphone (10 chiffres)
  - Validation adresse (non vide)
- **Section Sécurité**:
  - "Changer mot de passe" → modal 3 inputs (ancien + nouveau x2)
  - Validation: pwd min 8 chars, maj + min + chiffre
- **Bouton "Sauvegarder"** → PUT /users/me
  - Toast "Profil mis à jour"
- **Bouton "Déconnexion"** → logout, redirect `/`

#### `erreur-incident.vue` (Page Incident / Erreur)
- **Design**: Fond Bordeaux/Rouge, texte blanc
- **Cas 1: Statut 404**
  - Titre: "404 - Page non trouvée"
  - Texte: "Oops, cette page n'existe pas"
  - Bouton "Retour accueil" → `/`
- **Cas 2: Statut 403**
  - Titre: "Accès refusé"
  - Texte: "Tu n'as pas les permissions pour accéder à cette page"
  - Bouton "Retour" → history.back()
- **Cas 3: Incident prestation (status=incident)**
  - Titre: "⚠️ Incident sur votre prestation"
  - Affiche: Service, Date, Raison incident (du champ raison_incident)
  - Texte: "Notre responsable va vous recontacter sous peu"
  - Bouton "Voir détails" → `/suivi-commande/:id`
  - Bouton "Contacter support" → `/contact`

#### `notifications.vue` (Centre Notifications - Header + Page)
- **Cloche dans header** (tous les dashboards)
  - Nombre non lues (badge rouge)
  - Click → affiche dropdown dernieres 5 notif
  - "Voir toutes" → `/notifications`
- **Page `/notifications`**:
  - **Filtres**: Toutes | Non lues | Avis | Incidents | Assignations
  - **Tableau** : Timestamp | Type | Message | Status (Lue/Non lue)
  - **Actions**: "Marquer comme lue" | "Supprimer"
  - **Marquer tout comme lu** en haut
- **Types de notifications**:
  - Client : "Devis envoyé", "Tech assigné", "Prestation en cours", "Tech termine, votre avis?"
  - Tech : "Nouvelle assignation", "Intervention modifiée", "Paiement libéré"
  - Respo : "Demande reçue", "Tech signal incident", "Avis client reçu"

---

## 🧩 Composants Réutilisables (src/components/)

Composants Vue 3 `<script setup>` avec props/emits, rendus conditionnels.

### Layout Permanents
- **`entete.vue`** : Header avec logo + lien `/` + cloche notifications + dropdown user (Profil, Déconnexion)
- **`pied-page.vue`** : Footer avec copyright, liens légaux, contact
- **`barre-nav.vue`** : Navigation sidebar contextuelle selon rôle (hidden si pas auth)
  - User: Dashboard | Demandes | Paiements | Profil
  - Tech: Aujourd'hui | Calendrier | Alertes | Profil
  - Respo: Dashboard | Demandes | Planning | Incidents | Validation | Profil
- **`chargement.vue`** : Spinner overlay pendant appels API

### Formulaires
- **`formulaire-connexion.vue`** :
  - Props: loading (boolean)
  - Emits: @submit ({email, password})
  - Inputs: Email, Password
  - Validation temps réel (regex email, pwd > 0)
- **`formulaire-inscription.vue`** :
  - Emits: @submit ({nom, prenom, email, tel, adresse, mot_de_passe})
  - Validation: Email unique (via API), pwd min 8 chars, tel 10 digits, adresse required
- **`formulaire-contact.vue`** :
  - Emits: @submit ({nom, email, tel, sujet, message})
  - Sujet dropdown: Demande spéciale, Bug, Partenariat, Autre
  - Validation avant submit
- **`formulaire-dispo.vue`** (Tech) :
  - Props: existingDispo (array)
  - Emits: @add ({date_debut, date_fin})
  - Inputs: Date (calendar), Heure début (dropdown 08:00-17:00), Heure fin (dropdown, > début)
  - Validation: no overlap, heures 08:00-17:00

### Widgets / Cartes
- **`carte-service.vue`** :
  - Props: {id, nom, categorie, description, image}
  - Emits: @select
  - Display: Image, nom, description, bouton "Demander devis" (bordeaux)
  - Responsive: 1 colonne mobile, 3 desktop
- **`carte-devis.vue`** (pour admin/client) :
  - Props: {id, service, prix, client_nom, date_souhaitee, status}
  - Display: Service | Client | Date | Prix | Status badge
  - Status colors: en_attente=gris, envoyé=orange, accepté=vert, refusé=rouge
- **`widget-prochaine-intervention.vue`** (client dashboard) :
  - Props: {tech_name, date_rdv, adresse, status}
  - Display: Tech nom, RDV date/heure, adresse courte
  - Bouton "Voir détails" → `/suivi-commande`
- **`widget-stats.vue`** (respo dashboard) :
  - Props: {devis_attente, incidents_jour, prestations_mois, satisfaction}
  - Display: Grands nombres + infos

### Calendrier & Dates
- **`calendrier.vue`** :
  - Props: {events: Array, selectedDate, viewMode: 'month'|'week'|'day'}
  - Emits: @selectDate, @selectEvent
  - Affiche calendrier mensuel avec events colorés (couleur par tech via affectation_techniciens)
  - Click date → emit date + liste events du jour
  - Responsive responsive (stack sur mobile)
- **`timeline.vue`** (suivi prestation) :
  - Props: {steps: Array} ex: [{label: "Demande créée", date, status: 'completed'}, ...]
  - Display: Vertical timeline avec couleurs (vert=completed, gris=pending, orange=waiting)
  - Étapes: 1-Demande, 2-Devis, 3-Accepté, 4-Payé, 5-Assigné, 6-En cours, 7-Terminé, 8-Avis libre, 9-Paiement libéré

### Modales
- **`modal-annulation.vue`** :
  - Props: {show: boolean, prestation_id}
  - Emits: @confirm ({raison}), @cancel
  - Inputs: Textarea "Raison annulation"
  - Validation: raison > 10 car
  - Buttons: "Confirmer annulation" | "Garder la prestation"
- **`modal-paiement.vue`** (Stripe) :
  - Props: {show, montant, prestation_id}
  - Emits: @success, @error
  - Utilise @stripe/vue3 CardElement
  - Affiche montant + "Payer {montant}€"
  - Gère token Stripe → emit @success avec token
- **`modal-retour-tech.vue`** :
  - Props: {show, prestation_id}
  - Emits: @submit ({retour: string, incident_bool: boolean, detail_incident?: string}), @cancel
  - Textarea "Description travail" (required)
  - Checkbox "Incident?" + textarea contingent pour détail
  - Buttons: "Valider retour" | "Annuler"
- **`modal-retour-client.vue`** (Avis) :
  - Props: {show, prestation_id}
  - Emits: @submit ({note: 1-5, commentaire: string}), @cancel
  - Display: 5 stars (click pour noter)
  - Textarea optionnel "Laisser un commentaire"
  - Buttons: "Valider avis" | "Annuler"
- **`modal-assigner-tech.vue`** (respo) :
  - Props: {show, prestation_id, techsDisponibles: Array}
  - Emits: @select (tech_id), @cancel
  - Display: Liste techs (nom, nb missions jour), couleur dispo
  - Buttons: Click tech pour sélectionner | "Annuler"

### Notifications / Alertes
- **`cloche-notifications.vue`** (header) :
  - Props: {unreadCount, notifications: Array}
  - Emits: @click-notification (id), @markAllRead
  - Display: Cloche badge, dropdown dernieres 5, lien "Voir toutes"
- **`toast.vue`** (global, appelé depuis store notifications) :
  - Props: {message, type: 'success'|'error'|'info'|'warning', duration: 3000}
  - Auto-hide après duration
  - Position: haut-droit (fixed)
  - Couleurs: Vert (success), Rouge (error), Gris (info), Orange (warning)

---

## 📦 State Management Pinia (src/stores/)

7 stores centralisés pour gérer l'état global. Chacun: `state()`, `getters`, `actions` async.

### `authentification.js`
**State**:
```
token: null (JWT localStorage),
user: null (objet {id, nom, prenom, email, telephone, adresse, role}),
isAuthenticated: false,
userRole: null ('user'|'tech'|'responsable')
```
**Actions**:
- `login(email, password)` → POST /auth/login → store token + user
- `register(form)` → POST /auth/register → auto-login
- `logout()` → clear localStorage + reset state
- `updateUser(data)` → PUT /users/me → update state.user

**Getters**:
- `isUser()` : userRole === 'user'
- `isTech()` : userRole === 'tech'
- `isResponsable()` : userRole === 'responsable'
- `fullName()` : "${user.prenom} ${user.nom}"

**Interceptor Axios**: À chaque request, add token dans Authorization header. Si 401 → auto-logout + redirect /connexion

### `services.js`
**State**:
```
services: [] ({id, nom_service, categorie, description, est_recurrent}),
loading: false
```
**Actions**:
- `fetchServices()` → GET /services_catalogue → fill state
- `getServiceById(id)` → local search dans state.services

**Getters**:
- `servicesByCategorie(categorie)` : filtrer par 'propreté' | 'multiservices'

### `demandes.js`
**State**:
```
demandes: [] ({id, client_id, service_id, date_souhaitee, description_besoin, statut_devis}),
loading: false,
currentDemande: null
```
**Actions** (client qui crée):
- `createDemande(service_id, date_souhaitee, description)` → POST /demandes_devis
- `fetchMyDemandes()` → GET /demandes_devis?client_id=me

**Actions** (respo qui répond):
- `fetchAllDemandes()` → GET /demandes_devis (tous)
- `getDemande(id)` → GET /demandes_devis/:id
- `repondreDevis(id, prix, temps_estime, nb_techs)` → POST /demandes_devis/:id/devis → stoque en demande + crée prestation

### `prestations.js`
**State**:
```
prestations: [] ({id, demande_id, client_id, prix_final, date_heure_rdv, statut_paiement, statut_travail, retour_technicien}),
loading: false,
currentPrestation: null
```
**Actions**:
- `fetchAllPrestations()` → GET /prestations (respo only)
- `fetchMyPrestations()` → GET /prestations?user_id=me (client/tech selon auth)
- `getPrestation(id)` → GET /prestations/:id
- `updateStatus(id, statut_travail)` → PUT /prestations/:id/status (tech change en_cours/terminé)
- `completerPrestation(id, retour_technicien, incident_bool)` → PUT /prestations/:id/complete (tech submit retour)
- `annulerPrestation(id, raison_annulation)` → PUT /prestations/:id/cancel (client < 24h)
- `validerpaiement(id)` → PUT /prestations/:id/validate (respo libère statut_paiement)

**Getters**:
- `prestationsEnCours()` : filter statut_travail === 'en_cours'
- `prestationsTerminees()` : filter statut_travail === 'terminé'
- `prestatationsAttentePaiement()` : filter statut_paiement === 'bloqué'

### `disponibilites.js`
**State**:
```
disponibilites: [] ({id, user_id, date_debut, date_fin, est_disponible}),
loading: false
```
**Actions**:
- `fetchMyDisponibilites()` → GET /disponibilites?user_id=me (tech/respo)
- `addDisponibilite(date_debut, date_fin)` → POST /disponibilites
- `removeDisponibilite(id)` → DELETE /disponibilites/:id
- `getTechsLibres(date, duration_hours)` → GET /available-techs?date=X&duration=Y (usado par respo drag&drop)

### `utilisateurs.js`
**State**:
```
users: [] ({id, nom, prenom, email, role}),
loading: false
```
**Actions** (respo only):
- `fetchAllUsers()` → GET /users
- `createUser(form)` → POST /users
- `updateUser(id, data)` → PUT /users/:id
- `deleteUser(id)` → DELETE /users/:id

### `avis.js`
**State**:
```
avis: [...]
```
**Actions**:
- `createAvis(prestation_id, note, commentaire)` → POST /avis
- `fetchAvisForPrestation(id)` → GET /avis/:prestation_id
- `fetchMyAvis()` → GET /avis?user_id=me (client sees ses reviews)

### `notifications.js`
**State**:
```
notifications: [] ({id, message, type: 'info'|'success'|'error', timestamp, read: false}),
unreadCount: 0
```
**Actions**:
- `addNotification(message, type, duration?)` → ajoute à array + auto-remove après duration
- `markAsRead(id)` → update read=true
- `clearAll()` → vide array
- `fetchNotifications()` → GET /notifications (load depuis BDD si needed)

---

## 🌐 Services API (src/services/api/)

Wrappers Axios autour des endpoints. Gère erreurs, retries optionnels, logging.

### `auth.service.js`
```
login(email, password) → POST /auth/login
register(form) → POST /auth/register  
logout() → POST /auth/logout
refreshToken() → POST /auth/refresh
```

### `services.service.js`
```
getAllServices() → GET /services_catalogue
getServiceById(id) → GET /services_catalogue/:id
```

### `demandes.service.js`
```
createDemande(data) → POST /demandes_devis
getAllDemandes() → GET /demandes_devis (respo)
getMyDemandes() → GET /demandes_devis?client_id=me
getDemande(id) → GET /demandes_devis/:id
repondreDevis(id, data) → POST /demandes_devis/:id/devis
refuserDevis(id, reason) → PUT /demandes_devis/:id/refuse
```

### `prestations.service.js`
```
getAllPrestations() → GET /prestations (respo)
getMyPrestations() → GET /prestations?user_id=me
getPrestation(id) → GET /prestations/:id
updateStatus(id, status) → PUT /prestations/:id/status
completerPrestation(id, data) → PUT /prestations/:id/complete
annulerPrestation(id, reason) → PUT /prestations/:id/cancel
validerPaiement(id) → PUT /prestations/:id/validate
```

### `dispo.service.js`
```
getMyDisponibilites() → GET /disponibilites?user_id=me
addDisponibilite(data) → POST /disponibilites
deleteDisponibilite(id) → DELETE /disponibilites/:id
getTechsLibres(date, duration) → GET /techs/available?date=X&duration=Y
```

### `avis.service.js`
```
createAvis(prestation_id, data) → POST /avis
getAvisForPrestation(id) → GET /avis?prestation_id=id
```

### `users.service.js`
```
getMe() → GET /users/me
updateMe(data) → PUT /users/me
getAllUsers() → GET /users (respo)
createUser(data) → POST /users (respo)
updateUser(id, data) → PUT /users/:id (respo)
deleteUser(id) → DELETE /users/:id (respo)
```

### `affectations.service.js`
```
assignTech(prestation_id, tech_id) → POST /affectations
getAffectationForPrestation(id) → GET /affectations?prestation_id=id
```

### `notifications.service.js`
```
getNotifications() → GET /notifications
markAsRead(id) → PUT /notifications/:id/read
```

---

## 🛠️ Utilitaires (src/utils/ + src/services/)

### `src/services/auth.js` (Gestion Token)
```
getToken() → localStorage.getItem('token')
setToken(token) → localStorage.setItem('token', token)
clearToken() → localStorage.removeItem('token')
getAuthHeader() → {Authorization: `Bearer ${token}`}
isAuthenticated() → !!getToken()
```

### `src/utils/validation.js` (Validateurs)
```
isValidEmail(email) → regex
isValidPassword(pwd) → min 8, maj, min, chiffre
isValidPhone(tel) → 10 digits France
isValidAddress(addr) → non vide + min 5 chars
isValidDate(date) → future date
isValidTime(time) → format HH:mm
```

### `src/utils/formatters.js` (Formatage Données)
```
formatDate(date) → "15/04/2026"
formatDateTime(datetime) → "15/04/2026 14:30"
formatPrice(price) → "99.99€"
formatPhone(tel) → "06 12 34 56 78"
formatAddress(addr) → capitalize + trim
formatDuration(minutes) → "2h30" ou "45 min"
formatStatut(statut) → "En attente" (human-readable)
```

### `src/utils/constantes.js` (Constantes)
```
ROLES = {USER: 'user', TECH: 'tech', RESPONSABLE: 'responsable'}
STATUTS_DEVIS = {EN_ATTENTE: 'en_attente', ENVOYE: 'envoyé', ACCEPTE: 'accepté', REFUSE: 'refusé'}
STATUTS_PAIEMENT = {ATTENTE: 'attente', BLOQUE: 'bloqué', LIBERE: 'libéré'}
STATUTS_TRAVAIL = {PROGRAMME: 'programmé', EN_COURS: 'en_cours', TERMINE: 'terminé', INCIDENT: 'incident', ANNULE: 'annulé'}
CATEGORIES = {PROPRETE: 'propreté', MULTISERVICES: 'multiservices'}
HORAIRES_STANDARD = [08:00, 09:00, ..., 17:00] // sans 12-13h
COULEURS_DA = {BORDEAUX: '#8b1e2c', GRIS: '#666666', BLANC: '#ffffff', VERT: '#4CAF50', ROUGE: '#f44336', ORANGE: '#FF9800'}
MESSAGES_STATUTS = {...} // Messages utilisateurs pour chaque statut
```

### `src/utils/permissions.js` (Autorisation)
```
canAccess(userRole, requiredRole) → boolean
canCreateDemande(role) → role === 'user'
canRepondreDevis(role) → role === 'responsable'
canAssignTech(role) → role === 'responsable'
canCompleterPrestation(role) → role === 'tech'
canValiderPaiement(role) → role === 'responsable'
canLeaveAvis(role) → role === 'user'
canSeeAllPrestations(role) → role === 'responsable'
```

### `src/utils/helpers.js` (Utilitaires)
```
isEmpty(obj) → check null/undef/empty string
deepClone(obj) → JSON deep copy
groupBy(array, key) → group objects par propriété
sortBy(array, key, order) → tri array
hoursDifference(date1, date2) → hours between dates
isWithin24Hours(date1, date2) → boolean (< 24h)
generateId() → unique ID
debounce(fn, delay) → debounce function
throttle(fn, interval) → throttle function
```

### `src/main.js` (Initialisation App)
```
Vue.use(Pinia)
Vue.use(VueRouter)

axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3001/api'
axios.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
axios.interceptors.response.use(...)

createApp(App).use(router).mount('#app')
```

### `src/routeur.js` (Routes)
```
Routes publiques (no auth):
- { path: '/', component: accueil }
- { path: '/prestations', component: prestations }
- { path: '/apropos', component: apropos }
- { path: '/contact', component: contact }
- { path: '/connexion', component: connexion-inscription, meta: {hideNav: true} }
- { path: '/inscription', redirect: '/connexion' }

Routes client (role: user):
- { path: '/client/dashboard', component: client-dashboard, meta: {requiresAuth: true, role: 'user'} }
- { path: '/client/nouveau-devis', children: [step1, step2, step3], meta: {requiresAuth, role: 'user'} }
- { path: '/suivi-commande/:id', component: suivi-commande, meta: {requiresAuth, role: 'user'} }
- { path: '/client/paiement/:id', component: paiement, meta: {requiresAuth, role: 'user'} }
- { path: '/client/avis/:id', component: avis-create, meta: {requiresAuth, role: 'user'} }

Routes tech (role: tech):
- { path: '/tech/dashboard', component: tech-dashboard, meta: {requiresAuth, role: 'tech'} }
- { path: '/tech/calendrier', component: tech-calendrier, meta: {requiresAuth, role: 'tech'} }
- { path: '/tech/fiche/:id', component: tech-fiche, meta: {requiresAuth, role: 'tech'} }
- { path: '/tech/completer/:id', component: tech-completer, meta: {requiresAuth, role: 'tech'} }
- { path: '/tech/alertes', component: tech-alertes, meta: {requiresAuth, role: 'tech'} }

Routes responsable (role: responsable):
- { path: '/responsable/dashboard', component: resp-dashboard, meta: {requiresAuth, role: 'responsable'} }
- { path: '/responsable/demandes', component: resp-demandes, meta: {requiresAuth, role: 'responsable'} }
- { path: '/responsable/devis/:id', component: resp-devis-repondre, meta: {requiresAuth, role: 'responsable'} }
- { path: '/responsable/calendrier', component: resp-calendrier, meta: {requiresAuth, role: 'responsable'} }
- { path: '/responsable/incidents', component: resp-incidents, meta: {requiresAuth, role: 'responsable'} }
- { path: '/responsable/validation', component: resp-validation, meta: {requiresAuth, role: 'responsable'} }

Routes universelles:
- { path: '/profil', component: profil, meta: {requiresAuth: true} }
- { path: '/notifications', component: notifications, meta: {requiresAuth: true} }
- { path: '/erreur/:code', component: erreur } // 404, 403
- { path: '/:pathMatch(.*)*', redirect: '/erreur/404' }

beforeEach guard:
- Si route.meta.requiresAuth && !isAuthenticated → redirect '/connexion'
- Si route.meta.role && userRole !== route.meta.role → redirect '/erreur/403'
- Si route.meta.hideNav → hide nav
```

---

## 🔄 Flux Complet (7 Étapes)

### 1️⃣ **Demande** (Client)
- Client choisi service + date + description
- Crée demande_devis avec statut='en_attente'
- Responsable reçoit notification "Nouvelle demande"

### 2️⃣ **Devis** (Responsable)
- Responsable accède `/responsable/demandes`, filtre 'en_attente'
- Clique "Traiter" → `/responsable/devis/:id`
- Propose prix + temps + nb_techs
- Clique "Envoyer" → crée prestation + update demande statut='envoyé'
- Client notifié "Devis disponible"

### 3️⃣ **Acceptation** (Client)
- Client voit devis dans `/suivi-commande/:id`
- Timeline affiche step 3 "Accepter?"
- Choisi date/heure disponible depuis calendrier
- Clique "Accepter" → demande statut='accepté'
- Timeline → step 4 "Paiement requis"

### 4️⃣ **Paiement** (Client)
- Client clique "Payer maintenant" du widget paiement
- Redirect `/client/paiement/:id`
- Rentre infos carte via Stripe
- Après succès → statut_paiement='bloqué', statut_travail='programmé'
- Responsable notifié "Paiement reçu"

### 5️⃣ **Assignation Tech** (Responsable)
- Responsable `/responsable/calendrier`
- Voir RDV payé gris (non-assigné)
- Drag&drop RDV + drop sur tech dispo OU click → modal sélection
- Assigne → POST affectations
- Tech notifié "Nouvelle intervention assignée"

### 6️⃣ **Exécution** (Tech)
- Tech voit RDV dans `/tech/dashboard`
- Clique "Démarrer" → statut_travail='en_cours'
- Après intervention, clique "Terminer"
- Modal retour: rentre description travail + incident? + détail si oui
- POST /prestations/:id/complete → statut_travail='terminé'|'incident'
- Responsable notifié "Intervention terminée, rapport disponible"

### 7️⃣ **Libération** (Responsable → Client)
- Responsable `/responsable/validation`
- Affiche prestations terminées, statut_paiement='bloqué'
- Vérifies: avis client disponible + rapport tech
- Si incident → affiche raison (peut contacter client)
- Clique "Valider et libérer" → statut_paiement='libéré'
- Backend fait payout Stripe aux techs (ou manuel)
- Client notifié "Paiement libéré, tech rémunéré" 
- Timeline complète

### ❌ **Annulation** (Client, < 24h avant RDV)
- Client timeline < 24h: bouton "Annuler" actif
- Clique → modal-annulation demande raison
- Soumet → PUT /prestations/:id/cancel + statut_travail='annulé'
- Responsable notifié "Annulation client: {raison}"
- Tech notifié "Intervention annulée"
- if paiement déjà=libéré → remboursement (phase 2)

### 🚨 **Incident** (Tech ou Responsable)
- Tech ou Responsable signale incident
- Statut prestation → 'incident'
- Raison enregistrée
- Responsable contact client + tech pour résolution
- Peut bloquer libération paiement

---

## 📊 Mappage BDD ↔ Frontend

| BDD Table | Frontend Store | Frontend Page | Action |
|-----------|----------------|---------------|--------|
| demandes_devis | demandes | client/nouveau-devis (create), responsable/demandes (list), responsable/devis/:id (respond) | Create (client), Respond (respo) |
| prestations | prestations | suivi-commande, tech/fiche, responsable/calendrier, responsable/validation | Status updates, paiements, retours |
| affectation_techniciens | (implicit) | responsable/calendrier (drag&drop) | Assign tech |
| disponibilites | disponibilites | tech/calendrier (create/delete) | Manage schedules |
| avis | avis | client/avis, responsable/validation (view) | Rate service |
| users | authentification + utilisateurs | profil, responsable management | Auth + profile edits |
| services_catalogue | services | accueil, prestations, client/nouveau-devis-step1 | Browse + select |

---

## ✅ Checklist Implémentation

**Phase 1: Foundation**
- [ ] Backend Node.js/Express setup
- [ ] JWT auth endpoints (/auth/login, /register, /refresh)
- [ ] Database connectée (MySQL)
- [ ] Axios interceptors configured
- [ ] Route guards fonctionnels

**Phase 2: Core Pages (Public + Client)**
- [ ] Public pages (accueil, prestations, apropos, contact)
- [ ] Auth page (connexion/inscription toggle)
- [ ] Client dashboard + nouveau-devis 3 steps
- [ ] Suivi-commande timeline
- [ ] Paiement Stripe intégration

**Phase 3: Tech + Respo**
- [ ] Tech dashboard + RDV du jour
- [ ] Tech completer + formulaire retour
- [ ] Respo demandes + devis-repondre
- [ ] Respo calendrier drag&drop
- [ ] Respo incidents + validation

**Phase 4: Polish**
- [ ] Notifications system (cloche en header)
- [ ] Profil universel
- [ ] Error pages (404, 403, incident)
- [ ] Responsive design
- [ ] Tests unitaires (stores)

**Phase 5: Deploy**
- [ ] Frontend → Vercel/Netlify
- [ ] Backend → Railway/Render
- [ ] Database → AWS RDS / scaleway
- [ ] Domain + SSL
- [ ] Email notifications (SendGrid)

---

## 🎨 Design System

**Couleurs DesRuelle**:
- Primaire (CTA): Bordeaux #8b1e2c
- Secondaire (info): Gris #666666
- Fond: Blanc #ffffff
- Success: Vert #4CAF50
- Error: Rouge #f44336
- Warning: Orange #FF9800
- Info: Bleu #2196F3

**Typography**:
- Headlines: Sans-serif bold (ex: Poppins)
- Body: Sans-serif regular (ex: Inter, Open Sans)

**Spacing**: 8px grid (8, 16, 24, 32, 40px)

**Responsive Breakpoints**:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 🚀 Notes Importantes

1. **JWT Refresh** : Implémenter refresh token + access token (access short-lived, refresh long-lived)
2. **CORS** : Backend doit accepter `http://localhost:5173` (Vite dev) + domaine prod
3. **Validation** : Toujours valider front + back (front UX, back security)
4. **Paiement Bloqué** : Clé du système - jamais libérer sans tech + client non-contest (avis > 2*)
5. **Notifications Real-time** : Optionnel phase 2 (WebSocket/Server-Sent Events)
6. **Caching** : Local store services au démarrage (pas de refetch constant)
7. **Error Handling** : Toast utilisateur + logs backend pour debug
8. **Mobile First** : Design + dev mobile d'abord, puis scale desktop
9. **Sécurité** : HTTPS always, password hashing (bcrypt), rate-limiting, SQL injection prevention
10. **Performance** : Code-splitting routes, lazy-load composants, image optimization
