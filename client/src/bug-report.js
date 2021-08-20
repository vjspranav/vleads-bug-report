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
  title,
  context_info,
  issues,
  img = false,
  description = false
) => {
  const data = {
    title,
    context_info,
    issues,
    img,
    description,
  };
  console.log(
    "Submitting bug report: \ncontext: " +
      context_info +
      "\nissues: " +
      issues +
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
      this.bug_info = {};
      let attr = this.attributes,
        array = Array.prototype.slice.call(attr);
      console.log(array);
      console.log(this.attributes);
      this.page_type = this.getAttribute("page-type");
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this.bug_info.issues = [];
      this.bug_info.title = this.getAttribute("title");
      this.populateShadow(this.addScreenshot, this.b64, this.bug_info);
    }

    set checkbox_json(val) {
      this.setAttribute("checkbox-json", val);
    }

    get checkbox_json() {
      return this.getAttribute("checkbox-json");
    }

    set context_info(val) {
      this.setAttribute("context-info", val);
    }

    get context_info() {
      return this.getAttribute("context-info");
    }

    static get observedAttributes() {
      return ["checkbox-json", "context-info"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case "checkbox-json":
          console.log(`Value changed from ${oldValue} to ${newValue}`);
          this.addCheckboxes();
          break;
        case "context-info":
          console.log(`Value changed from ${oldValue} to ${newValue}`);
          this.bug_info["context_info"] = newValue;
          break;
      }
    }

    addCheckboxes() {
      let counter = 0;
      const questions = JSON.parse(this.checkbox_json);
      const chb_div = this.shadowRoot.getElementById("checkboxes-question");
      if (questions) {
        this.shadowRoot.getElementById("custom-issues").style.display = "block";
        const p_type =
          this.getAttribute("page-type") in questions
            ? [this.getAttribute("page-type"), "DEFAULT"]
            : ["DEFAULT"];
        console.log(p_type);
        chb_div
          ? p_type.forEach((page_type) => {
              questions[page_type].forEach((element) => {
                let p_div = document.createElement("div");
                p_div.classList += "form-check";
                let inp = document.createElement("input");
                inp.id = "option" + (++counter).toString();
                inp.classList += "form-check-input";
                inp.type = "checkbox";
                let lab = document.createElement("label");
                lab.classList += "form-check-label";
                lab.setAttribute("for", "option" + counter.toString());
                lab.innerHTML = element;
                p_div.appendChild(inp);
                p_div.appendChild(lab);
                chb_div.appendChild(p_div);
                inp.addEventListener("click", () => {
                  if (inp.checked) this.bug_info.issues.push(element);
                  else
                    this.bug_info.issues = this.bug_info.issues.filter((el) => {
                      return el !== element;
                    });
                  console.log(this.bug_info.issues);
                });
              });
            })
          : false;
      } else {
        this.shadowRoot.getElementById("custom-issues").style.display = "none";
      }
    }

    async populateShadow(addScreenshot, b64, bug_info) {
      const tmpl = document.createElement("template");
      const template = await loadHTML("./bug-report.html", import.meta.url);
      tmpl.innerHTML = template;
      // Attach a shadow root to the element.
      let shadowRoot = this._shadowRoot;
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
              bug_info["title"],
              bug_info["context_info"],
              bug_info["issues"],
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
      this.addCheckboxes();
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
