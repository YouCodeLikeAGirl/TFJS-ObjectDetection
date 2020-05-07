import { Component, OnInit } from '@angular/core';

// tslint:disable-next-line:comment-format
//import COCO-SSD model as cocoSSD
import * as cocoSSD from '@tensorflow-models/coco-ssd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'TF-ObjectDetection';
  private video_org: HTMLVideoElement;
  private video_pre: HTMLVideoElement;
  private model;
  private pauseCount;

  ngOnInit() {
    // this.webcam_init();
    // this.predictWithCocoModel();
    this.page_load_init();
    this.initCocoModel();
    this.pauseCount = 0;
  }

  public async initCocoModel() {
    this.model = await cocoSSD.load('lite_mobilenet_v2');
    console.log('model loaded');
  }
  public async predictWithCocoModel() {
    // const model = await cocoSSD.load('lite_mobilenet_v2');
    this.detectFrame(this.video_org, this.model);
  }

  page_load_init() {
    this.video_org = <HTMLVideoElement> document.getElementById('vid_org');
    this.video_pre = <HTMLVideoElement> document.getElementById('vid_pre');
  }

  videoOnPlay(event) {
    const fps = 10;
    const stream_data = (this.video_org as any).captureStream(fps);
    this.video_pre.srcObject = stream_data;
    this.pauseCount ++;
    console.log(this.pauseCount);
  }

  webcam_init() {
    this.video_org = <HTMLVideoElement> document.getElementById('vid_org');

    navigator.mediaDevices
    .getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
    }
    })
    .then(stream => {
    this.video_org.srcObject = stream;
    this.video_org.onloadedmetadata = () => {
      this.video_org.play();
    };
    });
  }

  detectFrame = (video, model) => {
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  }

  renderPredictions = predictions => {
    const canvas = <HTMLCanvasElement> document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width  = 600;
    canvas.height = 600;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = '16px sans-serif';
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.drawImage(this.video_org, 0, 0, 300, 300);

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = '#00FFFF';
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#000000';
      ctx.fillText(prediction.class, x, y);
    });
  }

  onFileSelected(event) {
    console.log(event);
  }

}
