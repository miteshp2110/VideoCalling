const uname=document.getElementById("nameInput")
const room=document.getElementById("roomInput")
const connectButton =document.getElementById("connectButton")





function makeConnection(){
    
    if(uname.value!="" && room.value!=""){

        
        const url=window.location.href
        const baseUrl=`${url}room/`
        const params=new URLSearchParams({
            name:uname.value,
            room:room.value,
        })
        
        window.location.href=`${baseUrl}?${params.toString()}`
        //console.log(`${baseUrl}?${params.toString()}`)
    }
    else{
        alert("Stream not availaible")
    }
}
connectButton.addEventListener('click',()=>{
makeConnection()
})