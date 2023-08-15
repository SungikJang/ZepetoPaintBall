import SyncComponentModule from './Modules/SyncComponentModule';
import {SandboxPlayer} from 'ZEPETO.Multiplay';

export interface IGameManager {
  Start(): void;

  Destroy(): void;

  JoinPlayer(client: SandboxPlayer): void;

  EndGame(): void;

  GetFlag(team: string): void;

  Siege(team: string): void;

  GetTeam(client: SandboxPlayer): void;
}

export default class GameManager implements IGameManager {
  private timer: number | undefined;
  private interval: number;
  private scm: SyncComponentModule;
  private cnt = 0;
  private gameName: string;
  private players: string[];
  private teamA: string[];
  private teamB: string[];
  private soloPlayers: string[];
  private Starter: SandboxPlayer;
  private winningTeam: string = '';
  private isFirst: boolean;
  private playercnt: number = 0;

  constructor(scm: SyncComponentModule, client: SandboxPlayer, gameName: string, first: boolean) {
    this.scm = scm;
    this.interval = 1000;
    this.gameName = gameName;
    this.teamA = [];
    this.teamB = [];
    this.soloPlayers = [];
    this.players = [];
    this.Starter = client;
    this.isFirst = first;
  }

  Start() {
    if (this.isFirst) {
      this.players.push(this.Starter.sessionId);
      this.playercnt += 1;
      if (this.gameName.includes('Solo')) {
        this.soloPlayers.push(this.Starter.sessionId);
      } else {
        this.teamA.push(this.Starter.sessionId);
      }
    }
    this.scm.GameStart(this.Starter, this.gameName);
    this.timer = setInterval(() => {
      this.scm.SendGameTime(this.cnt);
      this.cnt += 1;
      if (this.cnt > 420) {
        this.EndGame();
        this.Destroy();
      }
    }, this.interval);
  }

  JoinPlayer(client: SandboxPlayer) {
    this.playercnt += 1;
    if (this.cnt > 404) {
      this.scm.WaitForNextGame(client);
      return;
    }
    this.players.push(client.sessionId);
    if (this.gameName === 'SoloFlag') {
      this.soloPlayers.push(client.sessionId);
      this.scm.GameJoin(client, this.players, this.teamB, 'Solo');
    } else {
      if (this.teamA.length > this.teamB.length) {
        this.teamB.push(client.sessionId);
        this.scm.GameJoin(client, this.teamA, this.teamB, 'B');
      } else {
        this.teamA.push(client.sessionId);
        this.scm.GameJoin(client, this.teamA, this.teamB, 'A');
      }
    }
  }

  LeavePlayer(client: SandboxPlayer) {
    this.playercnt -= 1;
    this.players.splice(this.players.indexOf(client.sessionId), 1);
    if (this.teamA.includes(client.sessionId)) {
      this.teamA.splice(this.teamA.indexOf(client.sessionId), 1);
    } else if (this.teamB.includes(client.sessionId)) {
      this.teamB.splice(this.teamB.indexOf(client.sessionId), 1);
    } else {
      this.soloPlayers.splice(this.teamB.indexOf(client.sessionId), 1);
    }

    if (this.playercnt < 1) {
      this.scm.GameOver();
    } else {
      if (this.Starter === client) {
        this.scm.ChangeAdmin(this.players[0]);
      }
    }
  }

  EndGame() {
    if (this.gameName.includes('Solo')) {
      let team: string[] = [];
      team.push(this.winningTeam);
      this.scm.EndGame(this.winningTeam, team, this.players);
    } else {
      if (this.winningTeam === 'A') {
        this.scm.EndGame(this.winningTeam, this.teamA, this.players);
      } else {
        this.scm.EndGame(this.winningTeam, this.teamB, this.players);
      }
    }
  }

  WinningTeam() {
    return this.winningTeam;
  }

  GetFlag(team: string) {
    this.winningTeam = team;
  }

  FreeFlag() {
    this.winningTeam = '';
  }

  Siege(team: string) {
    this.winningTeam = team;
  }

  Destroy() {
    clearInterval(this.timer);
  }

  GetTeam(client: SandboxPlayer) {
    if (this.teamA.includes(client.sessionId)) {
      return 'A';
    } else if (this.teamB.includes(client.sessionId)) {
      return 'B';
    } else {
      return 'Solo';
    }
  }

  GetPlayers() {
    return this.players;
  }

  get GameName() {
    return this.gameName;
  }
}
