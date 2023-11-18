import requests
r = requests.post('http://127.0.0.1:5000/transactions', json={"budgetbook_id": 1, "category": "drugs", "amount": 100.00, "comment": "cocaina", "account_id": 1})
print(r.status_code)