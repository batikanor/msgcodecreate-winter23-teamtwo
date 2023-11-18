import plotly.express as px
import pandas as pd

from models import Budgetbook, db

def plot_pie_chart_for_budgetbook_by_category(budgetbook_id, user_id):
    
    budget_books = db.session.query(Budgetbook).filter(Budgetbook.user_id ==user_id).\
                     filter(Budgetbook.id == budgetbook_id).all()
    budget_book = budget_books[0]
    
    df = pd.DataFrame.from_records(budget_book.transactions
    , index='id'
    , columns=['id','amount', 'category', 'comment', 'time_of_transaction', 'account_id', 'budgetbook_id'])
    print(df)

    fig = px.pie(df, values='amount', names='category')
    return fig.to_html()