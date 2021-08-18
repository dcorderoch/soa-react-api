"""
Basic WEB API
"""

from datetime import datetime, timezone
import json
from typing import Dict, Optional, Tuple
import uuid

from flask import Flask, jsonify, request, Response
from flask_cors import CORS  # type: ignore


def isoformat_js_like_date(tstamp: datetime):
    """
    get a javascript-like Date() ISO 8601 date string
    """
    return (
        tstamp.astimezone(timezone.utc)
        .isoformat(timespec="milliseconds")
        .replace("+00:00", "Z")
    )


spaces = [
    {
        "id": str(uuid.uuid4()),
        "data": "original",
        "date": isoformat_js_like_date(datetime.now()),
        "state": "in-use",
    },
    {
        "id": str(uuid.uuid4()),
        "data": "original",
        "date": isoformat_js_like_date(datetime.now()),
        "state": "free",
    },
    {
        "id": str(uuid.uuid4()),
        "data": "original",
        "date": isoformat_js_like_date(datetime.now()),
        "state": "in-use",
    },
    {
        "id": str(uuid.uuid4()),
        "data": "original",
        "date": isoformat_js_like_date(datetime.now()),
        "state": "free",
    },
    {
        "id": str(uuid.uuid4()),
        "data": "original",
        "date": isoformat_js_like_date(datetime.now()),
        "state": "in-use",
    },
    {
        "id": str(uuid.uuid4()),
        "data": "original",
        "date": isoformat_js_like_date(datetime.now()),
        "state": "free",
    },
]

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


def get_memory_space(space_id: str) -> Optional[Dict[str, str]]:
    """
    get a space, or None
    """
    for _s in spaces:
        if _s["id"] == space_id:
            return _s
    return None


def get_data_attribute(attr: str) -> Optional[str]:
    """
    get an attribute from a request, or None
    :param: attribute to get
    :return: attribute from request, or None
    """
    # requst is the global flask request object
    data = request.data
    if len(data) > 0:
        obj = json.loads(data)
        if attr in obj.keys():
            return obj[attr]
    return None


def get_next_id() -> str:
    """
    get the next id for new spaces
    """
    return str(uuid.uuid4())


@app.route("/test", defaults={"identifier": None}, methods=["POST"])
@app.route("/test/<identifier>", methods=["POST"])
def test(identifier: str = None) -> Tuple[Response, int]:
    """
    test function for the API with explanation
    """
    if not request.is_json:
        return (
            jsonify({"msg": "Must use 'Content-type: application/json'"}),
            415,
        )

    response = {"yo": "this is lit"}
    status = 200

    if identifier is not None:
        response["identifier"] = identifier

    return jsonify(response), status


@app.route("/spaces", methods=["GET"])
def get_all_spaces() -> Tuple[Response, int]:
    """
    Get all the spaces
    """
    if not request.is_json:
        return (
            jsonify({"msg": "Must use 'Content-type: application/json'"}),
            415,
        )

    if len(spaces) == 0:
        return jsonify(result), 200

    place_filter = request.args.get("state")
    attrs = ()
    print(1, attrs)
    for k, v in request.args.items():
        if k == "state":
            continue

        tmp = v.split(sep=",")
        attrs = (*(a for a in tmp if a != ""),)
        if len(tmp) != len(attrs):
            return jsonify({"msg": "Invalid Empty Attribute"}), 400

        for a in attrs:
            if a not in ("id", "data", "date", "state"):
                return jsonify({"msg": "Invalid Attribute"}), 400

    no_filter = place_filter is None
    matches = lambda s: s["state"] == place_filter
    _result = (*(s for s in spaces if no_filter or matches(s)),)

    result = ()
    tmp = {}
    for s in _result:
        for a in attrs:
            tmp[a] = s[a]
        result = (*result, tmp)
        tmp = {}

    return jsonify(result), 200


