<template>
  <div class="container mx-auto px-4 h-full">
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-6/12 px-4">
        <div
          class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0"
        >
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
              <h6 class="text-blueGray-500 text-sm font-bold">
                Sign in with credentials
              </h6>
            </div>
            <hr class="mt-6 border-b-1 border-blueGray-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form @submit.prevent="handleLogin">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  for="userId"
                >
                  User ID
                </label>
                <div class="relative">
                  <span class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                    <i class="fas fa-id-badge"></i>
                  </span>
                  <input
                    v-model="form.userId"
                    type="text"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full pl-10 ease-linear transition-all duration-150"
                    placeholder="Enter your User ID"
                  />
                </div>
              </div>

              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  for="password"
                >
                  Password
                </label>
                <div class="relative">
                  <span class="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input
                    v-model="form.password"
                    type="password"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full pl-10 ease-linear transition-all duration-150"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div v-if="error" class="text-red-500 text-sm mb-3">
                {{ error }}
              </div>

              <div class="text-center mt-6">
                <button
                  class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="submit"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, inject } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores";
import { userTokenService } from "@/services/storageService";
import { userInfoService } from "@/services/userInfoService";
import { setHeaderAuthToken } from "@/utils/auth";
import api from "../api";

export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const error = ref("");
    const postRequest = inject('postRequest');
    
    const form = reactive({
      userId: "",
      password: "",
    });

    const handleLogin = async () => {
      try {
        error.value = "";
        console.log("Sending login request with:", form);
        const response = await postRequest({
          ...api.signin,
          data: form,
        });

        console.log("Received response:", response);

        if (response.error) {
          error.value = response.message || "Failed to login";
          return;
        }

        // Save token and user state
        await userStore.signin(response.user, response.token);
        
        // Redirect based on user role
        const redirectPath = response.user.userRole === 'teacher' ? "/teacher-dashboard" : "/student-dashboard";
        await router.push(redirectPath);
        
        window.location.reload(redirectPath);
        // Reload the page to ensure all components are properly updated
      } catch (err) {
        console.error("Login error:", err);
        error.value = "An unexpected error occurred. Please try again.";
      }
    };

    return {
      form,
      error,
      handleLogin,
    };
  },
};
</script>

<style>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
  -webkit-text-fill-color: #fff !important;
}
</style>
