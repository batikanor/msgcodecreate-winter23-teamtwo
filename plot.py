import plotly.express as px
import pandas as pd
import plotly.io as pio
import os

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
    # Convert the figure to JSON
    graphJSON = pio.to_json(fig)


    return graphJSON


def plot_pie_chart_for_budgetbook_by_category2(budgetbook_id:int, plot_path:str)-> bool:
    
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

    if not os.path.exists(plot_path):
        os.mkdir(plot_path)

    fig.write_image(os.path.join(plot_path, str(budgetbook_id) + ".svg"))

    return True

# was_plotted = plot_pie_chart_for_budgetbook_by_category(budgetbook.id, os.path.join("plots","pie_charts"))