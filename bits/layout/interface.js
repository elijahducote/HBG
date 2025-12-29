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
          , "svg", {xmlns: "http://www.w3.org/2000/svg", "xml:space": "preserve", width: "800", height: "800", viewBox: "0 0 489.4 489.4",class:"nav-icon"})
  },
  nth = paths.length;
  let itR8 = nth,
  cur,
  newpaths;
  for (;itR8;--itR8) {
    cur = nth - itR8;
    if (nomer === paths[cur]) {
      newpaths = moveItem(paths,cur);
      break;
    }
  }
  
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