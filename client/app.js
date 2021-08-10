"use strict";
import "./html2canvas.js";

let b64 = "";
let lab_data = {};

const image_container = document.createElement("div");
image_container.id = "image-container";

// For adding inline css
const setStylesOnElement = (element, styles) => {
  Object.assign(element.style, styles);
};

const setAttributes = (element, options) => {
  Object.keys(options).forEach(function (attr) {
    element.setAttribute(attr, options[attr]);
  });
};

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "X-Api-Key": "wBtn7JUmMYalFiBXKgS0mCvJ6iU3qtK60yAYrG10",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response;
  // return response.json(); // parses JSON response into native JavaScript objects
}

const submit_bug_report = async (
  college,
  labname,
  phase,
  expname,
  img = false,
  description = false
) => {
  const data = {
    college,
    labname,
    phase,
    expname,
    img,
    description,
  };
  console.log(
    "Submitting bug report: \ncollege: " +
      college +
      "\nlabname: " +
      labname +
      "\nphase: " +
      phase +
      "\nexpname: " +
      expname +
      "\nimg: " +
      (img ? true : img) +
      "\ndescription: " +
      description
  );
  let response = await postData(
    "https://uyvac0qyuh.execute-api.us-east-2.amazonaws.com/test/",
    data
  );
  console.log(response);
  return response;
};

const get_lab_data = () => {
  lab_data["labName"] = dataLayer[0]["labName"];
  lab_data["label"] = dataLayer[0]["college"];
  lab_data["phase"] = dataLayer[0]["phase"];
  lab_data["expName"] = dataLayer[0]["expName"];
};

const add_ss = () => {
  var opts = {
    logging: true,
    useCORS: true,
  };
  html2canvas(document.body, opts).then(function (canvas) {
    canvas.id = "image-canva";
    setStylesOnElement(canvas, {
      "max-width": "100%",
      "max-height": "50vh",
      "object-fit": "contain",
      "object-position": "top left",
      border: "1px solid black",
    });
    image_container.innerHTML = "";
    image_container.appendChild(canvas);
    let dataURL = canvas.toDataURL();
    b64 = dataURL.split(",")[1];
  });
};

const add_bug_button = () => {
  let button = document.createElement("button");
  button.innerHTML = "Bug Report";
  // button.onclick = add_ss;
  setAttributes(button, {
    id: "bug-report-button",
    type: "button",
    class: "btn btn-primary",
    "data-bs-toggle": "modal",
    "data-bs-target": "#exampleModal",
  });
  document.getElementById("bug-report").appendChild(button);
  // document
  // .getElementById("bug-report")
  // .setAttribute("data-html2canvas-ignore", true);
};

const add_event_listeners = () => {
  document.getElementById("ss-checkbox").addEventListener("click", function () {
    document.getElementById("image-container").style.display =
      document.getElementById("ss-checkbox").checked ? "block" : "none";
  });
  $("#exampleModal").on("show.bs.modal", (e) => {
    add_ss();
  });
  document.getElementById("submit").onclick = async () => {
    get_lab_data();
    const imageBool = document.getElementById("ss-checkbox").checked;
    const descriptionBool = document.getElementById("tf_description").value
      ? true
      : false;
    if (!imageBool && !descriptionBool) {
      alert(
        "Please include either screenshot or description. Both fields cannot be empty"
      );
    } else {
      let response = await submit_bug_report(
        lab_data["label"],
        lab_data["labName"],
        lab_data["phase"],
        lab_data["expName"],
        imageBool ? b64 : false,
        descriptionBool
          ? document.getElementById("tf_description").value
          : false
      );
      console.log("Response is: " + response);
      if (response.status) {
        if (response.status === 200 || response.status === 201)
          alert("Bug report submitted successfully");
      } else {
        alert("Bug report failed to submit, PLease try again");
      }
    }
  };
};

const add_modal_body = (modal_body) => {
  // Checkbox
  const form_check = document.createElement("div");
  form_check.classList += "form-check";
  const checkbox = document.createElement("input");
  setAttributes(checkbox, {
    class: "form-check-input",
    type: "checkbox",
    value: "",
    id: "ss-checkbox",
    checked: true,
  });
  const label_checkbox = document.createElement("label");
  setAttributes(label_checkbox, {
    class: "form-check-label",
    for: "ss-checkbox",
  });
  label_checkbox.innerHTML = "Include Screenshot";
  form_check.appendChild(checkbox);
  form_check.appendChild(label_checkbox);
  modal_body.appendChild(form_check);

  // Image Container
  modal_body.appendChild(image_container);

  // Description
  const description = document.createElement("div");
  description.id = "description";
  const text_area = document.createElement("textarea");
  setStylesOnElement(text_area, { width: "100%", height: "max-content" });
  setAttributes(text_area, {
    placeholder: "Please enter description here",
    id: "tf_description",
  });
  description.appendChild(text_area);
  modal_body.appendChild(description);
};

const add_modal_box = () => {
  const modal = document.createElement("div");
  setAttributes(modal, {
    class: "modal fade",
    id: "exampleModal",
    tabindex: -1,
    "aria-labelledby": "exampleModalLabel",
    "aria-hidden": true,
  });
  const modal_dialog = document.createElement("div");
  modal_dialog.classList += "modal-dialog";
  const modal_content = document.createElement("div");
  modal_content.classList += "modal-content";

  // Modal Header
  const modal_header = document.createElement("div");
  modal_header.classList += "modal-header";
  const heading = document.createElement("h5");
  setAttributes(heading, { class: "modal-title", id: "exampleModalLabel" });
  heading.innerHTML = "Bug Report";
  const close_x_button = document.createElement("button");
  setAttributes(close_x_button, {
    type: "button",
    class: "btn-close",
    "data-bs-dismiss": "modal",
    "aria-label": "Close",
  });
  modal_header.appendChild(heading);
  modal_header.appendChild(close_x_button);
  modal_content.appendChild(modal_header);

  // Modal Body
  const modal_body = document.createElement("div");
  modal_body.classList += "modal-body";
  add_modal_body(modal_body);
  modal_content.appendChild(modal_body);

  // Modal Footer
  const modal_footer = document.createElement("div");
  modal_footer.classList += "modal-footer";
  const close_button = document.createElement("button");
  setAttributes(close_button, {
    type: "button",
    class: "btn btn-secondary",
    "data-bs-dismiss": "modal",
  });
  close_button.innerHTML = "Close";
  const submit_button = document.createElement("button");
  setAttributes(submit_button, { class: "btn btn-primary", id: "submit" });
  submit_button.innerHTML = "Submit";
  modal_footer.appendChild(close_button);
  modal_footer.appendChild(submit_button);
  modal_content.appendChild(modal_footer);

  // Appending content to dialog
  modal_dialog.appendChild(modal_content);

  // Appending dialog to model
  modal.appendChild(modal_dialog);

  document.getElementById("bug-report").appendChild(modal);
};

add_bug_button();
add_modal_box();
add_event_listeners();
