import {AudioSource} from 'UnityEngine';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';

export default class SFXController extends ZepetoScriptBehaviour {
  private static _instance: SFXController;

  public static get Instance() {
    return this._instance;
  }
  public static set Instance(value) {
    SFXController._instance = value;
  }

  public ShootSound: AudioSource;

  Awake() {
    SFXController._instance = this;
  }

  Start() {}

  PlayShootSound() {
    if (this.ShootSound) {
      this.ShootSound.Play();
    }
  }
}
