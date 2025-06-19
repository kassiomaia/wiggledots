import "@src/styles/global.css";
import "@src/styles/layout.css";
import "@src/styles/icons.css";

import {Application} from "@src/containers/application";
import {ApplicationProvider} from "@src/providers/ApplicationProvider";
import {AudioProvider} from "@src/providers/AudioProvider";
import {ConfigurationProvider} from "@src/providers/ConfigurationProvider";

import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ConfigurationProvider>
      <AudioProvider autoInitialize={true} defaultTheme={"RETRO"}>
        <ApplicationProvider>
          <Application/>
        </ApplicationProvider>
      </AudioProvider>
    </ConfigurationProvider>
  </React.StrictMode>,
);
