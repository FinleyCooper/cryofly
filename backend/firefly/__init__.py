import requests
from bs4 import BeautifulSoup

periodTimings = {
    "09:05 - 09:55": 1,
    "09:20 - 10:10": 1,
    "09:55 - 10:47": 2,
    "10:10 - 11:02": 2,
    "11:12 - 12:00": 3,
    "11:27 - 12:17": 3,
    "12:00 - 12:52": 4,
    "13:37 - 14:25": 5,
    "12:57 - 13:45": 5,
    "14:25 - 15:17": 6,
    "13:45 - 14:37": 6
}


class InvalidSessionId(Exception):
    """Raised when the ASP.NET_SessionId does not relate to a Gordano Firefly account"""

    msg = "The session id provided does not relate to a Gordano Firefly account"
    pass


def extract_lesson_data(lesson):
    title = lesson["title"]
    period = periodTimings[title[:13]]
    subject = lesson.select(
        ".ff-timetable-lesson-subject")[0].string
    teacher = lesson.select(
        ".ff-timetavble-lesson-teacher")[0].string

    return {
        "period": period,
        "subject": subject,
        "teacher": teacher
    }


def get_lessons(sessionId):
    resp = requests.get(
        "https://gordano.fireflycloud.net/dashboard", cookies={
            "ASP.NET_SessionId": sessionId,
            "FireflyNETLoggedIn": "yes"
        })

    soup = BeautifulSoup(resp.text, 'html.parser')

    days = soup.select(".ff-timetable-day")

    if not days:
        raise InvalidSessionId()

    timetable = []

    for day in days:
        lessons = [extract_lesson_data(lesson) for lesson in day.select(
            '.ff-timetable-lesson-info')]
        timetabledPeriods = set(map(lambda x: x["period"], lessons))
        
        for i in range(1, 7):
            if i not in timetabledPeriods:
                lessons.append({
                    "period": i,
                    "subject": None,
                    "teacher": None
                })

        lessons.sort(key=lambda x: x["period"])
        timetable.append(lessons)
    return timetable
