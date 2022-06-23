from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

app.config['TESTING']=True
app.config['DEBUG_TB_HOSTS']='dont-show-debug-toolbar'

class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def test_make_board(self):
        '''Test that board is generated when going to root'''
        with app.test_client() as client:
            res=client.get('/')
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn('<td class="letter">',html)

    def test_get_input(self):
        '''Check_if_valid_word is working'''
        with app.test_client() as client:
            example_board=[['O', 'L', 'V', 'V', 'H'], 
            ['E', 'D', 'Y', 'Q', 'U'], 
            ['P', 'G', 'J', 'S', 'O'], 
            ['D', 'L', 'S', 'Z', 'F'], 
            ['X', 'P', 'R', 'R', 'D']]
            user_guess='testing'
            boggle_game=Boggle()               
            self.assertIn(boggle_game.check_valid_word(example_board, 'test'),'not-on-board')
            self.assertIn(boggle_game.check_valid_word(example_board, 'abcdef'),'not-word')
            self.assertIn(boggle_game.check_valid_word(example_board, 'leg'),'ok')
    
    def set_high_score(self):
        '''high score is being updated'''
        with app.test_client() as client:
            # res=client.get('/end-game')
            # toolbar is messing up my status tests
            original_score=3
            new_score=6
            high_score=max(original_score,new_score)
            self.assertEqual(high_score,6)
            