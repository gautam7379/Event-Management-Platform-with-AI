def registration_confirmation(
    user_name: str,
    event_name: str,
):
    subject = f"🎉 Registration Confirmed - {event_name}"

    body = f"""
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">

<style>

body {{
    background:#f4f4f4;
    font-family:Arial,Helvetica,sans-serif;
}}

.container {{
    max-width:700px;
    margin:auto;
    background:white;
    border-radius:10px;
    overflow:hidden;
}}

.header {{
    background:#2563eb;
    color:white;
    padding:30px;
    text-align:center;
}}

.content {{
    padding:35px;
}}

.card {{
    background:#f8fafc;
    padding:20px;
    border-left:5px solid #2563eb;
    margin:20px 0;
}}

.button {{
    display:inline-block;
    padding:12px 22px;
    background:#2563eb;
    color:white !important;
    text-decoration:none;
    border-radius:5px;
}}

.footer {{
    text-align:center;
    color:#666;
    padding:25px;
}}

</style>

</head>

<body>

<div class="container">

<div class="header">

<h1>🎉 Registration Confirmed</h1>

</div>

<div class="content">

<h2>Hello {user_name},</h2>

<p>

Your registration has been successfully confirmed.

</p>

<div class="card">

<h3>📅 Event</h3>

<b>{event_name}</b>

<br><br>

Status:
<b style="color:green;">
Confirmed
</b>

</div>

<p>

We look forward to welcoming you.

</p>

<a href="#" class="button">

View Event

</a>

</div>

<div class="footer">

Event Management Platform

</div>

</div>

</body>

</html>
"""

    return subject, body


def reminder_email(
    user_name: str,
    event_name: str,
    event_date: str,
    venue_name: str,
):
    subject = f"⏰ Reminder - {event_name}"

    body = f"""
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<style>

body {{
    background:#f5f5f5;
    font-family:Arial;
}}

.container {{
    max-width:700px;
    margin:auto;
    background:white;
    border-radius:10px;
    overflow:hidden;
}}

.header {{
    background:#f59e0b;
    color:white;
    text-align:center;
    padding:30px;
}}

.content {{
    padding:35px;
}}

.info {{
    background:#fff7ed;
    border-left:5px solid orange;
    padding:20px;
    margin:20px 0;
}}

.button {{
    display:inline-block;
    padding:12px 24px;
    background:#2563eb;
    color:white !important;
    text-decoration:none;
    border-radius:6px;
}}

.footer {{
    text-align:center;
    color:#777;
    padding:25px;
}}

</style>

</head>

<body>

<div class="container">

<div class="header">

<h1>⏰ Event Reminder</h1>

</div>

<div class="content">

<h2>Hello {user_name},</h2>

<p>

This is a friendly reminder about your upcoming event.

</p>

<div class="info">

<h3>{event_name}</h3>

<p>

📅 Date:
<b>{event_date}</b>

</p>

<p>

📍 Venue:
<b>{venue_name}</b>

</p>

</div>

<p>

We look forward to seeing you!

</p>

<a href="#" class="button">

View Event

</a>

</div>

<div class="footer">

Event Management Platform

</div>

</div>

</body>

</html>
"""

    return subject, body