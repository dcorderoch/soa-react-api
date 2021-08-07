#!/usr/bin/env sh

SERVER="localhost"
PORT="3088"

HOST="$SERVER:$PORT"

main() {
  local headers
  headers="Content-type: application/json"

  curl -H "$headers" -X GET    "$HOST/spaces"
  echo ""
  echo ""

  curl -H "$headers" -X POST   "$HOST/spaces"
  echo ""
  echo ""

  curl -H "$headers" -X GET    "$HOST/spaces"
  echo ""
  echo ""

  curl -H "$headers" -X GET    "$HOST/spaces/0"
  echo ""
  echo ""

  curl -H "$headers" -X GET    "$HOST/spaces/1"
  echo ""
  echo ""

  curl -H "$headers" -X PUT    "$HOST/spaces/0" -d '{"state":"in-use"}'
  echo ""
  echo ""

  curl -H "$headers" -X GET    "$HOST/spaces/0"
  echo ""
  echo ""

  curl -H "$headers" -X GET    "$HOST/reservations"
  echo ""
  echo ""

  curl -H "$headers" -X POST   "$HOST/reservations"
  echo ""
  echo ""

  curl -H "$headers" -X GET    "$HOST/reservations"
  echo ""
  echo ""

  curl -H "$headers" -X DELETE "$HOST/reservations/0"
  echo ""
  echo ""

  curl -H "$headers" -X GET    "$HOST/reservations"
  echo ""
  echo ""

  curl -H "$headers" -X DELETE "$HOST/spaces/0"
  echo ""
  echo ""

  curl -H "$headers" -X GET    "$HOST/spaces"
  echo ""
  echo ""

}

main
