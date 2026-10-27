# Изпраща писмата от търсенето на цитирания (scan-mails.json от scripts/scan-citations.mjs): всяко писмо — до своите
# получатели със своя HTML файл (ръководителят — целият резултат, потребителят — само своята част).
# Пощата — тайните MAIL_SERVER, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM (порт 465 — SSL, иначе STARTTLS).
# Адресите не се печатат (публичен дневник); печата се само броят на изпратените писма.
import json, os, smtplib, ssl, sys
from email.message import EmailMessage

mails = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'scan-mails.json', encoding='utf-8'))
if not mails:
    print('Няма писма за изпращане.'); sys.exit(0)
host, port = os.environ['MAIL_SERVER'], int(os.environ.get('MAIL_PORT') or 465)
user, pwd, frm = os.environ.get('MAIL_USERNAME', ''), os.environ.get('MAIL_PASSWORD', ''), os.environ['MAIL_FROM']
ctx = ssl.create_default_context()
smtp = smtplib.SMTP_SSL(host, port, context=ctx, timeout=60) if port == 465 else smtplib.SMTP(host, port, timeout=60)
if port != 465:
    smtp.starttls(context=ctx)
if user:
    smtp.login(user, pwd)
sent = failed = 0
for m in mails:
    try:
        msg = EmailMessage()
        msg['From'], msg['To'], msg['Subject'] = frm, ', '.join(m['to']), m['subject']
        msg.set_content('Писмото е в HTML формат.')
        msg.add_alternative(open(m['file'], encoding='utf-8').read(), subtype='html')
        smtp.send_message(msg); sent += 1
    except Exception as e:
        failed += 1; print(f'Неуспешно писмо ({type(e).__name__})', file=sys.stderr)
smtp.quit()
print(f'Изпратени писма: {sent}; неуспешни: {failed}')
sys.exit(1 if failed and not sent else 0)
