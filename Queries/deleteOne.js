const Soldier = require('../models/Soldier');
async function deleteOne (id) {
    const soldier = await Soldier.findById(id);
    if(soldier === null) {
        return new Promise((resolve, reject)=>{
            resolve("no such soldier");
        });
    }
    if(soldier !== null) {
        if(soldier.superior !== null) {
            const parent = await Soldier.findById(soldier.superior);
            // console.log(parent);
            if(parent !== null && parent.children.length !== 0) {
                parent.children.pull(id);
                await parent.save();
            }
        }
        if(soldier.children.length !== 0) {
            await Soldier.updateMany({_id: soldier.children}, {superior: null});
        }
    }
    return Soldier.findOneAndDelete({_id: id});
}
module.exports = deleteOne;