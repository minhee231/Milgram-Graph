from datetime import datetime, timedelta

def get_current_kst_time():
    now_time = datetime.now()
    now_time = now_time + timedelta(hours=9)
    now_time = now_time.date()
    return now_time

def get_1day_ago():
    now = get_current_kst_time()
    ago = now - timedelta(days=1)
    return ago

def get_7day_ago():
    now = get_current_kst_time()
    ago = now - timedelta(days=7)
    return ago

def get_1month_ago():
    now = get_current_kst_time()
    current_month = now.month

    previous_month = current_month - 1
    current_year = now.year
    current_day = now.day

    if previous_month == 0:
        previous_month = 12
        current_year -= 1

    previous_month_date = datetime(current_year, previous_month, current_day).date()

    return previous_month_date

def get_1year_ago():
    now = get_current_kst_time()
    current_year = now.year
    current_month = now.month
    current_day = now.day

    previous_year = current_year - 1

    previous_year_date = datetime(previous_year, current_month, current_day).date()

    return previous_year_date