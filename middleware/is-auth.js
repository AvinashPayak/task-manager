const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
     const reqHeaders = req.headers.authorization;
     if(!reqHeaders){
         console.log("No authorization");
         res.status(500);
     }
     const token = reqHeaders.split(' ')[1];
     let decodedToken;

     try{
        decodedToken = jwt.verify(token, 'secrettokenkey');
     }
     catch{
         res.status(500);
     }
     if(!decodedToken){
         console.log("Token expired/Invalid")
         res.status(500);
     }
     req.userId = decodedToken.userId;
     next();
}