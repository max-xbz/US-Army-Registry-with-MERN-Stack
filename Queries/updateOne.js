const Soldier = require('../models/Soldier');
async function updateOne (id, updateInfo) {
    const preSoldier = await Soldier.findById(id);
    let updateSuperior = null;
    if(updateInfo.superior) {
        updateSuperior = updateInfo.superior;
    }
    if(preSoldier.name != updateInfo.name) {
        preSoldier.name = updateInfo.name;
    }
    if(preSoldier.rank != updateInfo.rank) {
        preSoldier.rank = updateInfo.rank;
    }
    if(preSoldier.sex != updateInfo.sex) {
        preSoldier.sex = updateInfo.sex;
    }
    if(preSoldier.phone != updateInfo.phone) {
        preSoldier.phone = updateInfo.phone;
    }
    if(preSoldier.email != updateInfo.email) {
        preSoldier.email = updateInfo.email;
    }
    if(preSoldier.startDate != updateInfo.startDate) {
        preSoldier.startDate = updateInfo.startDate;
    }
    if(updateInfo.fileName) {
        preSoldier.image = updateInfo.fileName;
    }
    if(preSoldier.superior != updateSuperior) {
        //remove previous
        if(preSoldier.superior !== null) {
            console.log("have pre superior");
            const parent = await Soldier.findById(preSoldier.superior);
            if(parent !== null && parent.children.length !== 0) {
                parent.children.pull(id);
                await parent.save();
            }
        }
        //update new superior
        if(updateSuperior !== null) {
            console.log('have new superior');
            const curParent = await Soldier.findById(updateSuperior);
            if(curParent !== null) {
                curParent.children.push(id);
                await curParent.save();
            }
        }
        preSoldier.superior = updateSuperior;
    }
    return preSoldier.save();
}
module.exports = updateOne;