// home.js
import {htm} from "../../bits/utility.js";

export default function Contact(tags) {
  return htm(tags,htm(tags,[
    htm(tags,"Name / Given Name","label"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "hr"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "input", {placeholder:"",class:"form-input",type:"text",name:"givenName"}),
    htm(tags,"Your Industry","label"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "hr"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "input",{placeholder:"",class:"form-input",type:"text",name:"industry"}),
    htm(tags,"Email","label"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "hr"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "input",{placeholder:"Username@Website.Ext",class:"form-input",type:"email",name:"email"}),
    htm(tags,"Message","label"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "hr"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined,"textarea",{class:"form-input",maxlength:"960",minlength:"20",required:undefined}),
    htm(tags,"SUBMIT","button",{class:"pure-button pure-button-primary"}),
  ], "form", {class: "pure-form pure-form-stacked pure-form-aligned"}),"div",{class:"full-width-form"});
}