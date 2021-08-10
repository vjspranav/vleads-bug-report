"use_strict";

const modal_div = document.createElement("div");
const modal_content = document.createElement("div");
const image_container = document.createElement("div");
let [imageBool, descriptionBool] = [false, false];
let b64 = "";
let lab_data = {};

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
    (url = "https://uyvac0qyuh.execute-api.us-east-2.amazonaws.com/test/"),
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

const create_checkbox = (id, custom_label) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "image-checkbox";
  checkbox.value = "false";
  checkbox.id = id;

  const label = document.createElement("label");
  label.htmlFor = id;
  label.appendChild(document.createTextNode(custom_label));
  return [label, checkbox];
};

const create_button = () => {
  const button = document.createElement("button");
  button.id = "submit";
  button.classList += "button";
  button.innerHTML = "Submit";
  button.onclick = async () => {
    let ss_checkbox = document.getElementById("ss-chkbox");
    let tf_included = document.getElementById("bug-description").value;
    descriptionBool = tf_included ? true : false;
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
        ss_checkbox.checked ? b64 : false,
        tf_included ? tf_included : false
      );
      console.log("Response is: " + response);
      if (response.status) {
        if (response.status === 200 || response.status === 201)
          alert("Bug report submitted successfully");
      } else {
        alert("Bug report failed to submit, PLease try again");
      }
      modal_div.style.display = "none";
    }
  };
  return button;
};

const create_text_field = () => {
  const tf = document.createElement("textarea");
  tf.cols = 50;
  tf.rows = 10;
  tf.id = "bug-description";
  tf.placeholder = "Please enter bug description if any";
  return tf;
};

const add_deps = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "./client/bug-report.css";
  document.head.appendChild(link);
  const script = document.createElement("script");
  script.src =
    "https://rawcdn.githack.com/vjspranav/vleads-bug-report/2def0aae0804156d78c5aa24a8e7101c704a2dbf/client/html2canvas.js";
  document.head.appendChild(script);
};

const add_modal_box = () => {
  modal_div.id += "modal-bug-report";
  modal_div.classList += "modal fade";
  modal_div.tabIndex = -1;
  modal_div.setAttribute("aria-labelledby", "exampleModalLabel");
  modal_div.setAttribute("aria-hidden", true);
  const modal_dialog = document.createElement("div");
  modal_dialog.classList += "modal-dialog";
  modal_div.appendChild(modal_dialog);
  modal_content.classList += "modal-content";
  modal_dialog.appendChild(modal_content);
  document.getElementById("bug-report").appendChild(modal_div);
};

const populate_modal = () => {
  modal_content.setAttribute(
    "background-color",
    "rgb(0, 0, 0)"
  ); /* Fallback color */
  modal_content.setAttribute(
    "background-color",
    "rgba(0, 0, 0, 0.4)"
  ); /* Black w/ opacity */
  const close_button = document.createElement("span");
  const [ss_label, ss_checkbox] = create_checkbox(
    "ss-chkbox",
    "Add image to bug report"
  );
  ss_checkbox.addEventListener("click", (e) => {
    console.log(e.target.checked);
    imageBool = e.target.checked;
    if (e.target.checked) {
      image_container.style.display = "block";
    } else {
      image_container.style.display = "none";
    }
  });
  const tf = create_text_field();
  close_button.innerHTML = "&times;";
  close_button.classList += "close";
  close_button.onclick = () => {
    modal_div.style.display = "none";
  };
  let data = document.createElement("p");
  data.innerHTML = "This will be your bug report";
  modal_content.appendChild(close_button);
  modal_content.appendChild(data);
  modal_content.appendChild(ss_checkbox);
  modal_content.appendChild(ss_label);
  image_container.id = "image-cotainer";
  modal_content.appendChild(image_container);
  modal_content.appendChild(tf);
  modal_content.appendChild(create_button());
};

const add_button = () => {
  const button_div = document.getElementById("bug-report");
  const button = document.createElement("button");
  button.id = "bug-report-button";
  button.classList += "btn btn-primary";
  button.setAttribute("data-bs-toggle", "modal");
  button.setAttribute("data-bs-target", "#modal-bug-report");
  button.innerHTML = "Report Bug";
  button.type = "button";

  button_div.appendChild(button);
  button_div.appendChild(image_container);
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
      canvas.style["max-width"] = "100%";
      canvas.style["max-height"] = "50vh";
      canvas.style["object-fit"] = "contain";
      canvas.style["object-position"] = "top left";
      image_container.innerHTML = "";
      image_container.appendChild(canvas);
      let dataURL = canvas.toDataURL();
      b64 = dataURL.split(",")[1];
    });
    // modal_div.style.display = "block";
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
