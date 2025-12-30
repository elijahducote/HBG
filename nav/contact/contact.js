// home.js
import {htm} from "../../bits/utility.js";

export default function Contact(tags) {
  return htm(tags,htm(tags,[
    htm(tags,"Name / Given Name","label"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "hr"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "input", {placeholder:"Ex: John Doe / Jane Doe",class:"form-input",type:"text",name:"givenName",required:true}),
    htm(tags,"Your Industry","label"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "hr"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "input",{placeholder:"Ex: Landscaping",class:"form-input",type:"text",name:"industry",required:true}),
    htm(tags,"Email","label"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "hr"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "input",{placeholder:"Username@Website.Ext",class:"form-input",type:"email",name:"email",required:true}),
    htm(tags,"Message","label"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined, "hr"),
    htm(tags, undefined, "div", {class: "divider"}),
    htm(tags, undefined,"textarea",{placeholder:"Hello, I am interested in discussing Houston Buisness Group to join alongside its mission.",class:"form-input",maxlength:"960",minlength:"0",name:"message",required:true}),
    htm(tags, ["Join mailing list?",htm(tags, undefined, "input", {value:"true",type:"checkbox",name:"enroll"}),htm(tags, undefined, "div", {class: "divider"}),htm(tags, undefined, "hr"),htm(tags, undefined, "div", {class: "divider"})],"label"),
    htm(tags, undefined, "div", {class:"h-captcha","data-sitekey":"884a606e-fd98-4c56-a6ca-f7004ddcbe5a","data-theme":"dark","data-size":"compact"}),
    htm(tags,"SUBMIT","button",{class:"pure-button pure-button-primary"}),
  ], "form", {class: "pure-form pure-form-stacked pure-form-aligned"}),"div",{class:"full-width-form",action:"/go/join-hbg",method:"POST",type:"multipart/form-data"});
}