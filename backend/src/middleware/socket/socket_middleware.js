import jwt from 'jsonwebtoken';
import config from 'config';

export default async (socket,next )=>{
    // console.info('socket middleware', socket)
    // const token = socket.handshake.auth ? socket.handshake.auth.token : "";
    // const secure = socket.handshake.secure;
    // console.log("web socket token ", token);
   if(!socket.handshake.query.token){
       next(new Error('Token not provided'))
   }
  else {
      let token=socket.handshake.query.token;
         token=token.slice(1,(token.length-1));

      jwt.verify(token,config.get('secret_key'),(err,decoded)=>{
        if(err){
            next(new Error(err.message))
        }
        else {
            socket.join(decoded.office+':'+decoded.role);
            socket.join(decoded.id)
            socket.data={
                userId:decoded.id
            };
            next();
        }
    })
}
}