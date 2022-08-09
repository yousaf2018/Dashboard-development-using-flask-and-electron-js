from email.policy import default
from this import d
from tkinter.tix import Tree
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from matplotlib.pyplot import title
import datetime
from flask_marshmallow import Marshmallow

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/Dashboard'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

class Articles(db.Model):
        id = db.Column(db.Integer, primary_key = Tree)  
        title = db.Column(db.String(100))
        body = db.Column(db.Text())
        date = db.Column(db.DateTime, default = datetime.datetime.now)
        
        def __init__(self, title, body):
            self.title = title
            self.body = body

class ArticlesSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'body', 'date')
        
article_schema = ArticlesSchema()
articles_schema = ArticlesSchema(many=True)


@app.route('/get', methods = ['GET'])
def get_articles():
    all_articles = Articles.query.all()
    result = articles_schema.dump(all_articles)
    return jsonify(result)

@app.route('/get/<id>/', methods = ['GET'])
def post_details(id):
    article = Articles.query.get(id)
    result = article_schema.dump(article)
    return jsonify(result)

@app.route('/update/<id>/', methods = ['PUT'])
def update_details(id):
    article = Articles.query.get(id)
    title = request.json['title']
    body = request.json['body']
    article.title = title
    article.body = body
    db.session.commit()
    
    return article_schema.jsonify(article)

@app.route('/delete/<id>/', methods = ['DELETE'])
def delete_details(id):
    article = Articles.query.get(id)
    db.session.delete(article)
    db.session.commit()
    
    return article_schema.jsonify(article)


@app.route('/add', methods = ['POST'])
def add_articles():
    title = request.json['title']
    body = request.json['body']
    
    articles = Articles(title, body)
    db.session.add(articles)
    db.session.commit()
    
    return article_schema.jsonify(articles)
    

if __name__ == "__main__":
    app.run(debug=True)
    
#https://www.youtube.com/watch?v=povYTkpJiRA&t=2029s
    