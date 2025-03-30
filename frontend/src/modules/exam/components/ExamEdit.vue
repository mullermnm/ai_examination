<template>
  <div class="exam-edit-container">
    <div class="header">
      <h2>Edit Exam</h2>
      <div class="actions">
        <button class="save-btn" @click="saveExam">
          <i class="fas fa-save"></i> Save Changes
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Loading exam...</span>
    </div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <div v-else class="exam-form">
      <!-- Exam Info Section -->
      <div class="form-section">
        <h3>Exam Information</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Title</label>
            <input v-model="examData.examInfo.title" type="text" placeholder="Enter exam title">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="examData.examInfo.description" placeholder="Enter exam description"></textarea>
          </div>
          <div class="form-group">
            <label>Course Name</label>
            <input v-model="examData.examInfo.courseName" type="text" placeholder="Enter course name">
          </div>
          <div class="form-group">
            <label>Course Code</label>
            <input v-model="examData.examInfo.courseCode" type="text" placeholder="Enter course code">
          </div>
          <div class="form-group">
            <label>Exam Code</label>
            <input v-model="examData.examInfo.examCode" type="text" placeholder="Enter exam code">
          </div>
          <div class="form-group">
            <label>Total Marks</label>
            <input v-model.number="examData.examInfo.totalMarks" type="number" min="0">
          </div>
          <div class="form-group">
            <label>Time Limit (minutes)</label>
            <input v-model.number="examData.examInfo.timeLimit" type="number" min="0">
          </div>
        </div>
      </div>

      <!-- Questions Section -->
      <div class="form-section">
        <div class="section-header">
          <h3>Questions</h3>
          <button class="add-btn" @click="addQuestion">
            <i class="fas fa-plus"></i> Add Question
          </button>
        </div>

        <div v-for="(question, index) in examData.questions" :key="index" class="question-card">
          <div class="question-header">
            <h4>Question {{ index + 1 }}</h4>
            <button class="delete-btn" @click="removeQuestion(index)">
              <i class="fas fa-trash"></i>
            </button>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label>Question Text</label>
              <textarea v-model="question.text" placeholder="Enter question text"></textarea>
            </div>

            <div class="form-group">
              <label>Type</label>
              <select v-model="question.type">
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="short-answer">Short Answer</option>
              </select>
            </div>

            <div class="form-group">
              <label>Weight</label>
              <input v-model.number="question.weight" type="number" min="0">
            </div>

            <!-- Multiple Choice Options -->
            <div v-if="question.type === 'multiple-choice'" class="form-group full-width">
              <label>Options</label>
              <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-row">
                <input v-model="question.options[optIndex]" type="text" :placeholder="'Option ' + (optIndex + 1)">
                <button class="delete-btn small" @click="removeOption(question, optIndex)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <button class="add-btn small" @click="addOption(question)">
                <i class="fas fa-plus"></i> Add Option
              </button>
            </div>

            <!-- Correct Answer -->
            <div class="form-group">
              <label>Correct Answer</label>
              <div v-if="question.type === 'multiple-choice'">
                <select v-model.number="question.correctAnswer">
                  <option v-for="(_, index) in question.options" :key="index" :value="index">
                    Option {{ index + 1 }}
                  </option>
                </select>
              </div>
              <div v-else-if="question.type === 'true-false'">
                <select v-model="question.correctAnswer">
                  <option :value="true">True</option>
                  <option :value="false">False</option>
                </select>
              </div>
              <div v-else>
                <input v-model="question.correctAnswer" type="text" placeholder="Enter correct answer">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '../api';

export default {
  name: 'ExamEdit',

  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const getRequest = inject('getRequest');
    const putRequest = inject('putRequest');
    const patchRequest = inject('patchRequest');
    const loading = ref(true);
    const error = ref(null);
    const examData = ref({
      examInfo: {
        title: '',
        description: '',
        courseName: '',
        courseCode: '',
        examCode: '',
        totalMarks: 0,
        timeLimit: 0
      },
      questions: []
    });

    const fetchExam = async () => {
      try {
        loading.value = true;
        const response = await getRequest({
          ...api.getExam,
          url: api.getExam.url.replace(':id', route.params.id)
        });
        console.log('Response:', response);
        if (response.error) {
          // error.value = response.error || 'Failed to load exam';
          toast.error(response.message || "Failed To load Exam");
        } else {
          const fetchedData = response.item;
          console.log('Fetched data:', fetchedData);
          examData.value = {
            examInfo: {
              title: fetchedData.title,
              description: fetchedData.description,
              courseName: fetchedData.courseName,
              courseCode: fetchedData.courseCode,
              examCode: fetchedData.examCode,
              totalMarks: fetchedData.totalMarks,
              timeLimit: fetchedData.timeLimit
            },
            questions: fetchedData.questions
          };
        }
      } catch (err) {
        toast.error('Error fetching exam');
        error.value = 'Failed to load exam';
        toast.error('Failed to load exam');
      } finally {
        loading.value = false;
      }
    };

    const saveExam = async () => {
      try {
        const response = await putRequest({
          ...api.updateExam,
          url: api.updateExam.url.replace(':id', route.params.id),
          data: examData.value
        });
        console.log('Response:', response);

        if (response.error) {
          toast.error(response.message || 'Failed to save exam');
          console.error('Error response:', response.message);
          return;
        }

        toast.success('Exam saved successfully');
        router.push('/teacher/exams');
      } catch (err) {
        console.error('Error saving exam:', err);
        toast.error('Failed to save exam');
      }
    };

    const updateExamStatus = async (newStatus) => {
      try {
        const response = await patchRequest({
          ...api.updateExamStatus,
          url: api.updateExamStatus.url.replace(':id', route.params.id),
          data: { status: newStatus }
        });
        
        console.log('Status update response:', response);
        
        if (response.error) {
          toast.error(response.message || 'Failed to update exam status');
          return false;
        }
        
        examData.value.examInfo.status = newStatus;
        toast.success(`Exam ${newStatus.toLowerCase()} successfully`);
        return true;
      } catch (err) {
        console.error('Error updating exam status:', err);
        toast.error('Failed to update exam status');
        return false;
      }
    };

    const publishExam = async () => {
      if (await updateExamStatus('PUBLISHED')) {
        router.push('/teacher/exams');
      }
    };

    const addQuestion = () => {
      examData.value.questions.push({
        text: '',
        type: 'multiple-choice',
        options: ['', ''],
        correctAnswer: 0,
        weight: 1
      });
    };

    const removeQuestion = (index) => {
      examData.value.questions.splice(index, 1);
    };

    const addOption = (question) => {
      if (!question.options) {
        question.options = [];
      }
      question.options.push('');
    };

    const removeOption = (question, index) => {
      question.options.splice(index, 1);
      if (question.correctAnswer >= index) {
        question.correctAnswer = Math.max(0, question.correctAnswer - 1);
      }
    };

    onMounted(() => {
      if (route.params.id) {
        fetchExam();
      } else {
        loading.value = false;
      }
    });

    return {
      loading,
      error,
      examData,
      saveExam,
      addQuestion,
      removeQuestion,
      addOption,
      removeOption,
      publishExam
    };
  }
};
</script>

<style scoped>
.exam-edit-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background-color: #27ae60;
}

.form-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 5px;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.question-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: #2980b9;
}

.add-btn.small {
  padding: 5px 10px;
  font-size: 0.9em;
}

.delete-btn {
  padding: 8px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.delete-btn.small {
  padding: 5px;
  font-size: 0.9em;
}

.option-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.option-row input {
  flex: 1;
}

.loading-state,
.error-state {
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
</style>
