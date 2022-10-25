from models import db, FireflyData
from time import sleep
import json
from firefly import get_lessons, InvalidSessionId


def refresh_firefly_data(uuid):
    print(f"Refreshing firefly data for user {uuid}")
    
    firefly_data = FireflyData.query.filter_by(id=uuid).first()

    if firefly_data is None or firefly_data.firefly_session_id is None:
        return

    try:
        new_data = json.dumps(get_lessons(firefly_data.firefly_session_id), separators=(",", ":"))
        firefly_data.timetable_json = new_data
    except InvalidSessionId:
        firefly_data.firefly_session_id = None
    finally:
        db.session.commit()
    

def refresh_all_firefly_data(seconds_between_request=20):
    firefly_users = FireflyData.query.all()
    
    print(f"Refreshing all firefly data...\nEstimated time is {(seconds_between_request+8)*len(firefly_users)} seconds.")

    for firefly_data in firefly_users:
        refresh_firefly_data(firefly_data.id)
        sleep(seconds_between_request)