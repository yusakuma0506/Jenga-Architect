import pandas as pd
from datetime import datetime

df = pd.read_csv('prisma/seed_data.csv')
now = datetime.now().isoformat()

quizzes = df.drop(columns=['physicalId', 'category'])
quizzes['createdAt'] = now
quizzes['updatedAt'] = now

def to_pg_array(val):
    if isinstance(val, str):
        return val.replace('[', '{').replace(']', '}')
    return val

quizzes['options'] = quizzes['options'].apply(to_pg_array)
quizzes['answer'] = quizzes['answer'].apply(to_pg_array)

column_order = ['id', 'question', 'options', 'answer', 'level', 'subIndex', 'isPremium', 'blockId', 'createdAt', 'updatedAt']
quizzes = quizzes[column_order]

quizzes.to_csv('prisma/quizzes_clean.csv', index=False)