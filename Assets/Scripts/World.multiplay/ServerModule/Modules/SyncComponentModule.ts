import {SandboxPlayer} from 'ZEPETO.Multiplay';
import {IModule} from '../IModule';
import {
  sVector3,
  sQuaternion,
  SyncTransform,
  PlayerAdditionalValue,
  ZepetoAnimationParam,
} from 'ZEPETO.Multiplay.Schema';
import GameManager from '../GameManager';
import {loadInventory} from 'ZEPETO.Multiplay.Inventory';
import {loadCurrency} from 'ZEPETO.Multiplay.Currency';
import {DataStorage} from 'ZEPETO.Multiplay.DataStorage';
import GameVoteTimer from '../GameVoteTimer';

export default class SyncComponentModule extends IModule {
  private sessionIdQueue: string[] = [];
  private instantiateObjCaches: InstantiateObj[] = [];
  private masterClient: Function = (): SandboxPlayer | undefined =>
    this.server.loadPlayer(this.sessionIdQueue[0]);

  private adminPlayer: SandboxPlayer;

  private isGameRunning: boolean = false;
  private nowGame: GameManager;
  private gameVote: GameVoteTimer;

  private playerWeaponInfo: Map<string, string> = new Map<string, string>();

  private HittedPlayer: string[] = [];

  private Flagger: string = '';

  private masterUserId: string[] = [
    '61debc5431d8fea619bd754d',
    '6245a0408d897e6443382c86',
    '62453a6d8d897e6443000928',
  ];

  async OnCreate() {
    this.ForBasic();
    this.ForCustomize();
    this.ForProduct();
  }

  async OnJoin(client: SandboxPlayer) {
    if (!this.adminPlayer) {
      this.adminPlayer = client;
    }
    if (!this.sessionIdQueue.includes(client.sessionId)) {
      this.sessionIdQueue.push(client.sessionId.toString());
    }
  }

  async OnLeave(client: SandboxPlayer) {
    if (this.sessionIdQueue.includes(client.sessionId)) {
      this.nowGame.LeavePlayer(client);
      const leavePlayerIndex = this.sessionIdQueue.indexOf(client.sessionId);
      this.sessionIdQueue.splice(leavePlayerIndex, 1);
      if (leavePlayerIndex == 0) {
        console.log(`master->, ${this.sessionIdQueue[0]}`);
        this.server.broadcast(MESSAGE.MasterResponse, this.sessionIdQueue[0]);
      }
      if (this.sessionIdQueue.length > 0) {
        this.adminPlayer = this.server.loadPlayer(this.sessionIdQueue[0]);
      }
      this.playerWeaponInfo.delete(client.sessionId);
    }
  }

  OnTick(deltaTime: number) {}

