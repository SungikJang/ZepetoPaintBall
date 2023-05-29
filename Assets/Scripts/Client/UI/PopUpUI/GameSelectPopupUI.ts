import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import {Button, Image} from 'UnityEngine.UI'
import { TMP_Text } from 'TMPro';
import Manager, { InterManager } from '../../Manager/Manager';
import IOC from '../../IOC';

export default class WeaponPopupUI extends ZepetoScriptBehaviour {
    public flagBtn: Button;
    public seigeBtn: Button;
    public soloFlagBtn: Button;
    private manager: InterManager;
    

    Start() {
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.flagBtn.onClick.AddListener(()=>{
            this.manager.FlagGame.GameStart(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id);
        });
        this.seigeBtn.onClick.AddListener(()=>{
            this.manager.SeigeGame.GameStart(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id);
        });
        this.soloFlagBtn.onClick.AddListener(()=>{
            this.manager.SoloFlagGame.GameStart(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id);
        });
    }

}