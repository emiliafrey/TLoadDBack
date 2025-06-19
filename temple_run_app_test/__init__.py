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
    pretest_hcl = models.FloatField(doc="The final HCL value in ms, determined by the pre-test staircase.")
    pretest_lcl = models.FloatField(doc="The final LCL value in ms (HCL * 1.5).")

    digit_training_data = models.LongStringField(blank=True)
    letter_training_data = models.LongStringField(blank=True)
    letter_digit_training_data = models.LongStringField(blank=True)
    pretest_data = models.LongStringField(blank=True)
    main_task_data = models.LongStringField(blank=True)

# PAGES

class Pretest(Page):
    form_model = 'player'
    form_fields = [
        'pretest_hcl',
        'pretest_lcl',
        'digit_training_data',
        'letter_training_data',
        'letter_digit_training_data',
        'pretest_data',
        # 'main_task_data',
    ]
    def vars_for_template(self):
        return dict(
            series_data=json.dumps(sd),
            test_settings=json.dumps(test_settings),
        )

class TempleRunPage(Page):
    pass

page_sequence = [Pretest, TempleRunPage]