  ForCustomize() {
    this.server.onMessage(MESSAGE.StartInfoReq, async (client) => {
      const db: DataStorage = client.loadDataStorage();
      let last = (await db.get('lastEquipWeapon')) as string;
      if (!last) {
        last = '1';
      }
      let playerweapon: string[] = [];
      this.playerWeaponInfo.forEach((values, key, obj) => {
        playerweapon.push(key + ' ' + values);
      });
      client.send('StartInfoRes', {lastEquipWeapon: last, playerWeapon: playerweapon});
      if (this.isGameRunning) {
        client.send('NowGameRes', {gameName: this.nowGame.GameName});
      }

      if (this.masterUserId.includes(client.userId)) {
        const db: DataStorage = client.loadDataStorage();
        let item = (await db.get('masteritem')) as boolean;
        if (!item) {
          const currency = await loadCurrency(client.userId);
          await currency.credit('zepetogunsgold', 5000000);
          db.set('masteritem', true);
        }
      }
    });

    this.server.onMessage(MESSAGE.OpenGameReq, (client, message) => {
      this.isGameRunning = true;
      this.nowGame = new GameManager(this, client, message.gameName, true);
      this.nowGame.Start();
    });

    this.server.onMessage(MESSAGE.GameStartBtnReq, (client, message) => {
      if (this.isGameRunning) {
        this.nowGame.JoinPlayer(client);
      } else {
        let admin: boolean = false;
        if (client.sessionId === this.adminPlayer.sessionId) {
          admin = true;
        }
        client.send('GameStartBtnRes', {isAdmin: admin});
      }
    });

    this.server.onMessage(MESSAGE.LeaveGameReq, (client, message) => {
      this.server.broadcast('LeaveGameRes', {player: client.sessionId});
      this.nowGame.LeavePlayer(client);
    });

    this.server.onMessage(MESSAGE.RespawnReq, (client) => {
      let team = this.nowGame.GetTeam(client);
      this.server.broadcast('RespawnRes', {player: client.sessionId, team: team});
    });

    this.server.onMessage(MESSAGE.SpineAngle, (client, message) => {
      this.server.broadcast('SpineAngleRes', {
        player: client.sessionId,
        spineAngle: message.spineAngle,
      });
    });

    this.server.onMessage(MESSAGE.PlayerHit, (client, message) => {
      console.log('ph', message.player);
      if (this.HittedPlayer.includes(message.player)) {
        this.HittedPlayer.slice(this.HittedPlayer.indexOf(message.player), 1);
        this.server.broadcast('PlayerHitRes', {player: message.player});
      } else {
        this.HittedPlayer.push(message.player);
      }
    });

    this.server.onMessage(MESSAGE.MyPlayerHit, (client, message) => {
      console.log('mph', client.sessionId);
      if (this.HittedPlayer.includes(client.sessionId)) {
        this.HittedPlayer.slice(this.HittedPlayer.indexOf(client.sessionId), 1);
        this.server.broadcast('PlayerHitRes', {player: client.sessionId});
      } else {
        this.HittedPlayer.push(client.sessionId);
      }
    });

    this.server.onMessage(MESSAGE.EqiupGunReq, (client, message) => {
      const db: DataStorage = client.loadDataStorage();
      db.set('lastEquipWeapon', message.name);
      this.playerWeaponInfo.set(client.sessionId, message.name);
      this.server.broadcast('EqiupGunRes', {player: client.sessionId, name: message.name});
    });

    this.server.onMessage(MESSAGE.SiegeReq, (client, message) => {
      this.server.broadcast('SiegeRes', {player: client.sessionId, team: message.team});
      this.nowGame.Siege(message.team);
    });

    this.server.onMessage(MESSAGE.GetFlagReq, (client, message) => {
      this.server.broadcast('GetFlagRes', {player: client.sessionId, team: message.team});
      this.nowGame.GetFlag(message.team);
      this.Flagger = client.sessionId;
    });

    this.server.onMessage(MESSAGE.FreeFlag, (client) => {
      this.Flagger = '';
      this.nowGame.FreeFlag();
    });

    this.server.onMessage(MESSAGE.FlaggerReq, (client) => {
      if (this.Flagger.length > 0) {
        client.send('FlaggerRes', {
          team: this.nowGame.GetTeam(this.server.loadPlayer(this.Flagger)),
          flagger: this.Flagger,
        });
      }
    });

    this.server.onMessage(MESSAGE.SiegeTeamReq, (client) => {
      client.send('SiegeTeamRes', {team: this.nowGame.WinningTeam});
    });

    this.server.onMessage(MESSAGE.GameVote, (client, message) => {
      this.gameVote.Vote(client.sessionId, message.gameName);
      this.server.broadcast('Vote', {
        player: client.sessionId,
        userId: client.userId,
        gameName: message.gameName,
      });
    });

    this.server.onMessage(MESSAGE.EjectReq, (client, message) => {
      this.server.broadcast('EjectRes', {player: client.sessionId, dir: message.dir});
    });
  }