@app.route("/spaces/<pag>", methods=["GET"])
def get_pag_spaces(pag) -> Tuple[Response, int]:
    """
    Get  spaces by pages
    """
    pag = int(pag)
    if not request.is_json:
        return (
            jsonify({"msg": "Must use 'Content-type: application/json'"}),
            415,
        )
    pagination = []
    for i in range(0, len(spaces), 4):
        pagination.append(spaces[i : i + 4])
    if len(pagination) <= pag:
        return (
            jsonify({"msg": "invalid page"}),
            400,
        )
    place_filter = request.args.get("state")

    if place_filter is None:
        return jsonify(pagination[pag]), 200

    result = [s for s in pagination[pag] if s["state"] == place_filter]

    return jsonify(result), 200


@app.route("/spaces/<space_id>", methods=["GET"])
def get_space(space_id) -> Tuple[Response, int]:
    """
    Get a specific space
    """
    if not request.is_json:
        return (
            jsonify({"msg": "Must use 'Content-type: application/json'"}),
            415,
        )

    space = get_memory_space(space_id)
    if space is None:
        return jsonify(msg="Space not found"), 404

    return jsonify(space), 200


@app.route("/spaces", methods=["POST"])
def create_space() -> Tuple[Response, int]:
    """
    crate a new space
    """
    if not request.is_json:
        return (
            jsonify({"msg": "Must use 'Content-type: application/json'"}),
            415,
        )

    place_data = get_data_attribute("data")

    if place_data is None:
        return jsonify(""), 400

    space = {
        "id": get_next_id(),
        "state": "free",
        "data": place_data,
        "date": isoformat_js_like_date(datetime.now()),
    }

    spaces.append(space)

    return jsonify(""), 201


@app.route("/spaces/<space_id>", methods=["PUT"])
def change_place(space_id) -> Tuple[Response, int]:
    """
    modify a specific space
    """
    if not request.is_json:
        return (
            jsonify({"msg": "Must use 'Content-type: application/json'"}),
            415,
        )

    new_data = get_data_attribute("data")

    space = get_memory_space(space_id)

    if space is None:
        return create_space()

    space["data"] = str(new_data)

    return jsonify(""), 200


@app.route("/spaces/<space_id>", methods=["DELETE"])
def delete_space(space_id) -> Tuple[Response, int]:
    """
    delete a space
    """
    space = get_memory_space(space_id)

    if space is None:
        return jsonify(""), 404

    spaces.remove(space)
    return jsonify(""), 200


@app.route("/reservations", methods=["GET"])
def get_all_reservations() -> Tuple[Response, int]:
    """
    get array with all vehicles
    """
    if not request.is_json:
        return (
            jsonify({"msg": "Must use 'Content-type: application/json'"}),
            415,
        )

    result = [s for s in spaces if s["state"] == "in-use"]
    return jsonify(result), 200


@app.route("/reservations/<pag>", methods=["GET"])
def get_pag_reservations(pag) -> Tuple[Response, int]:
    """
    get array with all vehicles
    """
    pag = int(pag)
    if not request.is_json:
        return (
            jsonify({"msg": "Must use 'Content-type: application/json'"}),
            415,
        )

    result = [s for s in spaces if s["state"] == "in-use"]
    pagination = []
    for i in range(0, len(result), 4):
        pagination.append(result[i : i + 4])
    if len(pagination) <= pag:
        return (
            jsonify({"msg": "invalid page"}),
            400,
        )
    return jsonify(pagination[pag]), 200


@app.route("/reservations", methods=["POST"])
def create_reservation() -> Tuple[Response, int]:
    """
    reserve a random free space
    """
    car_id = get_data_attribute("placa")
    for space in spaces:
        if space["state"] == "free":
            space["placa"] = car_id
            space["state"] = "in-use"
            space["date"] = isoformat_js_like_date(datetime.now())
            return jsonify({"msg": space}), 201
    return jsonify({"msg": "no free spaces available"}), 409


@app.route("/reservations/<space_id>", methods=["DELETE"])
def delete_reservation(space_id: str) -> Tuple[Response, int]:
    """
    free up a space that was reserved
    """
    space = get_memory_space(space_id)
    if space is None:
        return jsonify(""), 404
    return jsonify(""), 200


if __name__ == "__main__":
    app.run()
