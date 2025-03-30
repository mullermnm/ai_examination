import { userTokenService } from "./src/services/storageService"
const isUserSignedIn = !!userTokenService.getToken()

import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/styles/tailwind.css";

let page
if (isUserSignedIn) {
    page = import('./src/main.js')
} else {
    page = import('./src/open.js')
}
page.then((app)=> {
    app.default()
})
