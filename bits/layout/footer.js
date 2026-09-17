import {htm} from "../utility.js";

export default function Footer(tags) {
  return htm(
    tags,
    htm(
      tags,
      htm(
        tags,
        [
          // Left content section
          htm(
            tags,
            [
              htm(tags, "HBG Email", "span", { class: "footer-heading" }),
              htm(tags, "Info@HtxGroup.NET", "a", {href:"mailto:info@htxgroup.net?subject=Correspondance&body=Hello%2C%20I%20am%20interested%20in%20discussing%20Houston%20Business%20Group."}),
              htm(
                tags,
                [
                  // Removed unnecessary <br> here
                  htm(tags, "Where We Operate", "span")
                ],
                "span",
                { class: "footer-heading" }
              ),
              htm(
                tags,
                [
                  htm(tags, "77007-77009, 77018", "a", {href:"https://www.google.com/maps/search/77007+77008+77009+77018"}),
                  // Removed <br>
                ],
                "span"
              ),
              // Copyright section
              htm(
                tags,
                htm(
                  tags,
                  [
                    // CHANGED: Removed the 3 consecutive <br> tags causing the height issue
                    htm(tags, "Copyright (C) Ducote Industry", "span"),
                  ],
                  "span",
                  { class: "footer-copyright-text" }
                ),
                "div",
                { class: "footer-copyright" }
              )
            ],
            "div",
            { class: "footer-content" }
          ),
          // QR code section
          htm(
            tags,
            htm(tags,
              [
                htm(tags, undefined, "path", {
                  d: "M10 45v35h70V10H10zm60 0v25H20V20h50z"
                }),
                htm(tags, undefined, "path", {
                  d: "M30 45v15h30V30H30zm70-30v5H90v10h10v10h30v10h-20v10h-10V50H90v10h10v10H90v10h10V70h10v10h10V70h10v10h10V70h-10V60h10V40h-10V30h-20V10h-10z"
                }),
                htm(tags, undefined, "path", {
                  d: "M120 15v5h20V10h-20zm30 30v35h70V10h-70zm60 0v25h-50V20h50z"
                }),
                htm(tags, undefined, "path", {
                  d: "M170 45v15h30V30h-30zM10 95v5h10V90H10zm20 0v5h10V90H30zm20 15v20h10v10h20v-10H70v-10h20v-20H80V90H70v10h10v10H60V90H50zm50-5v15h20v20h-10v-10H90v20h10v-10h10v10h20v10h-20v10H90v10h20v-10h30v10h-10v10h10v-10h10v10h10v10h10v-10h-10v-10h-10v-20h-10v-10h10v-10h10v30h10v10h20v30h20v10h10v-30h-10v-10h-10v-10h10v-10h-20v-20h20v10h10v-30h-10v-10h10v-10h-10V90h-10v10h10v10h-10v10h-30v10h20v10h-30v-20h-10v10h-10v-10h-10v-20h10v10h30v-10h10V90h-10v10h-30V90h-10v10h-10v10h-10V90h-10zm40 35v10h-10v-20h10zm40 15v5h10v10h-10v-10h-10v-10h10zm30 40v5h-10v-10h10zM10 120v10h10v10h10v-20H20v-10H10zm0 65v35h70v-70H10zm60 0v25H20v-50h50z"
                }),
                htm(tags, undefined, "path", {
                  d: "M30 185v15h30v-30H30zm60 10v5h10v10H90v10h40v-20h-10v-10H90zm50 10v5h10v10h10v-10h-10v-10h-10z"
                })
              ],
              "svg",
              {
                class: "footer-qr",
                xmlns: "http://www.w3.org/2000/svg",
                width: "306.7",
                height: "306.7",
                viewBox: "0 0 230 230"
              }
            ),
            "div",
            { class: "footer-qr-container" }
          )
        ],
        "div",
        { class: "footer-main" }
      ),
      "div",
      { class: "wrapper", style: "width: 100%; height: auto; position: relative;" }
    ),
    "div",
    // Keep the fixed positioning from the previous step
    { style: "position: fixed; bottom: 0; left: 0; width: 100%; z-index: 100; pointer-events: none;" }
  );
}