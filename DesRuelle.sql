-- Base de Données : DesRuelle
-- Site de Gestion de Conciergerie

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS DesRuelle;
USE DesRuelle;


-- Table 1: USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    adresse VARCHAR(255),
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    role ENUM('user', 'tech', 'responsable') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);

-- Table 2: SERVICES_CATALOGUE
CREATE TABLE services_catalogue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categorie ENUM('propreté', 'multiservices') NOT NULL,
    nom_service VARCHAR(255) NOT NULL,
    description TEXT,
    est_recurrent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_services_categorie (categorie)
);

-- Table 3: DEMANDES_DEVIS
CREATE TABLE demandes_devis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    service_id INT NOT NULL,
    date_souhaitee DATETIME NOT NULL,
    description_besoin TEXT,
    statut_devis ENUM('en_attente', 'envoyé', 'refusé', 'accepté') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services_catalogue(id) ON DELETE RESTRICT,
    INDEX idx_demandes_client (client_id),
    INDEX idx_demandes_service (service_id),
    INDEX idx_demandes_statut (statut_devis)
);

-- Table 4: PRESTATIONS
CREATE TABLE prestations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    demande_id INT NOT NULL UNIQUE,
    service_id INT NOT NULL,
    client_id INT NOT NULL,
    prix_final DECIMAL(10, 2) NOT NULL,
    temps_estime TIME,
    date_heure_rdv DATETIME NOT NULL,
    statut_paiement ENUM('attente', 'bloqué', 'libéré') DEFAULT 'attente',
    statut_travail ENUM('programmé', 'en_cours', 'terminé', 'incident', 'annulé') DEFAULT 'programmé',
    raison_incident TEXT,
    date_annulation DATETIME,
    raison_annulation TEXT,
    retour_technicien TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (demande_id) REFERENCES demandes_devis(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services_catalogue(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_prestations_client (client_id),
    INDEX idx_prestations_rdv (date_heure_rdv),
    INDEX idx_prestations_statut_travail (statut_travail),
    INDEX idx_prestations_statut_paiement (statut_paiement)
);

-- Table 5: AFFECTATION_TECHNICIENS
CREATE TABLE affectation_techniciens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prestation_id INT NOT NULL,
    tech_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prestation_id) REFERENCES prestations(id) ON DELETE CASCADE,
    FOREIGN KEY (tech_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (prestation_id, tech_id),
    INDEX idx_affectation_prestation (prestation_id),
    INDEX idx_affectation_tech (tech_id)
);

-- Table 6: DISPONIBILITES
CREATE TABLE disponibilites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NOT NULL,
    est_disponible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_disponibilites_user (user_id),
    INDEX idx_disponibilites_dates (date_debut, date_fin)
);

-- Table 7: AVIS
CREATE TABLE avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prestation_id INT NOT NULL,
    client_id INT NOT NULL,
    note TINYINT CHECK (note >= 1 AND note <= 5),
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prestation_id) REFERENCES prestations(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_avis_prestation (prestation_id),
    INDEX idx_avis_client (client_id),
    INDEX idx_avis_note (note)
);

-- Données de Test

INSERT INTO services_catalogue (categorie, nom_service, description, est_recurrent) VALUES
('propreté', 'Nettoyage Extérieur', 'Nettoyage de la façade et des abords', FALSE),
('propreté', 'Ménage Régulier', 'Nettoyage hebdomadaire complet', TRUE),
('multiservices', 'Peinture', 'Peinture intérieure/extérieure', FALSE),
('multiservices', 'Réparation Plomberie', 'Intervention plomberie urgente', FALSE);

