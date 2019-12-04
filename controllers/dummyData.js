const newSoldier = new newSoldier({
    name: "Mary Young",
    rank: "General",
    sex: "M",
    startDate: 1-1-1950,
    phone: "111-222-3333",
    email: "m@gmail.com",
    createdAt: new Date()
});
newSoldier.save((err)=>{
    if(err) console.log(err);
    else console.log('success');
});