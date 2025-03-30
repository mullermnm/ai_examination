// import apiService from './apiService';
// import { handleError } from './handleErrorService';
import { userInfoService } from "./userInfoService"
const activityService = {
  isGranted: function (activity_code) {
    return (
      userInfoService.getUser().authorized_actions.includes(activity_code) ||
      false
    )
  },
  hasGrantedActivity: function (activities_code) {
    return activities_code.some(this.isGranted) || false
  },
}

export { activityService }
