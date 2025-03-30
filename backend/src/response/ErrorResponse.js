import messages from "../messages/errorMessages";
export default function (message, status = 500, rest={}) {
  message = message || messages[status];
  return {
    error: true,
    statusCode: status,
    message,
    ...rest
  };
}
