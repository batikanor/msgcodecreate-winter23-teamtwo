import plotly.express as px
import pandas as pd

from models import Transaction, Budgetbook, db

def plot_pie_chart_for_budgetbook_by_category(budgetbook_id, user_id):
    
    transactions = db.session.query(Transaction).filter(Transaction.budgetbook_id == budgetbook_id).all()
    transactions_list = []
    transaction_dict = {}
    for t in transactions:
        transaction_dict["id"] = t.id
        transaction_dict["amount"] = abs(t.amount)
        transaction_dict["category"] = t.category
        transaction_dict["comment"] = t.comment
        transaction_dict["account_id"] = t.account_id
        transaction_dict["time_of_transaction"] = t.time_of_transaction
        transaction_dict["budgetbook_id"] = t.budgetbook_id

        transactions_list.append(transaction_dict.copy())

    df = pd.DataFrame.from_records(transactions_list, index='id',
                                    columns=['id','amount', 'category', 'comment', 'time_of_transaction', 'account_id', 'budgetbook_id'])
    fig = px.pie(df, values='amount', names='category', title="Amount spent by category")

    return fig.to_html()