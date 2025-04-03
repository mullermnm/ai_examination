export const sendConfirmationCode = async function(phoneNumber, code) {
    try {
      // send confirmation code
      console.info({ phoneNumber, code });
      


      return { error: false };
    } catch (error) {
        return {error: true}
    }
}
