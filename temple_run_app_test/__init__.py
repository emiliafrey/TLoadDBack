from otree.api import *


doc = """
A test to see if playing Temple Run 2 could work well
"""


class C(BaseConstants):
    NAME_IN_URL = 'temple_run_app_test'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    js_data = models.LongStringField()
    accuracy = models.FloatField()
    mean_rt = models.FloatField()


# PAGES

class TloadPage(Page):
    template_name = 'temple_run_app_test/TloadPage.html'
    live_method = 'store_data'

    @staticmethod
    def store_data(player, data):
        import json, statistics
        trials = [t for t in json.loads(data) if 'correct' in t]
        player.js_data = data
        if trials:
            player.accuracy = sum(t['correct'] for t in trials) / len(trials)
            rts = [t['rt'] for t in trials if t['rt']]
            if rts:
                player.mean_rt = statistics.mean(rts)

class TempleRunPage(Page):
    pass

page_sequence = [TloadPage, TempleRunPage]
