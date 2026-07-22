import van from "vanjs-core";
import {htm} from "../utility.js";
import {paths} from "../../sitemap.json";

function capitalize(string) {
  if (string.length === 0) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function moveItem(arr, fromIndex) {
  const toIndex = Math.floor(arr.length/2);
  // 1. Create a copy to avoid side-effects
  const newArr = [...arr]; 
  
  // 2. Remove the item from the 'fromIndex'
  // .splice returns an array of removed items, so we take the first [0]
  const [movedItem] = newArr.splice(fromIndex, 1);
  
  // 3. Insert the item at the 'toIndex'
  newArr.splice(toIndex, 0, movedItem);
  
  return newArr;
}

export default function Interface (tags,tab,nomer) {
  const svgs = {
    home: htm(tags,
            htm(tags, undefined, "path", {fill: "#0FF", stroke: "#0FF", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2.4", "d": "M5.4 21V10.2H1.2L12 3l10.8 7.2h-4.2V21H15v-4.2q-.2-1.6-1.8-1.8h-2.4q-1.7.2-1.8 1.8V21z"})
          ,"svg",{xmlns: "http://www.w3.org/2000/svg", width: "800", height: "800", fill: "none", viewBox: "0 0 24 24",class:"nav-icon"}),
    events: htm(tags, 
          htm(tags,
          [
            htm(tags,undefined,"path",{d: "M186 348h80v80h-80zm348 0h80v80h-80zm-115 0h79v80h-79zM186 472h80v80h-80zm233 0h79v80h-79zm-116 0h80v80h-80zm231 125h80v80h-80zm-115 0h79v80h-79zm-116 0h80v80h-80z"}),
            htm(tags,undefined,"path",{"d": "M686 86h-64v62c0 24-19 43-42 43h-85c-23 0-42-19-42-43V86H347v61c0 23-19 44-42 44h-83c-25 0-44-21-44-44V86h-64c-42 0-76 34-76 75v564c0 41 34 75 76 75h572c42 0 77-34 77-75V161c0-41-35-75-77-75m22 637q-2 21-22 22H114q-20-1-22-22V278h616z"}),
            htm(tags, undefined, "path", {d: "M222 161h83q11-2 12-14V31q-1-28-33-31h-43c-18 0-33 14-33 31v116q1 12 14 14m273 0h85q11-2 12-13V31c0-17-15-31-33-31h-45q-28 3-31 31v117q0 11 12 13"})
          ], "g", {fill: "#0FF"})
        ,"svg", {xmlns: "http://www.w3.org/2000/svg", "xml:space": "preserve", width: "800", height: "800",viewBox:"0 0 800 800",class:"nav-icon"}),
    contact: htm(tags,
          htm(tags,[
            htm(tags, undefined, "path", {d: "M235.7 290.3c5 5 13 5 18 0l195.1-195a12.8 12.8 0 0 0-9-21.9H49.6a12.8 12.8 0 0 0-9 21.9z"}),
          htm(tags, undefined, "path", {d: "M484.5 119.3a8 8 0 0 0-8.6 1.8L274 323a41 41 0 0 1-58.3 0L13.6 121A7.9 7.9 0 0 0 0 126.7v256.7c0 18 14.6 32.6 32.6 32.6h424.2c18 0 32.6-14.6 32.6-32.6V126.6c0-3.1-2-6-4.9-7.3"})
          ],"g",{fill: "#0FF"})
          , "svg", {xmlns: "http://www.w3.org/2000/svg", "xml:space": "preserve", width: "800", height: "800", viewBox: "0 0 489.4 489.4",class:"nav-icon"}),
    market: htm(tags,
          htm(tags,[
            htm(tags,undefined,"path",{d: "M451.074,438.034h-9.837V195.806h-0.008c-12.084,0-23.525-3.944-33.045-10.585c-6.411,4.508-13.791,7.84-21.954,9.467c-3.746,0.746-7.553,1.118-11.322,1.118c-2.499,0-4.943-0.278-7.371-0.595v180.184c0,10.282-8.339,18.62-18.629,18.62h-66.923v-51.032l23.595,39.378c2.785,4.657,7.72,7.236,12.782,7.236c2.595,0,5.237-0.683,7.634-2.119c7.045-4.228,9.338-13.362,5.108-20.414l-47.429-79.167c-2.936-4.912-8.268-7.339-13.607-7.037c-0.357-0.033-54.953-0.041-55.286-0.017c-5.411-0.372-10.822,2.079-13.805,7.054l-47.43,79.167c-4.229,7.052-1.937,16.186,5.109,20.414c2.397,1.436,5.039,2.119,7.634,2.119c5.062,0,9.997-2.579,12.782-7.236l23.746-39.631v51.285h-67.066c-10.291,0-18.629-8.337-18.629-18.62V195.211c-2.427,0.317-4.872,0.595-7.371,0.595c-3.745,0-7.554-0.372-11.361-1.126c-8.157-1.626-15.52-4.951-21.923-9.459c-9.52,6.641-20.953,10.585-33.038,10.585h-0.008v242.228h-9.837c-12.877,0-23.311,10.433-23.311,23.311c0,12.877,10.434,23.311,23.311,23.311h417.492c12.878,0,23.311-10.434,23.311-23.311C474.385,448.467,463.952,438.034,451.074,438.034z"}),
            htm(tags,undefined,"path",{d: "M242.321,197.226c-17.115,0-31.007,15.877-31.007,35.474c0,19.581,13.892,35.473,31.007,35.473c17.13,0,31.015-15.892,31.015-35.473C273.335,213.103,259.451,197.226,242.321,197.226z"}),
            htm(tags,undefined,"path",{d: "M33.938,169.553c3.167,0.936,6.356,1.387,9.506,1.387c14.265,0,27.453-9.29,31.744-23.666l1.745-5.832c1.563,13.973,11.798,25.968,26.318,28.857c2.181,0.436,4.363,0.642,6.506,0.642c15.495,0,29.34-10.916,32.482-26.682l0.809-4.054c1.143,15.78,13.409,28.952,29.689,30.57c1.12,0.11,2.23,0.158,3.333,0.158c16.821,0,31.237-12.757,32.943-29.863l0.246-2.46c0.452,17.923,15.044,32.323,33.07,32.323c18.025,0,32.617-14.4,33.069-32.323l0.245,2.46c1.707,17.106,16.123,29.863,32.944,29.863c1.103,0,2.213-0.047,3.332-0.158c16.28-1.618,28.555-14.79,29.689-30.57l0.809,4.054c3.143,15.773,16.987,26.682,32.481,26.682c2.144,0,4.326-0.206,6.507-0.642c14.52-2.889,24.764-14.884,26.318-28.857l1.745,5.832c4.292,14.377,17.479,23.666,31.744,23.666c3.149,0,6.339-0.452,9.506-1.387c17.549-5.246,27.515-23.716,22.279-41.25L443.076,28.158C438.086,11.449,422.718,0,405.279,0H79.377C61.938,0,46.57,11.449,41.58,28.158L11.659,128.303C6.423,145.837,16.389,164.307,33.938,169.553z"})
          ],"g",{fill: "#0FF"})
          , "svg", {xmlns: "http://www.w3.org/2000/svg", "xml:space": "preserve", width: "800", height: "800", viewBox: "0 0 484.656 484.656",class:"nav-icon"})
  },
  newpaths = paths.filter(function(p) { return p !== nomer; }),
  nth = newpaths.length;

  const tabMenu = htm(tags,
    [
      htm(tags,
      [
        svgs[newpaths[0]],
        htm(tags,capitalize(newpaths[0]),"h2")
      ]
      ,"div",{"data-link":newpaths[0]}),

      htm(tags,
      [
          svgs[newpaths[1]],
          htm(tags,capitalize(newpaths[1]),"h2")
      ]
      ,"div",{"data-link":newpaths[1]}),

      htm(tags,
      [
        svgs[newpaths[2]],
        htm(tags,capitalize(newpaths[2]),"h2")
      ]
    ,"div",{"data-link":newpaths[2]})
    ],
    "div",
    {
      class: "wrapper topnav",
      style: "margin-bottom:0;margin-top:0"
    }),
    
  mainContent = htm(tags,tab,"div",{class: "wrapper tab-list", style: "margin-bottom:0"}),
  
  container = htm(tags,undefined,"div",{class: "container", style: "margin-bottom:0;margin-top:0"});

  van.add(container, tabMenu);
  van.add(container, mainContent);

  return container;
};