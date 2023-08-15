import {GameObject, LayerMask, Transform, Vector3} from 'UnityEngine';
import GunController from '../Controller/GunController';
import {GAME_NAME} from '../Enums';
import Connector from '../Network/Connector';
import Manager from './Manager';
import ControllerUI from '../UI/ControllerUI/ControllerUI';
import {ProductRecord} from 'ZEPETO.Product';
import MyPlayerController from '../MyPlayerController/MyPlayerController';
import FlagGameController from '../Controller/GameController/FlagGameController';
import {ZepetoPlayer, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import SiegeGameController from '../Controller/GameController/SiegeGameController';
import SoloFlagGameController from '../Controller/GameController/SoloFlagGameController';
import Utils from '../Utils/index';
import OtherZepetoCharacterController from '../Controller/OtherZepetoCharacterController';

export default class GameManager {
  nowOnGame: string = '';
  private isGamePlaying: boolean = false;
  gameTime: number = 0;
  voteTime: number = 0;

  homePoint: Transform;

  private gunController: GunController;

  private controllerUI: ControllerUI;

  private players: Map<string, ZepetoPlayer> = new Map<string, ZepetoPlayer>();

  // private otherPlayers: string[] = [];
  //
  // private otherInGamePlayers: string[] = [];

  Init() {}

  get IsGamePlaying() {
    return this.isGamePlaying;
  }

  set IsGamePlaying(value: boolean) {
    this.isGamePlaying = value;
  }

  get Players() {
    return this.players;
  }

  set Players(value: Map<string, ZepetoPlayer>) {
    this.players = value;
  }

  get NowOnGame() {
    return this.nowOnGame;
  }

  set NowOnGame(value: string) {
    this.nowOnGame = value;
  }

  get GameTime() {
    return this.gameTime;
  }

  set GameTime(value: number) {
    this.gameTime = value;
  }

  get VoteTime() {
    return this.voteTime;
  }

  set VoteTime(value: number) {
    this.voteTime = value;
  }

  get HomePoint() {
    return this.homePoint;
  }

  set HomePoint(value: Transform) {
    this.homePoint = value;
  }
  //
  // get OtherInGamePlayers()
  // {
  //     return this.otherInGamePlayers
  // }
  //
  // set OtherInGamePlayers(value: string[])
  // {
  //     this.otherInGamePlayers = value
  // }

  JoinGame(team?: string) {
    switch (this.nowOnGame) {
      case GAME_NAME.Flag:
        FlagGameController.Instance.JoinGame(team);
        break;
      case GAME_NAME.Siege:
        SiegeGameController.Instance.JoinGame(team);
        break;
      case GAME_NAME.SoloFlag:
        SoloFlagGameController.Instance.JoinGame();
        break;
    }
  }

  LeaveGame(sessionId: string) {
    const r = GameObject.Find('ReloadUI');
    if (r) {
      Manager.UI.ClosePopUpUI('ReloadUI');
    }
    switch (this.nowOnGame) {
      case GAME_NAME.Flag:
        FlagGameController.Instance.LeaveGame(sessionId);
        break;
      case GAME_NAME.Siege:
        SiegeGameController.Instance.LeaveGame(sessionId);
        break;
      case GAME_NAME.SoloFlag:
        SoloFlagGameController.Instance.LeaveGame(sessionId);
        break;
    }
    this.GunController.ZoomOff();
  }

  EndGame(winningTeam: string) {
    const r = GameObject.Find('ReloadUI');
    if (r) {
      Manager.UI.ClosePopUpUI('ReloadUI');
    }
    if (winningTeam === MyPlayerController.Data.Team) {
      Manager.UI.ShowPopUpUI('WinUI');
    } else {
      Manager.UI.ShowPopUpUI('LoseUI');
    }
    Manager.UI.ShowDefaultUI('GameVoteUI');
    switch (this.nowOnGame) {
      case GAME_NAME.Flag:
        FlagGameController.Instance.EndGame(winningTeam);
        break;
      case GAME_NAME.Siege:
        SiegeGameController.Instance.EndGame(winningTeam);
        break;
      case GAME_NAME.SoloFlag:
        SoloFlagGameController.Instance.EndGame(winningTeam);
        break;
    }
    this.GunController.ZoomOff();
  }

  GetHit(sessionId: string) {
    switch (this.nowOnGame) {
      case GAME_NAME.Flag:
        FlagGameController.Instance.GetHit(
          ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject,
        );
        break;
      case GAME_NAME.Siege:
        SiegeGameController.Instance.GetHit(
          ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject,
        );
        break;
      case GAME_NAME.SoloFlag:
        SoloFlagGameController.Instance.GetHit(
          ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject,
        );
        break;
    }
  }

  Respawn(team: string) {
    switch (this.nowOnGame) {
      case GAME_NAME.Flag:
        FlagGameController.Instance.PlayerRespawn(team);
        break;
      case GAME_NAME.Siege:
        SiegeGameController.Instance.PlayerRespawn(team);
        break;
      case GAME_NAME.SoloFlag:
        SoloFlagGameController.Instance.PlayerRespawn();
        break;
    }
  }

  GameReady() {
    Manager.UI.DeleteDefaultUI('GameVoteUI');
    Manager.UI.ShowDefaultUI('StartUI');
    Manager.UI.ShowPopUpUI('GameReadyUI');
  }

  get GunController() {
    return this.gunController;
  }

  set GunController(value: GunController) {
    this.gunController = value;
  }

  get ControllerUI() {
    return this.controllerUI;
  }

  set ControllerUI(value: ControllerUI) {
    this.controllerUI = value;
  }
}
