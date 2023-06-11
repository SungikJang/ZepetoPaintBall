import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import {Button, Image} from 'UnityEngine.UI'
import { TMP_Text } from 'TMPro';
import Manager, { InterManager } from '../../Manager/Manager';
import IOC from '../../IOC';

export default class GameSelectPopupUI extends ZepetoScriptBehaviour {
    public flagBtn: Button;
    public seigeBtn: Button;
    public soloFlagBtn: Button;
    public Btn1: Button;
    public Btn2: Button;
    public Btn3: Button;
    
    private manager: InterManager;
    

    Start() {
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.flagBtn.onClick.AddListener(()=>{
            this.manager.FlagGame.GameStart(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id);
            this.manager.UI.DeletePopUpUI()
        });
        this.seigeBtn.onClick.AddListener(()=>{
            this.manager.SeigeGame.GameStart(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id);
            this.manager.UI.DeletePopUpUI()
        });
        this.soloFlagBtn.onClick.AddListener(()=>{
            this.manager.SoloFlagGame.GameStart(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id);
            this.manager.UI.DeletePopUpUI()
        });
        this.Btn1.onClick.AddListener(()=>{
            
        });
        this.Btn2.onClick.AddListener(()=>{

        });
        this.Btn3.onClick.AddListener(()=>{

        });
    }

}