  ForBasic() {
    /**Zepeto Player Sync**/
    this.server.onMessage(MESSAGE.SyncPlayer, (client, message) => {
      const player = this.server.state.players.get(client.sessionId);
      if (player) {
        const animationParam = new ZepetoAnimationParam();
        player.animationParam = Object.assign(animationParam, message.animationParam);
        player.gestureName = message.gestureName ?? null;

        if (message.playerAdditionalValue) {
          const pAdditionalValue = new PlayerAdditionalValue();
          player.playerAdditionalValue = Object.assign(
            pAdditionalValue,
            message.playerAdditionalValue,
          );
        }
      }
    });

    /**Transform Sync**/
    this.server.onMessage(MESSAGE.SyncTransform, (client, message) => {
      const {Id, position, localPosition, rotation, scale, sendTime} = message;
      let syncTransform = this.server.state.SyncTransforms.get(Id.toString());

      if (!syncTransform) {
        syncTransform = new SyncTransform();
        this.server.state.SyncTransforms.set(Id.toString(), syncTransform);
      }

      Object.assign(syncTransform.position, position);
      Object.assign(syncTransform.localPosition, localPosition);
      Object.assign(syncTransform.rotation, rotation);
      Object.assign(syncTransform.scale, scale);
      syncTransform.sendTime = sendTime;
    });

    this.server.onMessage(MESSAGE.SyncTransformStatus, (client, message) => {
      const syncTransform = this.server.state.SyncTransforms.get(message.Id);
      if (syncTransform !== undefined) {
        syncTransform.status = message.Status;
      }
    });

    /** Sync Animaotr **/
    this.server.onMessage(MESSAGE.SyncAnimator, (client, message) => {
      const animator: SyncAnimator = {
        Id: message.Id,
        clipNameHash: message.clipNameHash,
        clipNormalizedTime: message.clipNormalizedTime,
      };
      const masterClient = this.masterClient();
      if (masterClient !== null && masterClient !== undefined) {
        this.server.broadcast(MESSAGE.ResponseAnimator + message.Id, animator, {
          except: masterClient,
        });
      }
    });

    /** SyncTransform Util **/
    this.server.onMessage(MESSAGE.ChangeOwner, (client, message: string) => {
      this.server.broadcast(MESSAGE.ChangeOwner + message, client.sessionId);
    });
    this.server.onMessage(MESSAGE.Instantiate, (client, message: InstantiateObj) => {
      const InstantiateObj: InstantiateObj = {
        Id: message.Id,
        prefabName: message.prefabName,
        ownerSessionId: message.ownerSessionId,
        spawnPosition: message.spawnPosition,
        spawnRotation: message.spawnRotation,
      };
      this.instantiateObjCaches.push(InstantiateObj);
      this.server.broadcast(MESSAGE.Instantiate, InstantiateObj);
    });

    this.server.onMessage(MESSAGE.RequestInstantiateCache, (client) => {
      for (const obj of this.instantiateObjCaches) {
        client.send(MESSAGE.Instantiate, obj);
      }
    });

    /**SyncDOTween**/
    this.server.onMessage(MESSAGE.SyncDOTween, (client, message: syncTween) => {
      const tween: syncTween = {
        Id: message.Id,
        position: message.position,
        nextIndex: message.nextIndex,
        loopCount: message.loopCount,
        sendTime: message.sendTime,
      };
      const masterClient = this.masterClient();
      if (masterClient !== null && masterClient !== undefined) {
        this.server.broadcast(MESSAGE.ResponsePosition + message.Id, tween, {except: masterClient});
      }
    });

    /**Common**/
    this.server.onMessage(MESSAGE.CheckServerTimeRequest, (client, message) => {
      let Timestamp = +new Date();
      client.send(MESSAGE.CheckServerTimeResponse, Timestamp);
    });
    this.server.onMessage(MESSAGE.CheckMaster, (client, message) => {
      console.log(`master->, ${this.sessionIdQueue[0]}`);
      this.server.broadcast(MESSAGE.MasterResponse, this.sessionIdQueue[0]);
    });
    this.server.onMessage(MESSAGE.PauseUser, (client) => {
      if (this.sessionIdQueue.includes(client.sessionId)) {
        const pausePlayerIndex = this.sessionIdQueue.indexOf(client.sessionId);
        this.sessionIdQueue.splice(pausePlayerIndex, 1);

        if (pausePlayerIndex == 0) {
          console.log(`master->, ${this.sessionIdQueue[0]}`);
          this.server.broadcast(MESSAGE.MasterResponse, this.sessionIdQueue[0]);
        }
      }
    });
    this.server.onMessage(MESSAGE.UnPauseUser, (client) => {
      if (!this.sessionIdQueue.includes(client.sessionId)) {
        this.sessionIdQueue.push(client.sessionId);
        this.server.broadcast(MESSAGE.MasterResponse, this.sessionIdQueue[0]);
      }
    });
  }

