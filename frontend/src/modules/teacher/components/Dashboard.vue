<template>
  <TeacherNavbar />
  <header-stats />
  <div>
    <div class="flex flex-wrap mt-4">
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-exam-lists />
      </div>
      <div class="w-full xl:w-4/12 px-4">
        <card-students-list />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderStats from "@/components/Headers/HeaderStats.vue";
import CardExamLists from "@/components/Cards/CardExamLists.vue";
import CardStudentsList from "@/components/Cards/CardStudentsList.vue";
import TeacherNavbar from "../../../components/Navbars/TeacherNavbar.vue";

export default {
  name: "dashboard-page",
  components: {
    TeacherNavbar,
    HeaderStats,
    CardExamLists,
    CardStudentsList,
  },
};
</script>
