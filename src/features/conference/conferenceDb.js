const { SQLDataSource } = require('../../utils/sqlDataSource')
 
class ConferenceDb extends SQLDataSource {
  generateWhereClause(queryBuilder, filters = {}) {
    const { startDate, endDate } = filters
    if (startDate) queryBuilder.andWhere('StartDate', '>=', startDate)
    if (endDate) queryBuilder.andWhere('EndDate', '>=', endDate)
  }
 
  async getConferenceList(pager, filters) {
    const { page, pageSize } = pager
    const values = await this.knex
      .select('Id', 'Name', 'ConferenceTypeId', 'LocationId', 'StartDate', 'EndDate', 'CategoryId')
      .from('Conference')
      .modify(this.generateWhereClause, filters)
      .orderBy('Id')
      .offset(page * pageSize)
      .limit(pageSize)
 
    return { values }
  }
 
  async getConferenceListTotalCount(filters) {
    return await this.knex('Conference')
    .count('Id', { as: 'TotalCount' })
    .modify(this.generateWhereClause, filters)
    .first()
  }
}

module.exports = ConferenceDb;