# Kratos Self Service UI: React

## Installation

```
docker-compose run --rm kratos-ss-ui-react yarn install
docker-compose up -d
browse 127.0.0.1:4455
```

## Architecture Notes

- For simplicity, NGINX is used instead of Oathkeeper
- Browser checks for `isAuthenticated` flag in local storage before attempting
  to set authentication session, preventing multiple unnecessary API calls
- `isAuthenticated` flag is set on the `callback` route, which the user is
  redirected to after a login or registration
- Headers are not available to React, so only the cookie based security
  method is available
- Session is set to expire at 24 hours, after that time, the user session will
  be refreshed by redirecting them to the login screen

## @todo

- Implement error page
- Implement configurable Kratos config
- Investigate Kratos client bundle size
- OIDC support
