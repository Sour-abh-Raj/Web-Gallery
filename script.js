"use strict";

const mediaBox = document.getElementById("media-box");
const memoriesBox = document.getElementById("memories-box");
const drake = dragula([mediaBox, memoriesBox], {
  copy: (el, source) => {
    return source === mediaBox;
  },
  accepts: (el, target) => {
    return target === memoriesBox;
  },
  removeOnSpill: true,
});

drake.on("drop", (el, target, source, sibling) => {
  if (target === memoriesBox) {
    const type = el.dataset.type;
    const src = el.dataset.src;
    memoriesBox.innerHTML = "";
    if (type === "photo") {
      const img = document.createElement("img");
      img.src = src;
      memoriesBox.appendChild(img);
    } else if (type === "video") {
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      memoriesBox.appendChild(video);
    }
  }
  updateThumbnails();
});

mediaBox.addEventListener("drop", (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const type = file.type.split("/")[0];
    if (type === "image") {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.dataset.type = "photo";
      img.dataset.src = img.src;
      mediaBox.appendChild(img);
    } else if (type === "video") {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.dataset.type = "video";
      video.dataset.src = video.src;
      video.controls = true;
      mediaBox.appendChild(video);
    }
  }
  updateThumbnails();
});

mediaBox.addEventListener("dragover", (event) => {
  event.preventDefault();
});

memoriesBox.addEventListener("dragover", (event) => {
  event.preventDefault();
});

mediaBox.addEventListener("dragend", (event) => {
  const target = event.target;
  const type = target.dataset.type;
  if (type === "photo" || type === "video") {
    const parent = target.parentNode;
    if (parent !== mediaBox) {
      parent.removeChild(target);
    }
  }
});

function updateThumbnails() {
  const thumbnails = document.querySelector(".thumbnails");
  thumbnails.innerHTML = "";
  const mediaElements = mediaBox.querySelectorAll("img, video");
  for (let i = 0; i < mediaElements.length; i++) {
    const mediaElement = mediaElements[i];
    const thumbnail = document.createElement("div");
    thumbnail.classList.add("thumbnail");
    thumbnail.dataset.type = mediaElement.dataset.type;
    thumbnail.dataset.src = mediaElement.dataset.src;
    if (mediaElement.tagName === "IMG") {
      const img = document.createElement("img");
      img.src = mediaElement.src;
      thumbnail.appendChild(img);
    } else if (mediaElement.tagName === "VIDEO") {
      const video = document.createElement("video");
      video.src = mediaElement.src;
      video.controls = true;
      thumbnail.appendChild(video);
    }
    thumbnails.appendChild(thumbnail);
  }

  const thumbnailDrake = dragula([thumbnails], {
    moves: (el, container, handle) => {
      return container === mediaBox;
    },
  });

  thumbnailDrake.on("drop", (el, target, source, sibling) => {
    const type = el.dataset.type;
    const src = el.dataset.src;
    if (type === "photo") {
      const img = document.createElement("img");
      img.src = src;
      mediaBox.replaceChild(
        img,
        mediaBox.querySelector(`img[data-src="${src}"]`)
      );
    } else if (type === "video") {
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      mediaBox.replaceChild(
        video,
        mediaBox.querySelector(`video[data-src="${src}"]`)
      );
    }
    if (mediaBox.children.length === 0) {
      document.getElementById("media-placeholder").style.display = "block";
    } else {
      document.getElementById("media-placeholder").style.display = "none";
    }
  });

  thumbnailDrake.on("remove", (el, container, source) => {
    const type = el.dataset.type;
    const src = el.dataset.src;
    if (type === "photo") {
      mediaBox.removeChild(mediaBox.querySelector(`img[data-src="${src}"]`));
    } else if (type === "video") {
      mediaBox.removeChild(mediaBox.querySelector(`video[data-src="${src}"]`));
    }
    if (mediaBox.children.length === 0) {
      document.getElementById("media-placeholder").style.display = "block";
    } else {
      document.getElementById("media-placeholder").style.display = "none";
    }
  });
}
