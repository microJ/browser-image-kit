import { checkWebpSupport, convertImage2Base64 } from "../dist/lib.esm.js"

window.app = new Vue({
  el: "#app",
  data: {
    isWebpSupport: null,
    originImg:
      "https://images.pexels.com/photos/2846034/pexels-photo-2846034.jpeg?cs=srgb&dl=pexels-magda-ehlers-2846034.jpg&fm=jpg",
    base64Img: "",
    originSize: null,
    base64Size: null,
  },
})

app.isWebpSupport = checkWebpSupport()



convertImage2Base64(app.originImg).then(base64String => {
  app.base64Img = base64String
})
