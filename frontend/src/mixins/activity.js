import { activityService } from "../services/activityService"
export const activity = {
  methods: {
    isGranted: activityService.isGranted,
    hasGrantedActivity: activityService.hasGrantedActivity,
  },
}
