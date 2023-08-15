import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import NetworkBase from './NetworkBase';
import {Color, GameObject, LayerMask, Vector3, WaitForSeconds} from 'UnityEngine';
import MultiplayManager from './MultiplayManager';
import {Action$1} from 'System';
import Manager from '../Manager/Manager';
import {GAME_NAME} from '../Enums';
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import OtherZepetoCharacterController from '../Controller/OtherZepetoCharacterController';
import MyPlayerController from '../MyPlayerController/MyPlayerController';
import FlagGameController from '../Controller/GameController/FlagGameController';
import SiegeGameController from '../Controller/GameController/SiegeGameController';
import Utils from '../Utils/index';
import {Image} from 'UnityEngine.UI';
import SoloFlagGameController from '../Controller/GameController/SoloFlagGameController';

export default class Connector extends NetworkBase {
  private static _instance: Connector;

  public static get Instance(): Connector {
    if (!Connector._instance) {
      const go = GameObject.Find('Connector');
      Connector._instance = go.GetComponent<Connector>();
    }
    return Connector._instance;
  }

  private init: boolean = false;

  public ManualSyncResHandlerFunc(room): void {
    room.AddMessageHandler('GameStartBtnRes', (data: {isAdmin: boolean}) => {
      if (data.isAdmin) {
        Manager.UI.ShowPopUpUI('GameSelectPopUpUI');
      } else {
        Manager.UI.ShowPopUpUI('NotGameRunningUI');
      }
    });

    room.AddMessageHandler('OpenGameRes', (data: {sessionId: string; gameName: string}) => {
      Manager.Game.NowOnGame = data.gameName;
      if (Manager.Game.NowOnGame.includes('Solo')) {
        Manager.Game.JoinGame();
      } else {
        Manager.Game.JoinGame('A');
      }
    });

    room.AddMessageHandler('NowGameRes', (data: {gameName: string}) => {
      Manager.Game.NowOnGame = data.gameName;
    });

    room.AddMessageHandler(
      'GameJoinRes',
      (data: {player: string; teamA: string[]; teamB: string[]; team?: string}) => {
        if (data.player === MyPlayerController.Data.MySessionId) {
          if (data.team === 'Solo') {
            for (let i = 0; i < data.teamA.length; i++) {
              if (data.teamA[i] !== MyPlayerController.Data.MySessionId) {
                Utils.ChangeLayer(
                  ZepetoPlayers.instance.GetPlayer(data.teamA[i]).character.gameObject,
                  'inGamePlayer',
                );
                //Utils.ChangeLayer(ZepetoPlayers.instance.GetPlayer(data.teamA[i]).character.gameObject.GetComponent<OtherZepetoCharacterController>().nowWeapon, "inGamePlayer")
                ZepetoPlayers.instance
                  .GetPlayer(data.teamA[i])
                  .character.gameObject.GetComponent<OtherZepetoCharacterController>().Team =
                  'Solo';
              }
            }
            Manager.Game.JoinGame();
          } else {
            for (let i = 0; i < data.teamA.length; i++) {
              if (data.teamA[i] !== MyPlayerController.Data.MySessionId) {
                Utils.ChangeLayer(
                  ZepetoPlayers.instance.GetPlayer(data.teamA[i]).character.gameObject,
                  'inGamePlayer',
                );
                //Utils.ChangeLayer(ZepetoPlayers.instance.GetPlayer(data.teamA[i]).character.gameObject.GetComponent<OtherZepetoCharacterController>().nowWeapon, "inGamePlayer")
                ZepetoPlayers.instance
                  .GetPlayer(data.teamA[i])
                  .character.gameObject.GetComponent<OtherZepetoCharacterController>().Team = 'A';
              }
            }
            for (let i = 0; i < data.teamB.length; i++) {
              if (data.teamB[i] !== MyPlayerController.Data.MySessionId) {
                Utils.ChangeLayer(
                  ZepetoPlayers.instance.GetPlayer(data.teamB[i]).character.gameObject,
                  'inGamePlayer',
                );
                //Utils.ChangeLayer(ZepetoPlayers.instance.GetPlayer(data.teamB[i]).character.gameObject.GetComponent<OtherZepetoCharacterController>().nowWeapon, "inGamePlayer")
                ZepetoPlayers.instance
                  .GetPlayer(data.teamB[i])
                  .character.gameObject.GetComponent<OtherZepetoCharacterController>().Team = 'B';
              }
            }
            Manager.Game.JoinGame(data.team);
          }
        } else {
          if (Manager.Game.IsGamePlaying) {
            Utils.ChangeLayer(
              ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject,
              'inGamePlayer',
            );
            //Utils.ChangeLayer(ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.GetComponent<OtherZepetoCharacterController>().nowWeapon, "inGamePlayer")
            let ozc = ZepetoPlayers.instance
              .GetPlayer(data.player)
              .character.gameObject.GetComponent<OtherZepetoCharacterController>();
            ozc.team = data.team;
            ozc.Mark = Manager.Resource.Instantiate('Prefabs\\Mark');
            if (data.team === MyPlayerController.Data.Team) {
              Manager.UI.ShowPopUpUI('JoinTeamAlertUI');
            } else {
              Manager.UI.ShowPopUpUI('JoinEnemyAlertUI');
            }
          }
        }
      },
    );

    room.AddMessageHandler('LeaveGameRes', (data: {player: string}) => {
      Manager.Game.LeaveGame(data.player);
    });

    room.AddMessageHandler('GameTime', (data: {time: number}) => {
      Manager.Game.GameTime = data.time;
    });

    room.AddMessageHandler('VoteTime', (data: {time: number}) => {
      Manager.Game.VoteTime = data.time;
    });

    room.AddMessageHandler('EndGame', (data: {winningTeam: string}) => {
      Manager.Game.EndGame(data.winningTeam);
    });

    room.AddMessageHandler('AdminChanged', (data: {player: string}) => {
      Manager.UI.ShowPopUpUI('AdminChangedUI');
    });

    room.AddMessageHandler('WaitForNextGame', (data: {player: string}) => {
      Manager.UI.ShowPopUpUI('WaitForNextGameUI');
    });

    room.AddMessageHandler('UrgeGameStart', (data: {player: string}) => {
      Manager.UI.ShowPopUpUI('UrgeGameStartPopUpUI');
    });

    room.AddMessageHandler('SpineAngleRes', (data: {player: string; spineAngle: float}) => {
      if (data.player === MyPlayerController.Data.MySessionId) {
        MyPlayerController.Movement.SetSpineAngle(data.spineAngle);
      } else {
        ZepetoPlayers.instance
          .GetPlayer(data.player)
          .character.ZepetoAnimator.SetFloat('SpineAngle', data.spineAngle);
      }
    });

    room.AddMessageHandler('PlayerHitRes', (data: {player: string}) => {
      Manager.Game.GetHit(data.player);
      if (data.player === MyPlayerController.Data.MySessionId) {
        Manager.UI.CloseDefaultUI('InGameUI');
        Manager.UI.ShowDefaultUI('RespawnUI');
      } else {
        ZepetoPlayers.instance
          .GetPlayer(data.player)
          .character.gameObject.GetComponent<OtherZepetoCharacterController>()
          .OnHitEffect();
      }
    });

    room.AddMessageHandler('RespawnRes', (data: {player: string; team: string}) => {
      if (data.player === MyPlayerController.Data.MySessionId) {
        Utils.ChangeLayer(MyPlayerController.Data.MyPlayer.character.gameObject, 'myPlayer');
        Utils.ChangeLayer(MyPlayerController.Data.NowWeapon, 'myPlayer');
        Manager.Game.Respawn(data.team);
      } else {
        if (Manager.Game.IsGamePlaying) {
          ZepetoPlayers.instance
            .GetPlayer(data.player)
            .character.gameObject.GetComponent<OtherZepetoCharacterController>()
            .StartShieldEffect();
          Utils.ChangeLayer(
            ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject,
            'inGamePlayer',
          );
          Utils.ChangeLayer(
            ZepetoPlayers.instance
              .GetPlayer(data.player)
              .character.gameObject.GetComponent<OtherZepetoCharacterController>().nowWeapon,
            'inGamePlayer',
          );
        }
      }
    });

    room.AddMessageHandler('EqiupGunRes', (data: {player: string; name: string}) => {
      if (data.player !== MyPlayerController.Data.MySessionId) {
        this.StartCoroutine(this.FindPlayer(data.player, data.name));
        //ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.GetComponent<OtherZepetoCharacterController>().EqiupGun(data.name)
        // Manager.Game.OtherPlayerWeaponInfo.set(data.player, data.name);
        // let c = ZepetoPlayers.instance.GetPlayer(data.player).character
      }
    });

    room.AddMessageHandler('SiegeRes', (data: {player: string; team: string}) => {
      SiegeGameController.Instance.Siege(data.team);
    });

    room.AddMessageHandler('GetFlagRes', (data: {player: string; team: string}) => {
      switch (Manager.Game.NowOnGame) {
        case GAME_NAME.Flag:
          FlagGameController.Instance.GetFlag(data.team, data.player);
          if (data.team === 'A') {
            Manager.UI.InGameUI.BTeamFlag.SetActive(false);
            Manager.UI.InGameUI.ATeamFlag.SetActive(true);
          } else {
            Manager.UI.InGameUI.ATeamFlag.SetActive(false);
            Manager.UI.InGameUI.BTeamFlag.SetActive(true);
          }
          break;
        case GAME_NAME.SoloFlag:
          SoloFlagGameController.Instance.GetFlag(data.team, data.player);
          break;
      }
    });

    room.AddMessageHandler('FlaggerRes', (data: {team: string; flagger: string}) => {
      if (data.flagger !== '') {
        switch (Manager.Game.NowOnGame) {
          case GAME_NAME.Flag:
            FlagGameController.Instance.GetFlag(data.team, data.flagger);
            break;
          case GAME_NAME.SoloFlag:
            SoloFlagGameController.Instance.GetFlag(data.team, data.flagger);
            break;
        }
      }
    });

    room.AddMessageHandler('SiegeTeamRes', (data: {team: string}) => {
      console.log(data.team);
      if (data.team === 'A') {
        Manager.UI.InGameUI.BteamSiege.SetActive(false);
        Manager.UI.InGameUI.AteamSiege.SetActive(true);
        if (data.team === MyPlayerController.Data.Team) {
          Manager.UI.InGameUI.AteamSiege.GetComponent<Image>().color = new Color(0, 255, 0, 255);
        } else {
          Manager.UI.InGameUI.AteamSiege.GetComponent<Image>().color = new Color(255, 0, 0, 255);
        }
      } else if (data.team === 'B') {
        Manager.UI.InGameUI.AteamSiege.SetActive(false);
        Manager.UI.InGameUI.BteamSiege.SetActive(true);
        if (data.team === MyPlayerController.Data.Team) {
          Manager.UI.InGameUI.BteamSiege.GetComponent<Image>().color = new Color(0, 255, 0, 255);
        } else {
          Manager.UI.InGameUI.BteamSiege.GetComponent<Image>().color = new Color(255, 0, 0, 255);
        }
      }
    });

    room.AddMessageHandler(
      'StartInfoRes',
      (data: {lastEquipWeapon: string; playerWeapon: string[]}) => {
        Manager.Product.ProductSyncinstance.StartRefreshBalance();
        Manager.Product.ProductSyncinstance.StartRefreshInventory();
        MyPlayerController.Data.EqiupGun(data.lastEquipWeapon);
        for (let i = 0; i < data.playerWeapon.length; i++) {
          let s: string[] = data.playerWeapon[i].split(' ');
          this.StartCoroutine(this.FindPlayer(s[0], s[1]));
          //ZepetoPlayers.instance.GetPlayer(s[0]).character.gameObject.GetComponent<OtherZepetoCharacterController>().EqiupGun(s[1])
        }
      },
    );

    room.AddMessageHandler('SyncBalances', (data: {players: string}) => {
      Manager.Product.ProductSyncinstance.StartRefreshBalance();
    });

    room.AddMessageHandler('VoteEnd', (data: {voters: string[]}) => {
      if (data.voters.includes(MyPlayerController.Data.MySessionId)) {
        Manager.Game.GameReady();
      }
    });

    room.AddMessageHandler('Vote', (data: {player: string; userId: string; gameName: string}) => {
      Manager.UI.GameVoteUI.CreatUserImage(data.player, data.userId, data.gameName);
    });

    room.AddMessageHandler('EjectRes', (data: {player: string; dir: string}) => {
      let dir: Vector3;
      let s = data.dir.split(' ');
      dir = new Vector3(Number(s[0]), Number(s[1]), Number(s[2]));
      if (data.player === MyPlayerController.Data.MySessionId) {
        MyPlayerController.Movement.GunController.Fire(dir);
      } else {
        ZepetoPlayers.instance
          .GetPlayer(data.player)
          .character.gameObject.GetComponent<OtherZepetoCharacterController>()
          .Fire(dir);
      }
    });
  }

  Start() {
    try {
      if (!MultiplayManager.instance) {
        //console.log('아직 오토어쩌고 인스턴스가 없음');
        return;
      } else {
        const room = MultiplayManager.instance.room;
        if (room) {
          if (room.IsConnected) {
            this._room = room;
            this.ManualSyncResHandlerFunc(room);
            this.GetServerTimeDifference();

            this.init = true;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  Update() {
    try {
      if (!this.init) {
        if (!MultiplayManager.instance) {
          //console.log('아직 오토어쩌고 인스턴스가 없음');
          return;
        } else {
          const room = MultiplayManager.instance.room;
          if (room) {
            if (room.IsConnected) {
              this._room = room;
              this.ManualSyncResHandlerFunc(room);
              this.GetServerTimeDifference();

              this.init = true;
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  *FindPlayer(sessionId: string, name: string) {
    while (true) {
      if (GameObject.Find(sessionId)) {
        GameObject.Find(sessionId).GetComponent<OtherZepetoCharacterController>().EqiupGun(name);
        return;
      }
      yield new WaitForSeconds(0.1);
    }
  }
}
