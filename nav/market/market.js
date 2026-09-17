import {htm} from "../../bits/utility.js";

export default function Market(tags) {
  return htm(tags,
  [
    htm(tags,
      [
        htm(tags, undefined, "img", {
          src: "/cdn/market/market.png",
          class: "promo",
          alt: "Market promo"
        }),
        htm(tags, "The Fall Market", "h1"),
        //htm(tags, "Stay tuned for updates", "h2"),
      ],
      "div",
      {class: "market-announce"}
    ),
  ], "section", {id: "market"});
}
