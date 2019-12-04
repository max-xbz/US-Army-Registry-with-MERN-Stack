const Soldier = require('../models/Soldier');
async function getOne (id) {
    return Soldier.findById(id).populate('superior');
} 
module.exports = getOne;