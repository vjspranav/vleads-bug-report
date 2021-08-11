import loadHTML from "./template/loadHTML.js";
import "./template/html2canvas.js";

async function postData(url = "", data = {}) {
  const res = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "X-Api-Key": "wBtn7JUmMYalFiBXKgS0mCvJ6iU3qtK60yAYrG10",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return res;
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

customElements.define(
  "bug-report",
  class extends HTMLElement {
    constructor() {
      super(); // always call super() first in the constructor.
      this.b64 = "";
      this.lab_data = {};
      this.lab_data.college = this.getAttribute("college");
      this.lab_data.labname = this.getAttribute("labname");
      this.lab_data.phase = this.getAttribute("phase");
      this.lab_data.expname = this.getAttribute("expname");
      this.populateShadow(this.addScreenshot, this.b64, this.lab_data);
    }

    async populateShadow(addScreenshot, b64, lab_data) {
      const tmpl = document.createElement("template");
      const template = await loadHTML("./bug-report.html", import.meta.url);
      tmpl.innerHTML = template;
      // Attach a shadow root to the element.
      let shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `<link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
      crossorigin="anonymous"
    />
    `;
      shadowRoot.appendChild(tmpl.content.cloneNode(true));
      let modal = shadowRoot.querySelector(".modal");

      shadowRoot
        .getElementById("bug-report-button")
        .addEventListener("click", async function (e) {
          b64 = await addScreenshot(shadowRoot, b64);
          modal.style.display = "block";
          modal.style.paddingRight = "17px";
          modal.className = "modal fade show";
        });
      shadowRoot
        .getElementById("close-button")
        .addEventListener("click", function () {
          modal.style.display = "none";
          modal.className = "modal fade";
        });
      shadowRoot
        .getElementById("close_x_button")
        .addEventListener("click", function () {
          modal.style.display = "none";
          modal.className = "modal fade";
        });
      shadowRoot
        .querySelector(".modal")
        .addEventListener("click", function (e) {
          if (e.target !== modal) return;
          modal.style.display = "none";
          modal.className = "modal fade";
        });

      shadowRoot
        .getElementById("submit")
        .addEventListener("click", async function () {
          // Check if one of screenshot or description are available
          const imageBool = shadowRoot.getElementById("ss-checkbox").checked;
          const description = shadowRoot.getElementById("tf_description").value;
          if (!imageBool && !description) {
            alert(
              "Please include either screenshot or description. Both fields cannot be empty"
            );
          } else {
            let res = await submit_bug_report(
              lab_data["college"],
              lab_data["labname"],
              lab_data["phase"],
              lab_data["expname"],
              imageBool ? b64 : false,
              description ? description : false
            );
            console.log("Response is: " + res);
            if (res.status) {
              if (res.status === 200 || res.status === 201)
                alert("Bug report submitted successfully");
            } else {
              alert("Bug report failed to submit, PLease try again");
            }
          }
        });
    }

    async addScreenshot(shadowRoot, b64) {
      const image_container = shadowRoot.getElementById("image-container");
      const opts = {
        logging: true,
        useCORS: true,
      };
      b64 = await html2canvas(document.body, opts).then(function (canvas) {
        canvas.id = "image-canva";
        image_container.innerHTML = "";
        image_container.appendChild(canvas);
        let dataURL = canvas.toDataURL();
        b64 = dataURL.split(",")[1];
        return b64;
      });
      shadowRoot
        .getElementById("ss-checkbox")
        .addEventListener("click", function () {
          shadowRoot.getElementById("image-container").style.display =
            shadowRoot.getElementById("ss-checkbox").checked ? "block" : "none";
        });
      return b64;
    }
  }
);
