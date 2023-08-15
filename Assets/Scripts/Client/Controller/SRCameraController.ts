import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import {WaitForSeconds, Vector3} from 'UnityEngine';

export default class SRCameraController extends ZepetoScriptBehaviour {
  Start() {
    this.StartCoroutine(this.SetPlayerParent());
  }

  Update() {
    if (ZepetoPlayers.instance.LocalPlayer) {
      this.gameObject.transform.rotation =
        ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.gameObject.transform.rotation;
    }
  }

  *SetPlayerParent() {
    while (true) {
      if (ZepetoPlayers.instance.LocalPlayer) {
        this.gameObject.transform.SetParent(
          ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.transform,
        );
        this.gameObject.transform.localPosition = new Vector3(0, 1, 0);
      }
      yield new WaitForSeconds(0.1);
    }
  }
}
