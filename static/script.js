


const params= new URLSearchParams(window.location.search)
const uname=params.get('name')
const room=params.get('room')

const connectButton=document.getElementById('callButton')
const disconnectButton=document.getElementById
('disconnectButton')

const remoteStreamContainer=document.getElementById('remoteStreamContainer')

const remoteVideo=document.getElementById('remoteVid')

const localVideo=document.getElementById('localVideo')


const socket=io({
    query:{
        name:uname,
        room:room
    }
})


// //exit and redirect to home

disconnectButton.addEventListener('click',()=>{
    const url=window.location.href
    const endpoint="room/"+window.location.search
    let newurl=url.replace(endpoint,'')
    window.location.href=newurl
})

let localStream
let remoteStream
let peerConnection


let peerConfig={
    iceServers:[
        {
            urls:[
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302'
            ]
        }
    ]
}

// const call = async e=>{
//     await fetchUserMedia();

//     await createPeerConnection()

//     try{
//         console.log('creating offer..')
//         const offer=await peerConnection.createOffer()
//         console.log(offer)
//         peerConnection.setLocalDescription(offer)
//         didIoffer=true
//         socket.emit('newOffer',offer)
//     }
//     catch(error){
//         console.log(error)
//     }   
// }

// const answerOffer=async(offerObj)=>{
//     await fetchUserMedia()
//     await createPeerConnection(offerObj)

//     const answer=await peerConnection.createAnswer({})
//     await peerConnection.setLocalDescription(answer)

//     console.log(offerObj)
//     console.log(answer)

//     offerObj.answer=answer
//     socket.emit('newAnswer',offerObj)
//     peerConnection.addIceCandidate(offerObj)

// }

// const addAnswer=async(offerObj)=>{
//     await peerConnection.setRemoteDescription(offerObj)
// }











// const fetchUserMedia=()=>{
//     return new Promise(async(resolve,reject)=>{
//         try{
//             const stream=await navigator.mediaDevices.getUserMedia({
//                 video:true,
//                 audio:true
//             })

//             localVideo.srcObject=stream
//             localStream=stream
//             resolve()
//         }
//         catch(error){
//             console.log(error)
//             reject()
//         }
//     })
// }


// const createPeerConnection=(offerObj)=>{
//     return new Promise(async(resolve,reject)=>{

//         peerConnection=await new RTCPeerConnection(peerConfig)

//         remoteStream=new MediaStream()

//         remoteVideo.srcObject=remoteStream

//         localStream.getTracks().forEach(track=>{
//             peerConnection.addTrack(track,localStream)
//         })

//         peerConnection.addEventListener('signalingstatechange',(event)=>{
//             console.log(event)
//             console.log(peerConnection.signalingState)
//         })
//         peerConnection.addEventListener('icecandidate',e=>{
//             console.log("ICE FOUND")
//             console.log(e)

//             if(e.candidate){
//                 socket.emit('sendIceCandidate',e.candidate)
//             }
//         })

//         peerConnection.addEventListener('track',e=>{
//             console.log("got tracks")
//             console.log(e)
//             e.streams[0].getTracks().forEach(track=>{
//                 remoteStream.addTrack(track,remoteStream)
//             })
//         })

//         if(offerObj){
//             await peerConnection.setRemoteDescription(offerObj)
//         }

//         resolve()
//     })
// }

// const addNewIceCandidate=iceCandidate=>{
//     peerConnection.addIceCandidate(iceCandidate)
//     console.log("addedice")
// }


// connectButton.addEventListener('click',call)


// socket.on('newOfferCame',(data)=>{
//     console.log("new offer: "+data)
//     answerOffer(data)
// })

// socket.on('acceptAnswer',(data)=>{
//     addAnswer(data)
// })

// socket.on('newIce',(data)=>{
//     addNewIceCandidate(data)
// })

navigator.mediaDevices.getUserMedia({
    video:true,audio:true
})
.then(stream=>{
    localVideo.srcObject=stream
    localStream=stream
}).catch(error=>{
    console.log(error)
})


function initPeerConnection(){
    peerConnection=new RTCPeerConnection(peerConfig)

    localStream.getTracks().forEach(track=>{
        peerConnection.addTrack(track,localStream)
    })

    peerConnection.ontrack=event=>{
        if(!remoteStream){
            remoteStream=new MediaStream()
            remoteVideo.srcObject=remoteStream
        }
        remoteStream.addTrack(event.track)
    }

    peerConnection.onicecandidate=event=>{
        if(event.candidate){
            socket.emit('candidate',event.candidate)
        }
    }
}

socket.on('offer',async(offer)=>{
    if(!peerConnection){
        initPeerConnection()
    }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer) )

    const answer=await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    socket.emit('answer',answer)
})

socket.on('answer',async (answer)=>{
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
})

socket.on('candidate',async(candidate)=>{
    try{
        await peerConnection.addIceCandidate(candidate)
    }
    catch(e){
        console.log("error: "+e)
    }
})


async function createOffers(){
    await initPeerConnection()
    const offer=await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    socket.emit('offer',offer)
}

connectButton.addEventListener('click',()=>[
    createOffers()
])



    
    

    

    
    
    
    
    
    
    
    
    
    