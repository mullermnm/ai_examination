<template>
  <div class="exams-list-container">
    <div class="header">
      <h2>My Exams</h2>
      <router-link to="/teacher/exam/create" class="create-exam-btn">
        <i class="fas fa-plus-circle"></i> Create Exam
      </router-link>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Loading exams...</span>
    </div>

    <div v-else-if="error" class="error-state">{{ error }}</div>

    <div v-else-if="exams.length === 0" class="empty-state">
      <p>No exams found. Create your first exam!</p>
    </div>

    <div v-else class="table-container">
      <table class="exams-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Course</th>
            <th>Questions</th>
            <th>Marks</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in paginatedExams" :key="exam._id">
            <td>{{ exam.title }}</td>
            <td>
              <div class="course-info">
                <span class="course-name">{{ exam.courseName }}</span>
                <span class="course-code">{{ exam.courseCode }}</span>
              </div>
            </td>
            <td>{{ exam.questions.length }}</td>
            <td>{{ exam.totalMarks }}</td>
            <td>{{ exam.timeLimit }} min</td>
            <td>
              <span :class="['status-badge', exam.status]">
                {{ exam.status.charAt(0).toUpperCase() + exam.status.slice(1) }}
              </span>
            </td>
            <td class="actions">
              <router-link :to="'/teacher/exam/edit/' + exam._id" class="action-btn edit">
                <i class="fas fa-edit"></i>
              </router-link>
              <button 
                v-if="exam.status === 'draft'" 
                @click="updateExamStatus(exam, 'published')" 
                class="action-btn publish"
                title="Publish Exam"
              >
                <i class="fas fa-upload"></i>
              </button>
              <button 
                v-if="exam.status === 'published'" 
                @click="updateExamStatus(exam, 'archived')" 
                class="action-btn archive"
                title="Archive Exam"
              >
                <i class="fas fa-archive"></i>
              </button>
              <button 
                v-if="exam.status === 'draft'"
                @click="confirmDelete(exam)" 
                class="action-btn delete"
                title="Delete Exam"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="page-btn"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="page-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="dialog-overlay">
      <div class="dialog-content">
        <h3>Delete Exam</h3>
        <p>Are you sure you want to delete this exam?</p>
        <div class="dialog-actions">
          <button @click="showDeleteDialog = false" class="cancel-btn">Cancel</button>
          <button @click="deleteExam" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue';
import { useToast } from 'vue-toastification';
import api from '../api';

export default {
  name: 'ExamsList',

  setup() {
    const exams = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const showDeleteDialog = ref(false);
    const selectedExam = ref(null);
    const getRequest = inject('getRequest');
    const deleteRequest = inject('deleteRequest');
    const patchRequest = inject('patchRequest');
    const toast = useToast();

    const totalPages = computed(() => Math.ceil(exams.value.length / itemsPerPage));
    const paginatedExams = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return exams.value.slice(start, end);
    });

    const fetchExams = async () => {
      try {
        loading.value = true;
        error.value = null;

        const response = await getRequest({
          ...api.listExams,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (response?.error) {
          error.value = response.error;
          toast.error(response.error || 'Failed to fetch exams');
        } else if (response?.items) {
          exams.value = response.items;
        } else {
          error.value = 'Invalid response format';
          toast.error('Failed to load exams');
        }
      } catch (err) {
        console.error('Error fetching exams:', err);
        error.value = 'Failed to fetch exams';
        toast.error('Failed to load exams');
      } finally {
        loading.value = false;
      }
    };

    const updateExamStatus = async (exam, newStatus) => {
      try {
        const response = await patchRequest({
          ...api.updateExamStatus,
          url: api.updateExamStatus.url.replace(':id', exam._id),
          data: { status: newStatus.toUpperCase() }
        });

        if (response.error) {
          toast.error(response.message || 'Failed to update exam status');
          return;
        }

        exam.status = newStatus.toUpperCase();
        toast.success(`Exam ${newStatus.toLowerCase()} successfully`);
      } catch (err) {
        console.error('Error updating exam status:', err);
        toast.error('Failed to update exam status');
      }
    };

    const confirmDelete = (exam) => {
      selectedExam.value = exam;
      showDeleteDialog.value = true;
    };

    const deleteExam = async () => {
      if (!selectedExam.value) return;

      try {
        const response = await deleteRequest({
          ...api.deleteExam,
          url: api.deleteExam.url.replace(':id', selectedExam.value._id)
        });

        if (response?.error) {
          toast.error('Failed to delete exam: ' + response.error);
        } else {
          toast.success('Exam deleted successfully');
          showDeleteDialog.value = false;
          selectedExam.value = null;
          await fetchExams();
        }
      } catch (err) {
        console.error('Error deleting exam:', err);
        toast.error('Failed to delete exam');
      }
    };

    // Fetch exams when component is mounted
    onMounted(fetchExams);

    return {
      exams,
      loading,
      error,
      currentPage,
      totalPages,
      paginatedExams,
      showDeleteDialog,
      selectedExam,
      updateExamStatus,
      confirmDelete,
      deleteExam
    };
  }
};
</script>

<style scoped>
.exams-list-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.create-exam-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}

.create-exam-btn:hover {
  background-color: #27ae60;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.exams-table {
  width: 100%;
  border-collapse: collapse;
}

.exams-table th,
.exams-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.exams-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.course-info {
  display: flex;
  flex-direction: column;
}

.course-name {
  font-weight: 500;
}

.course-code {
  font-size: 0.9em;
  color: #666;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 500;
}

.status-badge.draft {
  background-color: #f1c40f;
  color: #000;
}

.status-badge.published {
  background-color: #2ecc71;
  color: white;
}

.status-badge.archived {
  background-color: #95a5a6;
  color: white;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  transition: opacity 0.2s;
}

.action-btn:hover {
  opacity: 0.8;
}

.action-btn.edit {
  background-color: #3498db;
}

.action-btn.publish {
  background-color: #2ecc71;
}

.action-btn.archive {
  background-color: #95a5a6;
}

.action-btn.delete {
  background-color: #e74c3c;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-top: 1px solid #eee;
}

.page-btn {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background-color: #f8f9fa;
  border-color: #ccc;
}

.page-info {
  color: #666;
}

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

.dialog-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

.dialog-content h3 {
  margin-top: 0;
  margin-bottom: 16px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn,
.delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.cancel-btn:hover,
.delete-btn:hover {
  opacity: 0.8;
}
</style>
