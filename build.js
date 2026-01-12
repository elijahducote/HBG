import { glob } from "glob";
import { print } from "./lib/utility.js";

// HTML-specific
import { JSDOM } from "jsdom";
import { prettify, closify } from "htmlfy";
import van from "mini-van-plate";
import { htm } from "./bits/utility.js";
import sitemap from "./sitemap.json";

import {
  // Generics
  Body,
  MetaData,
  // Layout
  Interface,
  Footer
} from "./bits/ntry.js";


async function processHTML(nav) {
  // Instance server-side DOM with HTML string
  const DOM = new JSDOM("<!DOCTYPE html>"),
  // Get the HTML document + tags
  {html, tags} = van.vanWithDoc(DOM.window.document),
  nth = nav?.paths?.length;

  let itR8 = nth,
  isErr = true,
  cur,
  page,
  nomer,
  newfyL,
  webDQment,
  formatted,
  tab,
  icons;

  for (;itR8;--itR8) {
    cur = nth - itR8;
    nomer = nav.paths[cur];
    page = nav?.[nomer];
    if (!page) continue;
    await import(`./nav/${nomer}/${nomer}.js`)
    .then(module => {
      isErr = false;
      tab = module.default;
    })
    .catch(err => {
      isErr = true;
      print(`{fail}*Something's amiss!* When attempting ./${nomer}/${nomer}.js\n${err}{/fail}`);
    });
    if (isErr) tab = undefined;
    else tab = tab(tags);
    try {
      const {createFavicon} = await import("create-favicon");
      const {html: output} = await createFavicon({
        sourceFile: './nav/icons/HBG.svg',
        outputDir: `./dploy/icons/${nomer}`,
        basePath: `/src/icons/${nomer}`,
        overwrite: true,
        warn: false,
        manifest: true,
      });
      icons = JSDOM.fragment(output);
    } catch (err) {
      print(`{fail}Icons failed for ${nomer}: \n${err}{/fail}`)
    }
    webDQment = html({lang:"en-US"},
      await MetaData(tags, page, icons),
      Body(tags, {
        //header: TopNav(tags),
        main: Interface(tags,tab,nomer),
        footer: Footer(tags)
      }, nomer)
    );
    
    formatted = closify(prettify(webDQment,
    {
      content_wrap: 0,
      strict: false,
      tab_size: 1,
      tag_wrap: 0
    }));

    newfyL = Bun.file(`./nav/${nomer}/index.html`);
    await newfyL.write(formatted)
    .then((bytes) => {
      console.log(`Successfully wrote ${bytes} bytes.`);
    }).catch((err) => {
      console.error(`Encountered issue: ${err}`);
    });
  }
}

async function runBuild() {
  const cssFyl = await glob("./nav/*/*.css"),
  jsFyl = await glob("./nav/*/index.js"),
  cmd = Bun.spawn(
  [
    "bun",
    "build",
    "./nav/shared/index.css",
    ...cssFyl,
    ...jsFyl,
    "--outdir=./dploy",
    "--target=browser",
    "--format=iife",
    "--minify",
    "--splitting",
    "--sourcemap=none",
    "--entry-naming=[dir]/[name].[ext]",
    "--asset-naming=[dir]/[name].[ext]",
    "--root=./nav",
    "--drop=debugger",
    "--pure=console.info",
    "--pure=console.debug",
    "--pure=console.warn",
    "--pure=window.alert",
    "--css-chunking",
    "--external=*.woff2",
    "--external=*.woff",
    "--external=*.png"
  ],
  {
    env: {
      ...process.env,
      PATH: `${process.env.PATH}:/root/.bun/bin/`
    },
    stdin: "inherit",
    stdout: "inherit"
  });
  await cmd.exited;
}

runBuild();
processHTML(sitemap);