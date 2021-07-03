"use_strict";

const modal_div = document.createElement("div");
const image_container = document.createElement("div");
let b64 = "";

const add_deps = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "client/bug-report.css";
  document.head.appendChild(link);
  const script = document.createElement("script");
  script.src = "./client/html2canvas.js";
  document.head.appendChild(script);
};

const add_modal_box = () => {
  modal_div.classList += "modal";
  document.getElementById("bug-report").appendChild(modal_div);
};

const populate_modal = () => {
  const modal_content = document.createElement("div");
  modal_content.classList += "modal-content";
  const close_button = document.createElement("span");
  close_button.innerHTML = "&times;";
  close_button.classList += "close";
  close_button.onclick = () => {
    modal_div.style.display = "none";
  };
  let data = document.createElement("p");
  data.innerHTML = "This will be your bug report";
  modal_content.appendChild(close_button);
  modal_content.appendChild(data);
  modal_div.appendChild(modal_content);
  image_container.id = "image-cotainer";
  modal_content.appendChild(image_container);
};

const add_button = () => {
  const button_div = document.getElementById("bug-report");
  const button = document.createElement("button");
  button.id = "bug-report-button";
  button.innerHTML = "Report Bug";
  button_div.appendChild(button);
  button.onclick = () => {
    html2canvas(document.body).then(function (canvas) {
      image_container.appendChild(canvas);
      let dataURL = canvas.toDataURL();
      b64 = dataURL.split(",")[1];
    });
    modal_div.style.display = "block";
  };
};

add_deps();
add_modal_box();
add_button();
populate_modal();
