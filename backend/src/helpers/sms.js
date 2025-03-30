export const sendConfirmationCode = async function(phoneNumber, code) {
    try {
      // send confirmation code
      console.info({ phoneNumber, code });
    //   const accountSid = 'ACcaf92b19df9a6728973e0a7ad148aa63';
    //   const authToken = '1bebf3f0e7e38398bc13c75c83e073e9';
    //   const client = require('twilio')(accountSid, authToken);

    // client.verify.v2.services("VA27c551dec59f0b0944590fe19922f39d")
    //   .verifications
    //   .create({to: '+251948461673', channel: 'sms'})
    //   .then(verification => console.log(verification.sid));
      


      return { error: false };
    } catch (error) {
        return {error: true}
    }
}