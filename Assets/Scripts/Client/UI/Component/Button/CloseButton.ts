import {GameObject} from 'UnityEngine';
import {Button} from 'UnityEngine.UI';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import Manager from '../../../Manager/Manager';

export default class CloseButton extends ZepetoScriptBehaviour {
  public TargetUIObject: GameObject;
  public closeButton: Button;

  Start() {
    this.closeButton.onClick.AddListener(() => {
      if (this.TargetUIObject.name.includes('PopUp')) {
        Manager.UI.DeletePopUpUI(this.TargetUIObject.name);
      } else {
        this.TargetUIObject.SetActive(false);
      }
    });
  }
}
