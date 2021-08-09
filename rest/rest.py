"""
Basic WEB API
"""

import json
from typing import Dict, Optional
import uuid

from flask import (
    Flask,
    abort,
    jsonify,
    request,
)
from flask_cors import CORS  # type: ignore

spaces = [
    {"id": str(uuid.uuid4()), "state": "in-use"},
    {"id": str(uuid.uuid4()), "state": "free"},
    {"id": str(uuid.uuid4()), "state": "in-use"},
    {"id": str(uuid.uuid4()), "state": "free"},
    {"id": str(uuid.uuid4()), "state": "in-use"},
    {"id": str(uuid.uuid4()), "state": "free"},
]

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


def get_memory_space(space_id: int) -> Optional[Dict[str, str]]:
    """
    get a space, or None
    """
    for _s in spaces:
        if _s["id"] == space_id:
            return _s
    return None


def get_data_attribute(attribute: str) -> Optional[str]:
    """
    get an attribute from a request, or None
    :param: attribute to get
    :return: attribute from request, or None
    """
    # requst is the global flask request object
    data = request.data
    result = None
    if len(data) > 0:
        raw_json = json.loads(data)
        try:
            result = raw_json[attribute]
        except KeyError:
            pass
    return result


def get_next_id() -> str:
    """
    get the next id for new spaces
    """
    return str(uuid.uuid4())


# get array with all spaces
# opt-param: state -> ['free', 'in-use']
@app.route("/spaces", methods=["GET"])
def get_all_spaces():
    """
    Get all the spaces
    """
    if not request.is_json:
        return abort(415)

    place_filter = get_data_attribute("state")

    if place_filter is None:
        return jsonify(spaces)

    result = [s for s in spaces if s["state"] == place_filter]
    return jsonify(result)


# get specific space's info
@app.route("/spaces/<space_id>", methods=["GET"])
def get_space(space_id):
    """
    Get a specific space
    """
    if not request.is_json:
        return abort(415)

    space = get_memory_space(space_id)
    if space is None:
        return abort(404)

    return jsonify(space)


# # create a new space
@app.route("/spaces", methods=["POST"])
def create_space():
    """
    crate a new space
    """
    if not request.is_json:
        return abort(415)

    place_data = get_data_attribute("data")

    if place_data is None:
        return abort(400)

    space = {"id": get_next_id(), "state": "free", "data": place_data}

    spaces.append(space)

    return jsonify(success=True)


# update a space's info
@app.route("/spaces/<space_id>", methods=["PUT"])
def change_place(space_id):
    """
    modify a specific space
    """
    if not request.is_json:
        abort(415)

    new_data = get_data_attribute("data")

    space = get_memory_space(space_id)

    if space is None:
        return create_space()

    space["data"] = new_data

    return jsonify(success=True)


# delete a space
@app.route("/spaces/<space_id>", methods=["DELETE"])
def delete_space(space_id):
    """
    delete a space
    """
    space = get_memory_space(space_id)

    if space is None:
        return abort(404)

    spaces.remove(space)
    return jsonify(success=True)


# # get array with all vehicles
# # ({ 'placa': '[a-zA-Z0-9]', 'hora': '00:00:00 000', 'space': '<space_id>'})
# @app.route('/reservations', methods=['GET']):

# # reserve a random free space, return <space_id> and <reservation>,
# # receive 'placa'
# @app.route('/reservations', methods=['POST']):

# # delete a reservation, thus freeing a space, receives <reservation>
# @app.route('/reservations/<reservation>', methods=['DELETE']):

if __name__ == "__main__":
    # app.run(ssl_context='adhoc')
    app.run()
