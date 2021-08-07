#!/usr/bin/env sh

SERVER="localhost"
PORT="3088"

HOST="$SERVER:$PORT"

main() {
  local headers
  headers="Content-type: application/json"

  echo "expect []"
  curl -H "$headers" -X GET    "$HOST/spaces"
  echo ""
  echo ""

  echo "expect error:false"
  curl -H "$headers" -X POST   "$HOST/spaces"
  echo ""
  echo ""

  echo "expect id:0"
  curl -H "$headers" -X GET    "$HOST/spaces"
  echo ""
  echo ""

  echo "expect id:0"
  curl -H "$headers" -X GET    "$HOST/spaces/0"
  echo ""
  echo ""

  echo "expect error:true"
  curl -H "$headers" -X GET    "$HOST/spaces/1"
  echo ""
  echo ""

  echo "expect error:false"
  curl -H "$headers" -X PUT    "$HOST/spaces/0" -d '{"state":"in-use"}'
  echo ""
  echo ""

  echo "expect id:0"
  curl -H "$headers" -X GET    "$HOST/spaces/0"
  echo ""
  echo ""

  echo "expect reservations === []"
  curl -H "$headers" -X GET    "$HOST/reservations"
  echo ""
  echo ""

  echo "expect error:false"
  curl -H "$headers" -X POST   "$HOST/reservations"
  echo ""
  echo ""

  echo "expect reservations === [{...}]"
  curl -H "$headers" -X GET    "$HOST/reservations"
  echo ""
  echo ""

  echo "expect error:false"
  curl -H "$headers" -X DELETE "$HOST/reservations/0"
  echo ""
  echo ""

  echo "expect reservations === []"
  curl -H "$headers" -X GET    "$HOST/reservations"
  echo ""
  echo ""

  echo "expect error:false"
  curl -H "$headers" -X DELETE "$HOST/spaces/0"
  echo ""
  echo ""

  echo "expect []"
  curl -H "$headers" -X GET    "$HOST/spaces"
  echo ""
  echo ""

}

main
