const { SQLDataSource } = require('../../utils/sqlDataSource')
const conferenceColumns = ['Id', 'Name', 'ConferenceTypeId', 'LocationId', 'StartDate', 'EndDate', 'CategoryId']

class ConferenceDb extends SQLDataSource {
  generateWhereClause(queryBuilder, filters = {}) {
    const { startDate, endDate, organizerEmail } = filters
    if (startDate) queryBuilder.andWhere('StartDate', '>=', startDate)
    if (endDate) queryBuilder.andWhere('EndDate', '<=', endDate)
    if (organizerEmail) queryBuilder.andWhere('OrganizerEmail', organizerEmail)
  }

  async getConferenceList(pager, filters) {
    const { page, pageSize } = pager
    const values = await this.knex
      .select(...conferenceColumns)
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

  async getConferenceById(id) {
    const result = await this.knex
      .select(...conferenceColumns)
      .from('Conference')
      .where('Id', id)
      .first()

    return result
  }

  async updateConferenceXAttendee({ attendeeEmail, conferenceId, statusId }) {
    const existing = await this.knex
      .select('Id', 'AttendeeEmail', 'ConferenceId')
      .from('ConferenceXAttendee')
      .where('AttendeeEmail', attendeeEmail)
      .andWhere('ConferenceId', parseInt(conferenceId))
      .first()

    const attendeeInfo = {
      AttendeeEmail: attendeeEmail,
      ConferenceId:  parseInt(conferenceId),
      StatusId: statusId
    }

    let result
    if (existing?.id) {
      result = await this.knex('ConferenceXAttendee').update(attendeeInfo, 'StatusId').where('Id', existing?.id)
    } else {
      result = await this.knex('ConferenceXAttendee').returning('StatusId').insert(attendeeInfo)
    }

    return result[0]
  }

}

module.exports = ConferenceDb;