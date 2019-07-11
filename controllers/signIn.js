const handleSignIn = (req,res, db, bcrypt)=>{
 
    const {email, password} = req.body;
   db.select('email', 'hash').from('login')
   .where('email', '=', email)
   .then(data => {
    const isVaild = bcrypt.compareSync(password, data[0].hash)
    if(isVaild){
    return db.select('*').from('users')
        .where('email', '=', email)
        .then(user => {
            res.json(user[0])
        })
        .catch(err => res.status(404).json('unable to get user'))
    }else{
        res.status(401).json('Not Authorized')
    }
   })
}

module.exports = {
    handleSignIn: handleSignIn
}