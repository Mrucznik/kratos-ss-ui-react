import React, { useEffect, useState } from "react"
import { LoginRequest, PublicApi, RegistrationRequest, Session } from "@oryd/kratos-client"
import "./App.css"
import config from "./config"

const kratos = new PublicApi(config.kratos.public)

interface AuthHandlerOpts {
  type: "login" | "registration";
  setRequestResponse: Function;
}

const FORM_LABELS: { [key: string]: string } = {
  "traits.email": "Email",
  identifier: "Email",
  password: "Password"
}

const redirectToFlow = ({ type }: { type: String }) => {
  window.location.href = `${ config.kratos.browser }/self-service/browser/flows/${ type }`
}

const authHandler = ({ type, setRequestResponse }: AuthHandlerOpts): (LoginRequest | RegistrationRequest | void) => {
  const params = new URLSearchParams(window.location.search)
  const request = params.get("request") || ""
  if (!request) return redirectToFlow({ type })
  const authRequest = type === "login"
    ? kratos.getSelfServiceBrowserLoginRequest(request)
    : kratos.getSelfServiceBrowserRegistrationRequest(request)
  authRequest.then(({ body, response }) => {
    if (response.statusCode !== 200) if (!request) return redirectToFlow({ type })
    setRequestResponse(body)
  }).catch(error => {
    console.log(error)
    return redirectToFlow({ type })
  })
}

const Auth = ({ type }: ({ type: "login" | "registration" })) => {
  const [requestResponse, setRequestResponse] = useState<LoginRequest | RegistrationRequest>()

  useEffect(() => {
    authHandler({ type, setRequestResponse })
  }, [])

  // @todo Check for `oidc` method.
  const config = requestResponse?.methods?.password?.config

  if (!config) return null

  const { action, fields = [], messages = [] } = config

  // @todo Sort by property position.
  const fieldDisplay = fields.map(({ name, type, required, value, messages = [] }) => {
    const _required = required ? { required } : {}
    return (
      <React.Fragment key={ name }>
        { FORM_LABELS[name] && <p><label>{ FORM_LABELS[name] }</label></p> }
        <input type={ type } name={ name } defaultValue={ value as any } { ..._required } />
        <p>{ messages.map(({ text }) => text) }</p>
      </React.Fragment>
    )
  })

  return (
    <React.Fragment>
      { type === "registration" && <a href="/auth/login">Login</a> }
      { type === "login" && <a href="/auth/registration">Register</a> }
      { messages.map(({ text }) => <p key={ text }>{ text }</p>) }
      { action &&
        <form action={ action } style={ { margin: "60px 0" } } method="POST">
          { fieldDisplay }
          <input type="submit" value="Register"/>
        </form> }
    </React.Fragment>
  )
}

const Profile = () => {
  const [profile, setProfile] = useState<Session>()

  useEffect(() => {
    kratos.whoami()
      .then(({ body }) => setProfile(body))
  }, [])

  const display = profile?.identity?.traits || {}

  return (
    <pre style={ { textAlign: "left" } }>
      { JSON.stringify(display, null, "\t") }
    </pre>
  )
}

function App() {
  const { pathname } = window.location
  return (
    <div className="App">
      { pathname === "/" && <Profile/> }
      { pathname === "/auth/login" && <Auth type="login" /> }
      { pathname === "/auth/registration" && <Auth type="registration" /> }
    </div>
  )
}

export default App