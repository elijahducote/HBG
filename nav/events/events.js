import {htm} from "../../bits/utility.js";

export default function Events(tags) {
  return htm(tags,
  [
    htm(tags, "Meetings", "h1"),

    // Dividers
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "hr"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "img", {src:"/cdn/events/01-12-26.jpg",class:"cover"}),
  ], "section", {id:"events"});
}