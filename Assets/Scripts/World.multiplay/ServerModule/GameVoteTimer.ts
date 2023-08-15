import SyncComponentModule from './Modules/SyncComponentModule';

export interface IGameVoteTimer {
  Start(): void;

  Destroy(): void;

  GameVoteEnd(): void;

  Vote(player: string, gameName: string): void;
}

export default class GameVoteTimer implements IGameVoteTimer {
  private timer: number | undefined;
  private interval: number;
  private scm: SyncComponentModule;
  private flagCnt: number = 0;
  private siegeCnt: number = 0;
  private soloFlagCnt: number = 0;
  private flagList: string[];
  private siegeList: string[];
  private soloFlagList: string[];
  private voters: string[];
  private cnt: number = 0;

  constructor(scm: SyncComponentModule, voters: string[]) {
    this.scm = scm;
    this.voters = voters;
    this.siegeList = [];
    this.flagList = [];
    this.soloFlagList = [];
    this.interval = 1000;
  }

  Start() {
    this.timer = setInterval(() => {
      this.scm.SendVoteTime(this.cnt);
      this.cnt += 1;
      if (this.cnt > 15) {
        this.GameVoteEnd();
      }
    }, this.interval);
  }

  Vote(player: string, gameName: string) {
    if (this.flagList.includes(player)) {
      this.flagList.splice(this.siegeList.indexOf(player), 1);
      this.flagCnt -= 1;
    }
    if (this.siegeList.includes(player)) {
      this.siegeList.splice(this.siegeList.indexOf(player), 1);
      this.siegeCnt -= 1;
    }
    if (this.soloFlagList.includes(player)) {
      this.soloFlagList.splice(this.siegeList.indexOf(player), 1);
      this.soloFlagCnt -= 1;
    }
    switch (gameName) {
      case 'Flag':
        this.flagCnt += 1;
        break;
      case 'Siege':
        this.siegeCnt += 1;
        break;
      case 'SoloFlag':
        this.soloFlagCnt += 1;
        break;
    }
  }

  GameVoteEnd() {
    const max = this.arrayMax([this.flagCnt, this.siegeCnt, this.soloFlagCnt]);
    if (this.flagCnt === max) {
      this.scm.GameVoteEnd('Flag', this.voters);
      this.Destroy();
      return;
    }
    if (this.siegeCnt === max) {
      this.scm.GameVoteEnd('Siege', this.voters);
      this.Destroy();
      return;
    }
    if (this.soloFlagCnt === max) {
      this.scm.GameVoteEnd('SoloFlag', this.voters);
      this.Destroy();
      return;
    }
  }

  Destroy() {
    clearInterval(this.timer);
  }

  arrayMax(arr: number[]) {
    // 배열의 요소가 무조건 존재할 경우 max = arr[0]로 변경 가능
    var len = arr.length,
      max = -Infinity;
    while (len--) {
      if (arr[len] > max) {
        max = arr[len];
      }
    }
    return max;
  }
}
