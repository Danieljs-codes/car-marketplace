/// <reference types="vinxi/types/client" />

import { StartClient } from "@tanstack/start";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import nProgress from "nprogress";

import { createRouter } from "~/router";

const router = createRouter();

nProgress.configure({ showSpinner: false });

router.subscribe(
	"onBeforeLoad",
	({ pathChanged }) => pathChanged && nProgress.start(),
);
router.subscribe("onLoad", () => nProgress.done());

hydrateRoot(
	document,
	<StrictMode>
		<StartClient router={router} />
	</StrictMode>,
);
