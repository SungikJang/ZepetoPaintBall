import {SpawnInfo, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {WorldService} from 'ZEPETO.World';

export default class PlayerCreator extends ZepetoScriptBehaviour {
  Start() {
    try {
      ZepetoPlayers.instance.CreatePlayerWithUserId('', WorldService.userId, new SpawnInfo(), true);
    } catch (e) {
      console.error(e);
    }
  }
}
