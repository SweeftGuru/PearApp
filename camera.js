import { swarm } from "./app.js";
import fs from 'fs'
export class Camera {
  constructor(videoElement) {
    this.videoElement = videoElement;
    this.mediaRecorder = null;
    this.swarm = swarm;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.videoElement.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }

  startRecording() {
    this.mediaRecorder = new MediaRecorder(this.videoElement.srcObject, {
      mimeType: "video/webm;codecs=vp9",
    });

    this.mediaRecorder.start(1000);
  }
}