  ForProduct() {
    this.server.onMessage(MESSAGE.onCredit, (client, message) => {
      const currencyId = message.currencyId;
      const quantity = message.quantity ?? 1;

      //client.send("SyncBalances", {player: client.sessionId});
      this.AddCredit(client, currencyId, quantity);
    });

    this.server.onMessage(MESSAGE.onDebit, (client, message) => {
      console.log(`[onDebit]`);
      const currencyId = message.currencyId;
      const quantity = message.quantity ?? 1;

      this.OnDebit(client, currencyId, quantity);
    });

    this.server.onMessage('onAddInventory', async (client, message) => {
      console.log(`[onAddInventory]`);
      const productId = message.productId;
      const quantity = message.quantity ?? 1;

      try {
        const inventory = await loadInventory(client.userId);
        await inventory.add(productId, quantity);
        client.send('SyncInventories', {productId: productId});
        console.log('success add');
      } catch (e) {
        console.log(`${e}`);
      }
    });

    this.server.onMessage('onUseInventory', (client, message) => {
      console.log(`[onUseInventory]`);
      const productId = message.productId;
      const quantity = message.quantity ?? 1;

      this.UseInventory(client, productId, quantity);
    });

    this.server.onMessage('onRemoveInventory', (client, message) => {
      console.log(`[onRemoveInventory]`);
      const productId = message.productId;

      this.RemoveInventory(client, productId);
    });
  }

  public GameStart(client: SandboxPlayer, gameName: string) {
    client.send('OpenGameRes', {gameName: gameName});
    this.server.broadcast('NowGameRes', {gameName: this.nowGame.GameName});
  }

  public GameJoin(client: SandboxPlayer, teamA: string[], teamB: string[], team: string) {
    this.server.broadcast('GameJoinRes', {
      player: client.sessionId,
      teamA: teamA,
      teamB: teamB,
      team: team,
    });
  }

  public WaitForNextGame(client: SandboxPlayer) {
    client.send('WaitForNextGame', {player: client.sessionId});
  }

  public ChangeAdmin(sessionId: string) {
    this.adminPlayer = this.server.loadPlayer(sessionId);
    this.server.loadPlayer(sessionId).send('AdminChanged', {player: sessionId});
  }

  public GameOver() {
    this.isGameRunning = false;
    this.nowGame.Destroy();
    this.nowGame = null;
  }

  public EndGame(winningTeam: string, winningTeamPlayers: string[], players: string[]) {
    for (let i = 0; i < winningTeamPlayers.length; i++) {
      this.Reward(this.server.loadPlayer(winningTeamPlayers[i]), 'zepetogunsgold', 100);
      this.Reward(this.server.loadPlayer(winningTeamPlayers[i]), 'zepetogunsdia', 10);
    }
    for (let i = 0; i < players.length; i++) {
      this.server.loadPlayer(players[i]).send('EndGame', {winningTeam: winningTeam});
    }
    this.isGameRunning = false;
    this.gameVote = new GameVoteTimer(this, players);
    this.gameVote.Start();
    this.nowGame = null;
  }

  public UrgeGameStart(client: SandboxPlayer, cnt: number) {
    if (!this.isGameRunning) {
      if (cnt > 1) {
        this.kickPlayer(client, client.sessionId);
        //  플레이어 퇴장
      } else {
        client.send('UrgeGameStart', {player: client.sessionId});
      }
    }
  }

  public SendGameTime(cnt: number) {
    this.server.broadcast('GameTime', {time: cnt});
  }

  public SendVoteTime(cnt: number) {
    this.server.broadcast('VoteTime', {time: cnt});
  }

  async kickPlayer(client: SandboxPlayer, userId: string) {
    let player: SandboxPlayer;
    if (userId == null) {
      player = client;
    } else {
      const kickPlayerSessionId: string = this.server.state.players.get(userId).sessionId;
      player = this.server.loadPlayer(kickPlayerSessionId);
    }

    console.log(`try kick : ${player.userId}`);
    await this.server.kick(player);

    this.server.broadcast('Log', `kick : ${player.userId}`);
  }

  async UseInventory(client: SandboxPlayer, productId: string, quantity: number) {
    try {
      const inventory = await loadInventory(client.userId);
      if ((await inventory.use(productId, quantity)) === true) {
        client.send('SyncInventories', {productId: productId});
      } else {
        console.log('use error');
      }
    } catch (e) {
      console.log(`${e}`);
    }
  }

