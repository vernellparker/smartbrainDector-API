import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: 'c6039b5029814893a7527e77a5c9ed80'
});

const handleAPICall = (req,res)=>{
    app.models
.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
.then(data => {
    res.json(data)
    
})
.catch(err => res.status(400).json('unable to work with API'));

}


const handleImage = (req,res, db)=>{

    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json([entries[0]])
    })
    .catch(err => res.status(400).json("unable to get entries"))
}

module.exports = {
    handleImage: handleImage,
    handleAPICall:handleAPICall
}