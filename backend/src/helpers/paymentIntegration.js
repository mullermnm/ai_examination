import axios from 'axios';
 import config from 'config';

const Axios = axios.create({});
export async function paymentPushNotificationRequest(data){
    try {
        const response = await Axios.post(config.get("paymentPushNotificationUrl"),data);
        return {
            error:false,
            ...response.data
        }
    } catch (err) {
        return {
            error:true,
            message:err.message || 'something went wrong.'
        }
    }
}