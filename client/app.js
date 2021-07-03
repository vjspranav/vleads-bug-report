const add_css = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "client/button.css";
  document.getElementsByTagName("HEAD")[0].appendChild(link);
};

const add_button = () => {
  const button_div = document.getElementById("bug-report");
  const button = document.createElement("button");
  button.id = "bug-report-button";
  button.innerHTML = "Report Bug";
  button_div.appendChild(button);
};

add_css();
add_button();
