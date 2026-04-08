<template>
  <div class="page-accueil">
    
    <header class="en-tete">
      <div class="logo">DesRuelle</div>
      <router-link to="/connexion" class="bouton bordeaux btn-connexion">Connexion</router-link>
    </header>

    <section class="hero">
      <h1>Vos petits projets, notre spécialité</h1>
      <p>Bienvenue chez DesRuelle. Confiez-nous vos besoins en propreté et multiservices.</p>
    </section>

    <section class="services">
      <h2>Nos Services Populaires</h2>
      <div class="grille-services">
        <div class="carte-service" v-for="service in servicesPopulaires" :key="service.id">
          <h3>{{ service.nom_service }}</h3>
          <p>{{ service.description }}</p>
          <router-link to="/prestations" class="bouton bordeaux">Demander un devis</router-link>
        </div>
      </div>
    </section>

    <section class="avis">
      <h2>Ce que pensent nos clients</h2>
      <div class="grille-avis">
        <div class="carte-avis" v-for="avis in avisClients" :key="avis.id">
          <div class="note">⭐ {{ avis.note }}/5</div>
          <p>« {{ avis.commentaire }} »</p>
          <small>- {{ avis.client }}</small>
        </div>
      </div>
    </section>

    <section class="cta-bottom">
      <router-link to="/prestations" class="bouton gris">Découvrir tous les services</router-link>
      <router-link to="/contact" class="bouton bordeaux">Nous contacter</router-link>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const servicesPopulaires = ref([
  { id: 1, nom_service: 'Nettoyage Extérieur', description: 'Nettoyage de la façade et des abords' },
  { id: 2, nom_service: 'Ménage Régulier', description: 'Nettoyage hebdomadaire complet' },
  { id: 3, nom_service: 'Réparation Plomberie', description: 'Intervention plomberie urgente' }
]);

const avisClients = ref([
  { id: 1, client: 'Marie L.', note: 5, commentaire: 'Le technicien a été super efficace. Je recommande DesRuelle !' },
  { id: 2, client: 'Jean D.', note: 5, commentaire: 'Un service de ménage au top, devis rapide et clair.' },
  { id: 3, client: 'Sophie T.', note: 5, commentaire: 'Intervention multiservices parfaite pour mes petits travaux de peinture.' }
]);
</script>

<style scoped>
.page-accueil {
  font-family: sans-serif;
  color: #333333;
}

/* --- NOUVEAU CSS POUR L'EN-TÊTE --- */
.en-tete {
  display: flex;
  justify-content: space-between; /* Pousse les éléments aux extrémités */
  align-items: center; /* Centre verticalement */
  padding: 15px 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border: 1px dashed #ccc;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8b1e2c; /* Couleur Bordeaux */
}

/* On enlève la marge du haut pour ce bouton spécifique car il est dans l'en-tête */
.btn-connexion {
  margin-top: 0;
}
/* ---------------------------------- */

section {
  padding: 40px 20px;
  margin-bottom: 20px;
  border: 1px dashed #ccc;
  background-color: #ffffff;
}

.hero {
  text-align: center;
  background-color: #f9f9f9;
  border: 2px solid #8b1e2c;
}

.grille-services, .grille-avis {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.carte-service, .carte-avis {
  border: 1px solid #666666;
  padding: 20px;
  width: 250px;
  border-radius: 8px;
  text-align: center;
}

.bouton {
  display: inline-block;
  padding: 10px 20px;
  text-decoration: none;
  color: #ffffff;
  border-radius: 4px;
  margin-top: 15px;
  font-weight: bold;
}

.bordeaux {
  background-color: #8b1e2c;
}

.gris {
  background-color: #666666;
}

.cta-bottom {
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 20px;
  border: none;
}
</style>