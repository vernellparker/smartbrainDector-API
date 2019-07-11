const getAllUsers = (res, db)=>{
    db.select('*').from('users').then(users =>
        res.json(users));
}

module.exports = {
    getAllUsers: getAllUsers
}