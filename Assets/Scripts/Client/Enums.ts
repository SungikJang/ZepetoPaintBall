export enum LANGUAGES {
    Korean = 'Korean',
    English = 'English',
    Japanese = 'Japanese',
    Indonesian = 'Indonesian',
    Thai = 'Thai',
    Vietnamese = 'Vietnamese',
    Spanish = 'Spanish',
    French = 'French',
    Portuguese = 'Portuguese',
}

export enum POTION_TYPE {
    PLUS,
    MINUS
}

export enum GAME_NAME {
    POTION = 'Potion',
    Music = 'Music',
    ENGLISH = 'English'
}

export enum GAME_GRADE {
    A,
    B,
    C,
    D,
    E,
    F
}

export enum UI_NAME {
    POTION_GAME = 'PotionGameUI',
    ENGLISH_GAME = 'EnglishGameUI',
    GAME_INFO = 'GameInfoUI',
    GAME_ALERT = 'GameAlertUI',
    GAME_GRADE = 'GameGradeUI',
    GENERAL = 'GeneralUI',
    CLOCK = 'ClockUI',
    COUNTDOWN = 'CountDownUI'
}

export enum EVENT_NAME {
    ATTACH_OBJECT,
    DETACH_OBJECT,
    POTION_RESET,
    DESTROY,
    SET_SCORE,
    DOMAIN_OBJECT_DESTROY,
    MOVE_POTION,
    CHANGE_SCORE,
    ENGLISH_WORD_XorY,
    ENGLISH_WORD_PRESENT,
    ENGLISH_WORD_RESET,
    PLAYER_TELEPORT,
    PLAYER_FLY,
    SEND_PLAYER_FLYSTATE,
    SET_GAME_INFO,
    PLAYER_FLY_FORWARD,
    SET_GAME_ALERT,
    SET_GAME_GRADE,
    SET_GENERAL_UI,
    SET_CLOCK
}

export enum DOMAIN_OBJECT_ENUM {
    POTION = 'POTION',
    GAME_INFO = 'GAME_INFO',
    GAME_GRADE = 'GAME_GRADE',

}

export enum POTION_TEAM_NAME {
    TEAM1,
    TEAM2
}
