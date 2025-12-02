const validator = require('validator');

const validatesignupdata = (req)=>{

    const {firstName, lastName, email, age} = req.body;
    if(!firstName || !lastName){
        throw new Error("names not defined correctly");
    }

    const validemail = validator.isEmail(email);

    if(!validemail){
        throw new Error("email incorrect");
    }
    
}

module.exports = {validatesignupdata}