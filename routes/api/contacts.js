const express = require('express')

const contactsModel = require('../../models/contacts')
const { validateBody } = require('../../middlewares/middleware')
const {
  schemaCreateContact,
  schemaUpdateContact,
} = require('./contacts-validation-schema')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const contacts = await contactsModel.listContacts()
  res.json({ status: 'success', code: 200, data: { contacts } })
})

router.get('/:contactId', async (req, res, next) => {
  const contact = await contactsModel.getContactById(req.params.contactId)
  if (contact) {
    return res.json({ status: 'success', code: 200, data: { contact } })
  }
  return res
    .status(404)
    .json({ status: 'error', code: 404, message: 'Not found' })
})

router.post('/', validateBody(schemaCreateContact), async (req, res, next) => {
  if (req.body.name && req.body.email && req.body.phone) {
    const newContact = await contactsModel.addContact(req.body)
    return res
      .status(201)
      .json({ status: 'success', code: 201, data: { newContact } })
  }
  return res.status(400).json({
    status: 'error',
    code: 400,
    message: 'Missing required name field',
  })
})

router.delete('/:contactId', async (req, res, next) => {
  const deletedContact = await contactsModel.removeContact(req.params.contactId)
  if (deletedContact) {
    return res.json({
      status: 'success',
      code: 200,
      message: 'Contact deleted',
    })
  }
  return res
    .status(404)
    .json({ status: 'error', code: 404, message: 'Not found' })
})

router.put(
  '/:contactId',
  validateBody(schemaUpdateContact),
  async (req, res, next) => {
    if (!req.body.name && !req.body.email && !req.body.phone) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing required name field',
      })
    }
    const updatedContact = await contactsModel.updateContact(
      req.params.contactId,
      req.body,
    )
    if (updatedContact) {
      return res
        .status(201)
        .json({ status: 'success', code: 200, data: { updatedContact } })
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' })
  },
)

module.exports = router
