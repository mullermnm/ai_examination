import messages from "../messages/successMessages";
export default function (data = {}, status = 200) {
  data.message = data.message || messages[status];
  return {
    error: false,
    statusCode: status,
    ...data,
  };
}
