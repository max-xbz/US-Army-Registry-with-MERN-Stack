const Soldier = require('../models/Soldier');
async function saveOne (soldier) {
    const newSoldier = await soldier.save();
    if(newSoldier.superior !== null) {
        const parent = await Soldier.findById(newSoldier.superior);
        if(parent !== null) {
            parent.children.push(newSoldier._id);
            await parent.save();
        }
    }
    return Soldier.findById(newSoldier._id).populate('superior');
}
module.exports = saveOne;