  async RemoveInventory(client: SandboxPlayer, productId: string) {
    try {
      const inventory = await loadInventory(client.userId);
      if ((await inventory.remove(productId)) === true) {
        client.send('SyncInventories', {productId: productId});
      } else {
        console.log('remove error');
      }
    } catch (e) {
      console.log(`${e}`);
    }
  }

  async AddCredit(client: SandboxPlayer, currencyId: string, quantity: number) {
    // try {
    //     const currency = await loadCurrency(client.userId);
    //     await currency.credit(currencyId, quantity);
    //
    //     client.send("SyncBalances");
    // }
    // catch (e)
    // {
    //     console.log(`${e}`);
    // }
    const currency = await loadCurrency(client.userId);
    await currency.credit(currencyId, quantity);

    client.send('SyncBalances', {player: client.sessionId});
    //client.send("SyncBalances");
  }

  async OnDebit(client: SandboxPlayer, currencyId: string, quantity: number) {
    try {
      const currency = await loadCurrency(client.userId);
      if ((await currency.debit(currencyId, quantity)) === true) {
        // const currencySync: CurrencyMessage = {
        //     currencyId: currencyId,
        //     quantity: -quantity
        // }
        client.send('SyncBalances');
      } else {
        //It's usually the case that there's no balance.
        client.send('DebitError', 'Currency Not Enough');
      }
    } catch (e) {
      console.log(`${e}`);
    }
  }

  async Reward(client: SandboxPlayer, currencyId: string, quantity: number) {
    const currency = await loadCurrency(client.userId);
    await currency.credit(currencyId, quantity);

    client.send('Reward', {player: client.sessionId, currencyId: currencyId, quantity: quantity});
  }

  GameVoteEnd(gameName: string, voters: string[]) {
    this.isGameRunning = true;
    this.nowGame = new GameManager(this, this.adminPlayer, gameName, false);
    this.nowGame.Start();
    this.server.broadcast('NowGameRes', {gameName: gameName});
    this.server.broadcast('VoteEnd', {voters: voters});
  }
}
interface syncTween {
  Id: string;
  position: sVector3;
  nextIndex: number;
  loopCount: number;
  sendTime: number;
}

interface SyncAnimator {
  Id: string;
  clipNameHash: number;
  clipNormalizedTime: number;
}

interface InstantiateObj {
  Id: string;
  prefabName: string;
  ownerSessionId?: string;
  spawnPosition?: sVector3;
  spawnRotation?: sQuaternion;
}

enum MESSAGE {
  SyncPlayer = 'SyncPlayer',
  SyncTransform = 'SyncTransform',
  SyncTransformStatus = 'SyncTransformStatus',
  SyncAnimator = 'SyncAnimator',
  ResponseAnimator = 'ResponseAnimator',
  ChangeOwner = 'ChangeOwner',
  Instantiate = 'Instantiate',
  RequestInstantiateCache = 'RequestInstantiateCache',
  ResponsePosition = 'ResponsePosition',
  SyncDOTween = 'SyncDOTween',
  CheckServerTimeRequest = 'CheckServerTimeRequest',
  CheckServerTimeResponse = 'CheckServerTimeResponse',
  CheckMaster = 'CheckMaster',
  MasterResponse = 'MasterResponse',
  PauseUser = 'PauseUser',
  UnPauseUser = 'UnPauseUser',

  /** Sample Code **/

  GameStartBtnReq = 'GameStartBtnReq',
  LeaveGameReq = 'LeaveGameReq',
  RespawnReq = 'RespawnReq',
  SpineAngle = 'SpineAngle',
  PlayerHit = 'PlayerHit',
  MyPlayerHit = 'MyPlayerHit',
  EqiupGunReq = 'EqiupGunReq',
  SiegeReq = 'SiegeReq',
  GetFlagReq = 'GetFlagReq',
  StartInfoReq = 'StartInfoReq',
  FreeFlag = 'FreeFlag',
  onCredit = 'onCredit',
  onDebit = 'onDebit',
  GameVote = 'GameVote',
  EjectReq = 'EjectReq',
  OpenGameReq = 'OpenGameReq',
  FlaggerReq = 'FlaggerReq',
  SiegeTeamReq = 'SiegeTeamReq',
}
