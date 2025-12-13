<template>
  <!-- Header -->
  <div class="relative bg-emerald-600 md:pt-32 pb-32 pt-12">
    <div class="px-4 md:px-10 mx-auto w-full">
      <div>
        <!-- Card stats -->
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4" @click="navigateTo('/teacher/exam/create')" style="cursor: pointer;">
            <card-stats
              statSubtitle="CREATE EXAM"
              statTitle="New"
              statArrow="up"
              statPercent="Create"
              statPercentColor="text-emerald-500"
              statDescription="Click to create exam"
              statIconName="fas fa-plus"
              statIconColor="bg-emerald-500"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4" @click="navigateTo('/students')" style="cursor: pointer;">
            <card-stats
              statSubtitle="STUDENTS"
              statTitle="25"
              statArrow="up"
              statPercent="View"
              statPercentColor="text-emerald-500"
              statDescription="Total students enrolled"
              statIconName="fas fa-users"
              statIconColor="bg-orange-500"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4" @click="navigateTo('/edit-exam')" style="cursor: pointer;">
            <card-stats
              statSubtitle="EDIT EXAM"
              statTitle="Edit"
              statArrow="down"
              statPercent="Modify"
              statPercentColor="text-orange-500"
              statDescription="Manage existing exams"
              statIconName="fas fa-edit"
              statIconColor="bg-pink-500"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4" @click="navigateTo('/teacher-settings')" style="cursor: pointer;">
            <card-stats
              statSubtitle="TEACHER"
              statTitle="Settings"
              statArrow="up"
              statPercent="Manage"
              statPercentColor="text-emerald-500"
              statDescription="Configure exam settings"
              statIconName="fas fa-cog"
              statIconColor="bg-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import CardStats from "@/components/Cards/CardStats.vue";

export default {
  name: "header-stats",
  components: {
    CardStats,
  },
  setup() {
    const router = useRouter();

    const navigateTo = (path) => {
      router.push(path);
    };

    return {
      navigateTo
    };
  }
};
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
.cursor-pointer:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
</style>
