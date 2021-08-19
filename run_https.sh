#!/usr/bin/env sh

# shellcheck -x -s sh
#             |
#             `-> important

main() {


  # shellcheck source=rest/venv/bin/activate
  if [ -e rest/venv/bin/activate ]; then
    . rest/venv/bin/activate
  fi

  cd rest || return
  flask run --cert=cert.pem --key=key.pem

}

main
