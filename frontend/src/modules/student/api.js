export default {
    getPublishedExams: { method: "get", url: "/exams/published" },
    getExam: { method: "get", url: "/exams/:id" },
    // submit an exam (student)
    submitExam: { method: "post", url: "/examSubmissions/submit" }
}
