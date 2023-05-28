import { GameObject } from 'UnityEngine'
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class ControllerUI extends ZepetoScriptBehaviour {
    public padObject: GameObject;
    public jumpObject: GameObject;
    public jumpBtn: Button;

    Start() {
        this.padObject.SetActive(false);
        this.jumpObject.SetActive(false);
        this.jumpBtn.onClick.AddListener(()=>{
            
        });
    }

}