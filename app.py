from boggle import Boggle
from flask import Flask, jsonify, request, render_template, redirect, session, flash
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY']="boggle"
app.debug=True
 
toolbar= DebugToolbarExtension(app)


boggle_game = Boggle()



@app.route('/')
def start():
    '''Show start button'''
    
    board = boggle_game.make_board()    
    session['board']=board   
    print(board)
    return render_template('index.html',board=board)

@app.route('/check-word', methods=["POST"])
def check_if_valid_word():    
    '''Check is guess word is valis using check_valid_word'''    
    user_guess=request.form['guess']       
    board=session['board']
    status=boggle_game.check_valid_word(board,user_guess)
    result=jsonify({'result':status})   
    return result

@app.route('/end-game', methods=["POST"])
def post_score():
    '''Store score and number of times player has played'''
  
    score=request.json["score"]
    high_score=session.get('high_score',0)   
    games_played=session.get("games_played",0)    
    session['games_played'] = games_played+1
    session['high_score']=max(score,high_score)  
    return jsonify(brokeRecord=score>high_score)
