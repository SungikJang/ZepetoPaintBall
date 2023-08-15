import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {Image} from 'UnityEngine.UI';
import {WaitForSeconds, GameObject} from 'UnityEngine';

export default class ReloadLoadingUI extends ZepetoScriptBehaviour {
  public loadSlider: Image;

  Start() {
    this.loadSlider.fillAmount = 0;
    this.StartCoroutine(this.startFill());
  }

  *startFill() {
    while (true) {
      this.loadSlider.fillAmount += 0.05;
      if (this.loadSlider.fillAmount >= 1) {
        GameObject.Destroy(this.gameObject);
      }
      yield new WaitForSeconds(0.1);
    }
  }
}
