export default {
  createExam: { method: "post", url: "/exams/create" },
  listExams: { method: "get", url: "/exams/list" },
  deleteExam: { method: "delete", url: "/exams/delete/:id" },
  updateExamStatus: { method: "patch", url: "/exams/:id/status" },
  getExam: { method: "get", url: "/exams/:id" },
  updateExam: { method: "put", url: "/exams/:id" }
}