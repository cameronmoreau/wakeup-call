# wakeup-call

## Required config

```
APP_AWS_ACCESS_KEY_ID
APP_AWS_SECRET_ACCESS_KEY

DYNAMO_DB_TABLE

TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
```

## API Calls

```
# Register Alarms
curl http://localhost:3000/api/register-alarm?phone=%2B19722222222&hour=10&minute=0

# List Alarms
curl http://localhost:3000/api/list-alarms?phone=%2B19722222222

# Cancel Alarms
curl http://localhost:3000/api/cancel-alarms?phone=%2B19722222222

# Trigger Alarms Job
curl http://localhost:3000/api/trigger-alarms
```
