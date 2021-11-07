const { RESTDataSource } = require('apollo-datasource-rest')

class ConferenceApi extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = process.env.API_URL
  }
  async getConferenceSuggestions() {
    return await this.get('suggestions/GetSuggestions')
  }
  async getRating() {
    return await this.get('rating/GetRating')
  }
  async getAverageRating() {
    return await this.get('rating/GetAverageRating')
  }
}
module.exports = ConferenceApi