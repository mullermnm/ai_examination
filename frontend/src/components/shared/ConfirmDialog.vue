<template>
  <div v-if="show" class="dialog-overlay">
    <div class="dialog-container">
      <div class="dialog-content">
        <div :class="['dialog-icon', type]">
          <i :class="iconClass"></i>
        </div>
        <h3 class="dialog-title">{{ title }}</h3>
        <p class="dialog-message">{{ message }}</p>
        <div class="dialog-actions">
          <button 
            class="cancel-btn"
            @click="$emit('cancel')"
          >
            {{ cancelText }}
          </button>
          <button 
            :class="['confirm-btn', type]"
            @click="$emit('confirm')"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'danger',
      validator: value => ['danger', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    }
  },
  computed: {
    iconClass() {
      const icons = {
        danger: 'fas fa-exclamation-triangle',
        warning: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
      };
      return icons[this.type];
    }
  }
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-container {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog-content {
  text-align: center;
}

.dialog-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.dialog-icon.danger i {
  color: #e74c3c;
}

.dialog-icon.warning i {
  color: #f1c40f;
}

.dialog-icon.info i {
  color: #3498db;
}

.dialog-title {
  margin: 0 0 10px;
  font-size: 1.5em;
  color: #2c3e50;
}

.dialog-message {
  margin: 0 0 20px;
  color: #666;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.dialog-actions button {
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.dialog-actions button:hover {
  opacity: 0.9;
}

.cancel-btn {
  background-color: #f5f6f7;
  color: #666;
}

.confirm-btn {
  color: white;
}

.confirm-btn.danger {
  background-color: #e74c3c;
}

.confirm-btn.warning {
  background-color: #f1c40f;
}

.confirm-btn.info {
  background-color: #3498db;
}
</style>
