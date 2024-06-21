import Hyperswarm from "hyperswarm"; // Module for P2P networking and connecting peers
import crypto from "hypercore-crypto"; // Cryptographic functions for generating the key in app
import b4a from "b4a";
import  * as fs from 'fs' // Module for buffer-to-string and vice-versa conversions
const { teardown } = Pear;
export const swarm = new Hyperswarm();
// const data = fs.readFile('./read.jpg')

import { Camera } from "./camera.js";
const remoteVideo  = document.querySelector('#remoteVideo')
document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.getElementById("myVideo");
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  let recordedChunks = [];
  const camera = new Camera(videoElement);

  stopButton.addEventListener("click", () =>{

  })
  startButton.addEventListener("click", async () => {
    camera.startRecording();
    camera.mediaRecorder.ondataavailable =  async (event) => {
        if (event.data.size > 0) {
          let arrayBuffer = await event.data.arrayBuffer();
          let uint8Array = new Uint8Array(arrayBuffer);
            // recordedChunks.push(uint8Array);
            const peers = [...swarm.connections]
            for (const peer of peers){
              peer.write(uint8Array)
            }
          };
        }
      
});
    
});

teardown(() => swarm.destroy());

swarm.on("connection", (peer) => {
  
  const buffers = [];
  // Event listener for receiving data (video chunks)
  peer.on("data", (buffer) => {
    buffers.push(buffer);
     combineAndPlayVideo()

  });
  function combineAndPlayVideo() {
    const combinedBlob = new Blob(buffers.slice(buffers.length - 11 , buffers.length - 1), { type: "video/mp4" });
    const videoURL = URL.createObjectURL(combinedBlob);
    console.log('Video URL:', videoURL);
    remoteVideo.src = videoURL;

  }
  
  peer.on("error", (e) => console.log(`Connection error: ${e}`));

});



document.querySelector('#stopButton').addEventListener('click',()=>{

})
document
  .querySelector("#create-chat-room")
  .addEventListener("click", createChatRoom);
document.querySelector("#join-form").addEventListener("submit", joinChatRoom);

async function joinChatRoom(e) {
  e.preventDefault();
  const topicStr = document.querySelector("#join-chat-room-topic").value;
  const topicBuffer = b4a.from(topicStr, "hex");
  joinSwarm(topicBuffer);
}
async function createChatRoom() {
  // Generate a new random topic (32 byte string)
  const topicBuffer = crypto.randomBytes(32);
  joinSwarm(topicBuffer);
}

async function joinSwarm(topicBuffer) {
  document.querySelector("#setup").classList.add("hidden");
  document.querySelector("#loading").classList.remove("hidden");

  // Join the swarm with the topic. Setting both client/server to true means that this app can act as both.
  const discovery = swarm.join(topicBuffer, { client: true, server: true });
  await discovery.flushed();

  const topic = b4a.toString(topicBuffer, "hex");
  document.querySelector("#chat-room-topic").innerText = topic;
  document.querySelector("#loading").classList.add("hidden");
  document.querySelector("#room").classList.remove("hidden");
}


