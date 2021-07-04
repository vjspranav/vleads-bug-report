"use_strict";

const modal_div = document.createElement("div");
const image_container = document.createElement("div");
let b64 = "";
let lab_data = {};

const submit_bug_report = (label, labname, phase, expname, img = false) => {
  console.log(
    "Submitting bug report: \nlabel: " +
      label +
      "\nlabname: " +
      labname +
      "\nphase: " +
      phase +
      "\nexpname: " +
      expname +
      "\nimg: " +
      (img ? true : img)
  );
};

const get_lab_data = () => {
  lab_data["labName"] = dataLayer[0]["labName"];
  lab_data["label"] = dataLayer[0]["college"];
  lab_data["phase"] = dataLayer[0]["phase"];
  lab_data["expName"] = dataLayer[0]["expName"];
};

const create_checkbox = () => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "image-checkbox";
  checkbox.value = "false";
  checkbox.id = "chkbox";

  const label = document.createElement("label");
  label.htmlFor = "chkbox";
  label.appendChild(document.createTextNode("Add image to bug report"));
  return [label, checkbox];
};

const create_button = () => {
  const button = document.createElement("button");
  button.id = "submit";
  button.classList += "button";
  button.innerHTML = "Submit";
  button.onclick = () => {
    let checkbox = document.getElementById("chkbox");
    submit_bug_report(
      lab_data["label"],
      lab_data["labName"],
      lab_data["phase"],
      lab_data["experiment"],
      checkbox.checked ? b64 : false
    );
  };
  return button;
};

const add_deps = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href =
    "https://raw.githack.com/vjspranav/vleads-bug-report/main/client/bug-report.css";
  document.head.appendChild(link);
  const script = document.createElement("script");
  script.src =
    "https://rawcdn.githack.com/vjspranav/vleads-bug-report/2def0aae0804156d78c5aa24a8e7101c704a2dbf/client/html2canvas.js";
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
  const [checkbox, label] = create_checkbox();
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
  modal_content.appendChild(checkbox);
  modal_content.appendChild(label);
  image_container.id = "image-cotainer";
  modal_content.appendChild(image_container);
  modal_content.appendChild(create_button());
};

const add_button = () => {
  const button_div = document.getElementById("bug-report");
  const button = document.createElement("button");
  button.id = "bug-report-button";
  button.innerHTML = "Report Bug";
  button_div.appendChild(button);
  button.onclick = () => {
    var canvas = document.createElement("canvas");
    // canvas.scale = 0.3;
    var opts = {
      // canvas: canvas,
      logging: true,
      useCORS: true,
    };
    html2canvas(document.body, opts).then(function (canvas) {
      canvas.id = "image-canva";
      image_container.innerHTML = "";
      image_container.appendChild(canvas);
      let dataURL = canvas.toDataURL();
      b64 = dataURL.split(",")[1];
    });
    modal_div.style.display = "block";
    get_lab_data();
    console.log(lab_data);
  };
};

window.onclick = function (event) {
  if (event.target == modal_div) {
    modal_div.style.display = "none";
  }
};

add_deps();
add_modal_box();
add_button();
populate_modal();
