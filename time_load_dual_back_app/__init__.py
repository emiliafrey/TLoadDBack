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


class C(BaseConstants):
    NAME_IN_URL = 'time_load_dual_back_app'
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
    main_task_1_1_data = models.LongStringField(blank=True)
    main_task_1_2_data = models.LongStringField(blank=True)
    main_task_2_1_data = models.LongStringField(blank=True)
    main_task_2_2_data = models.LongStringField(blank=True)

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
    ]
    def vars_for_template(self):
        return dict(
            series_data=json.dumps(sd),
            test_settings=json.dumps(test_settings),
        )

class TrainingAndPretest(Page):
    form_model = 'player'
    form_fields = [
        'pretest_hcl',
        'pretest_lcl',
        'digit_training_data',
        'letter_training_data',
        'letter_digit_training_data',
        'pretest_data',
    ]
    @staticmethod
    def vars_for_template(self):
        return dict(
            series_data=json.dumps(sd),
            test_settings=json.dumps(test_settings),
        )
class PreBreakMainTask1(Page):
    form_model = 'player'
    form_fields = ['main_task_1_1_data']

    @staticmethod
    def vars_for_template(player: Player):
        main_task_stimulus_time = player.pretest_hcl
        return dict(
            series_data=json.dumps(sd),
            test_settings=json.dumps(test_settings),
            stimulus_time=main_task_stimulus_time
        )

class PreBreakMainTask2(Page):
    form_model = 'player'
    form_fields = ['main_task_1_2_data']

    @staticmethod
    def vars_for_template(player: Player):
        main_task_stimulus_time = player.pretest_hcl
        return dict(
            series_data=json.dumps(sd),
            test_settings=json.dumps(test_settings),
            stimulus_time=main_task_stimulus_time
        )

class CasualVideoGame(Page):
    pass

class PostBreakTransition(Page):

    @staticmethod
    def vars_for_template(self):
        return dict(
            series_data=json.dumps(sd),
            test_settings=json.dumps(test_settings)
        )

class PostBreakMainTask1(Page):
    form_model = 'player'
    form_fields = ['main_task_2_1_data']

    @staticmethod
    def vars_for_template(player: Player):
        main_task_stimulus_time = player.pretest_hcl
        return dict(
            series_data=json.dumps(sd),
            test_settings=json.dumps(test_settings),
            stimulus_time=main_task_stimulus_time
        )

class PostBreakMainTask2(Page):
    form_model = 'player'
    form_fields = ['main_task_2_2_data']

    @staticmethod
    def vars_for_template(player: Player):
        main_task_stimulus_time = player.pretest_hcl
        return dict(
            series_data=json.dumps(sd),
            test_settings=json.dumps(test_settings),
            stimulus_time=main_task_stimulus_time
        )

page_sequence = [TrainingAndPretest, PreBreakMainTask1, PreBreakMainTask2, CasualVideoGame, PostBreakTransition, PostBreakMainTask1, PostBreakMainTask2]
