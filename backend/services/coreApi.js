const axios = require("axios");

const SHARED =
process.env.SHARED_BACKEND_URL;


const sharedApi = axios.create({

 baseURL: SHARED,

 timeout:10000

});


module.exports={


getDevices:()=> 
sharedApi.get("/devices"),


createDevice:(data)=>
sharedApi.post("/devices",data),


deleteDevice:(id)=>
sharedApi.delete(`/devices/${id}`),


getAlerts:()=>
sharedApi.get("/alerts"),


resolveAlert:(id)=>
sharedApi.put(`/alerts/${id}/resolve`),


getAnalytics:()=>
sharedApi.get("/analytics"),


ingestSensor:(data)=>
sharedApi.post("/sensors",data)


};