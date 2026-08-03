def build_ai_email_html(
    recipient_name: str,
    subject: str,
    body: str,
) -> str:
    """
    Generate a professional HTML email using AI-generated content.
    """

    formatted_body = (
        body.strip()
            .replace("\n\n", "</p><p>")
            .replace("\n", "<br>")
    )

    return f"""
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>{subject}</title>
</head>

<body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="650"
style="
background:#1e1e1e;
color:white;
margin-top:30px;
border-radius:10px;
overflow:hidden;
">

<tr>
<td
style="
background:#2563eb;
padding:35px;
text-align:center;
font-size:34px;
font-weight:bold;
">

🤖 AI Generated Email

</td>
</tr>

<tr>
<td style="padding:40px;">

<h2>Hello {recipient_name},</h2>

<p style="font-size:18px;line-height:1.8;">
{formatted_body}
</p>

<br>

<a
href="#"
style="
background:#2563eb;
color:white;
padding:15px 28px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
display:inline-block;
">
Visit Event Portal
</a>

<br><br>

<hr style="border:none;border-top:1px solid #444;">

<p
style="
font-size:14px;
color:#bbbbbb;
text-align:center;
">

Event Management Platform

<br>

Powered by FastAPI + PostgreSQL + Ollama AI

</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>

</html>
"""