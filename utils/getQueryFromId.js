const getIdAndOwnerQuery = req => {
    return {_id: req.params.contactId, owner: req.user.id}
};

module.exports = getIdAndOwnerQuery;