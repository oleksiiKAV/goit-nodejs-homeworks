const { randomUUID } = require('crypto')
const DB = require('./db')
const db = new DB('contacts.json')

const listContacts = async () => {
  return await db.read()
}

const getContactById = async contactId => {
  const contacts = await db.read()
  return contacts.find(({ id }) => id === contactId)
}

const removeContact = async contactId => {
  const contacts = await db.read()
  const index = contacts.findIndex(({ id }) => id === contactId)
  if (index !== -1) {
    const [removedContact] = contacts.splice(index, 1)
    await db.write(contacts)
    return removedContact
  }
  return null
}

const addContact = async body => {
  const contacts = await db.read()
  const newContact = {
    id: randomUUID(),
    name: body.name,
    email: body.email,
    phone: body.phone,
  }
  contacts.push(newContact)
  await db.write(contacts)
  return newContact
}

const updateContact = async (contactId, body) => {
  const contacts = await db.read()
  const index = contacts.findIndex(({ id }) => id === contactId)
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...body }
    await db.write(contacts)
    return contacts[index]
  }
  return null
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
