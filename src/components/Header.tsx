import React from "react"
import { Link } from "react-router-dom"
import { IconLogo } from "components/IconLogo"
import { IconGear } from "components/IconGear"
import { IconSignOut } from "components/IconSignOut"
import { useAuth } from "services/auth"
import { IconRepoForked } from "components/IconRepoForked"
import config from "config/kratos"

export const Header = () => {
  const { logout } = useAuth()

  return (
    <div className="header">
      <Link to="/"><IconLogo /></Link>
      <div className="icon-actions">
        <div className="settings">
          <Link to={ config.routes.settings.path }><IconGear /></Link>
        </div>
        <div className="logout">
          <button onClick={ logout } className="a"><IconSignOut /></button>
        </div>
        <div className="fork">
          <a href="https://github.com/ellioseven/kratos-ss-ui-react" target="_blank" rel="noopener noreferrer">
            <IconRepoForked />
            <div>Fork on<br/>GitHub</div>
          </a>
        </div>
      </div>
    </div>
  )
}
