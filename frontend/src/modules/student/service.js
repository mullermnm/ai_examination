import api from './api'

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options)
    const data = await res.json()
    return data
  } catch (error) {
    return { error: true, message: error.toString() }
  }
}

export default {
  async getPublishedExams(getRequest, query = {}) {
    if (getRequest && typeof getRequest === 'function') {
      return await getRequest({ ...(api.getPublishedExams || {}), query })
    }
    // fallback to fetch
    return await safeFetch(api.getPublishedExams.url)
  },

  async getExam(getRequest, examId) {
    if (getRequest && typeof getRequest === 'function') {
      return await getRequest({ ...(api.getExam || {}), params: [examId] })
    }
    // fallback
    const url = (api.getExam.url || '').replace(':id', examId)
    return await safeFetch(url)
  },

  async submitExam(postRequest, data) {
    if (postRequest && typeof postRequest === 'function') {
      return await postRequest({ ...(api.submitExam || {}), data })
    }
    // fallback using fetch
    try {
      const res = await fetch(api.submitExam.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return await res.json()
    } catch (error) {
      return { error: true, message: error.toString() }
    }
  }
}
