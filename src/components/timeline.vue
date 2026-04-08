<!-- COMPOSANT: timeline.vue
Timeline verticale pour suivi prestation (9 étapes avec statuts) -->
<template>
  <div class="timeline-container">
    <div class="timeline">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="['timeline-item', `status-${step.status}`]"
      >
        <!-- Ligne de connexion -->
        <div v-if="index < steps.length - 1" class="timeline-line"></div>

        <!-- Nœud (point) -->
        <div class="timeline-node">
          <div class="node-dot"></div>
        </div>

        <!-- Contenu -->
        <div class="timeline-content">
          <h4 class="step-label">{{ step.label }}</h4>
          <p v-if="step.date" class="step-date">{{ formatDate(step.date) }}</p>
          <p v-if="step.description" class="step-description">{{ step.description }}</p>
        </div>

        <!-- Badge de statut -->
        <div class="status-badge">
          <span :class="`badge-${step.status}`">
            {{ getStatusLabel(step.status) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true,
    validator: (arr) => {
      return arr.every(
        (step) =>
          typeof step.label === 'string' &&
          ['completed', 'pending', 'waiting'].includes(step.status)
      )
    }
  }
})

// Mapper les statuts à des labels français
const statusLabels = {
  completed: 'Complété',
  pending: 'En attente',
  waiting: 'Attente'
}

// Formater la date
function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Obtenir le label du statut
function getStatusLabel(status) {
  return statusLabels[status] || status
}
</script>

<style scoped>
.timeline-container {
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: flex-start;
  gap: 16px;
}

/* Ligne de connexion entre les items */
.timeline-line {
  position: absolute;
  left: -32px;
  top: 40px;
  width: 2px;
  height: 30px;
  background: currentColor;
}

/* Nœud (point) */
.timeline-node {
  position: absolute;
  left: -42px;
  top: 6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px currentColor;
}

/* Conteneur du contenu */
.timeline-content {
  flex: 1;
  min-width: 0;
}

.step-label {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.step-date {
  margin: 0 0 4px 0;
  font-size: 0.85rem;
  color: #8b1e2c;
  font-weight: 500;
}

.step-description {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

/* Badge de statut */
.status-badge {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.status-badge span {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Statuts - Couleurs */
.timeline-item.status-completed {
  color: #4CAF50;
}

.timeline-item.status-pending {
  color: #666666;
}

.timeline-item.status-waiting {
  color: #FF9800;
}

/* Badges - Couleurs */
.badge-completed {
  background: #c8e6c9;
  color: #2e7d32;
}

.badge-pending {
  background: #e0e0e0;
  color: #424242;
}

.badge-waiting {
  background: #ffe0b2;
  color: #e65100;
}

/* États spéciaux pour le dernier item */
.timeline-item:last-child .timeline-line {
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .timeline-container {
    padding: 16px;
  }

  .timeline {
    padding-left: 32px;
  }

  .timeline-node {
    left: -38px;
  }

  .timeline-line {
    left: -28px;
  }

  .timeline-item {
    margin-bottom: 24px;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .status-badge {
    justify-content: flex-start;
  }

  .step-label {
    font-size: 0.95rem;
  }

  .status-badge span {
    padding: 3px 8px;
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .timeline-container {
    padding: 12px;
  }

  .timeline {
    padding-left: 28px;
  }

  .node-dot {
    width: 12px;
    height: 12px;
    border-width: 2px;
  }

  .timeline-node {
    left: -34px;
    width: 20px;
    height: 20px;
  }

  .timeline-line {
    left: -24px;
    width: 2px;
  }

  .step-label {
    font-size: 0.9rem;
  }

  .step-date {
    font-size: 0.75rem;
  }

  .step-description {
    font-size: 0.85rem;
  }
}

/* Transition smooth */
.timeline-item {
  transition: transform 0.2s ease;
}

.timeline-item:hover {
  transform: translateX(4px);
}

.timeline-node {
  transition: transform 0.2s ease;
}

.timeline-item:hover .node-dot {
  transform: scale(1.2);
}
</style>
