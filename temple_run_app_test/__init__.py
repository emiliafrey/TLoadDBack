import json

from otree.api import *
from .series_data import series_data as sd
from pathlib import Path
import json

APP_DIR   = Path(__file__).resolve().parent
PROJ_DIR  = APP_DIR.parent
SETTINGS_FILE = PROJ_DIR / '_static' / 'configs' / 'test_settings.json'

with open(SETTINGS_FILE, encoding='utf-8') as f:
    test_settings = json.load(f)

doc = """
A test to see if playing Temple Run 2 could work well
"""


class C(BaseConstants):
    NAME_IN_URL = 'temple_run_app_test'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1
    STIMULUS_TIME_DURATION_PRETEST = 1.5


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    # --- Config fields (from YAML) ---
    subject_number = models.StringField()
    age = models.IntegerField()
    sex = models.StringField(choices=["male", "female"])
    condition = models.StringField(choices=["HCL", "LCL"])

    # --- Pretest Results ---
    pretest_hcl = models.FloatField()
    pretest_lcl = models.FloatField()

    # Performance log for export/debugging
    pretest_performance_json = models.LongStringField()
    pretest_training_log = models.LongStringField()


# PAGES

class Pretest(Page):
    def vars_for_template(self):
        return dict(
            series_data=json.dumps(sd),
            test_settings=json.dumps(test_settings),
        )

    def is_displayed(self):
        return True


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

page_sequence = [Pretest, TloadPage, TempleRunPage]
