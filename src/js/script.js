import TestImage from "../assets/test.jpg";

const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const offscreenCanvas = new OffscreenCanvas(1280, 720);
const offscreenCtx = offscreenCanvas.getContext("2d");

const THRESHOLD = 10;

const loadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.src = src;
  });
};

const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

(function () {
  canvas.width = 1280;
  canvas.height = 720;
  loadImage(TestImage).then((image) => {
    let frame = 0;

    const update = () => {
      if (frame % 10 === 0) {
        document.body.style.backgroundColor = `#${randomColor()}`;
      }

      offscreenCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imgData = offscreenCtx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const currentImgData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      for (let i = 0; i < imgData.data.length; i += 4) {
        const black = imgData.data[i] < THRESHOLD;

        // imgData.data[i] = 0;
        // imgData.data[i + 1] = 0;
        // imgData.data[i + 2] = 0;
        currentImgData.data[i + 3] = black ? 0 : 255;
      }
      ctx.putImageData(currentImgData, 0, 0);

      requestAnimationFrame(() => {
        frame++;
        update();
      });
    };

    update();
  });
})();
