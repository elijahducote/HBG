import {htm} from "../../bits/utility.js";

export default function Market(tags) {
  return htm(tags,
  [
    htm(tags,
      [
        htm(tags, "Fall Market Coming soon", "h1"),
        htm(tags, undefined, "div", {class: "divider"}),
        htm(tags, undefined, "hr"),
        htm(tags, undefined, "div", {class: "divider"}),
        htm(tags, "Stay tuned for updates", "h2"),
      ],
      "div",
      {class: "market-announce"}
    ),
  ], "section", {id: "market"});
}
