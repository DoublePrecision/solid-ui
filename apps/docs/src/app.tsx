// @refresh reload
import { Suspense } from "solid-js"
import { getRequestEvent, isServer } from "solid-js/web"
import { MetaProvider } from "@solidjs/meta"
import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"

import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR } from "@kobalte/core"

import { MetaTags } from "~/components/meta-tags"

import "~/styles/app.css"

function getServerCookies() {
  const event = getRequestEvent()
  const cookie = event?.request.headers.get("cookie") ?? ""
  const match = cookie.match(/kb-color-mode=([^;]+)/)
  return match ? `kb-color-mode=${match[1]}` : ""
}

export default function App() {
  const storageManager = cookieStorageManagerSSR(isServer ? getServerCookies() : document.cookie)
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <MetaTags />
          <ColorModeScript storageType={storageManager.type} />
          <ColorModeProvider storageManager={storageManager}>
            <main>
              <Suspense>{props.children}</Suspense>
            </main>
          </ColorModeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
