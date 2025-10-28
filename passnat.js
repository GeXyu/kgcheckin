import { post } from "./utils/passnat_api.js";

async function passnat() {

     const phone = process.env.PASSNAT_PHONE
    const password = process.env.PASSNAT_PASSWORD


    //先登录
    const res = await post("/public/login",  {"password":password,"phone_number":phone,"platform":1})
    console.log(res)

    const checkin = await get("/user/checkIn",  {})
    console.log(checkin)
}

passnat()
