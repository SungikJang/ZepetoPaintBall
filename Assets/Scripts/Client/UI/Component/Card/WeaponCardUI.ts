import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Button, Slider} from 'UnityEngine.UI'
import { TMP_Text } from 'TMPro';

export default class WeaponCardUI extends ZepetoScriptBehaviour {
    public upperLeftNumText: TMP_Text;
    public Stars: GameObject;
    public powerFill: Slider;
    public SpeedFill: Slider;
    public WeaponCardBtn: Button;
    

    Start() {
        this.WeaponCardBtn.onClick.AddListener(() => {
            // 무기 창 떠야된다고 알림 -> StartUI가 받아야함
            console.log("무기창띄워라")
        });
    }

}